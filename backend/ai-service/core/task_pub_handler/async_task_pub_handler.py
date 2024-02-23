import json
from uuid import uuid4 as uuid

import openai

from common import global_logger
from common.error import HTTPError
from extension.ext_redis import redis_client

from enum import Enum

logging = global_logger.get_logger()


class TaskStatus(Enum):
    unknown = 0
    created = 1
    parse = 2
    generating = 3
    done = 4
    send = 5
    error = 10


TASK_STATUS_DICT = {}
for _value in [s.value for s in TaskStatus]:
    _status = TaskStatus(_value)
    TASK_STATUS_DICT[_status.name] = _status

TASK_STAGES = [
    TaskStatus.created,
    TaskStatus.parse,
    TaskStatus.generating,
    TaskStatus.done,
    TaskStatus.send,
    TaskStatus.error
]


def task_result_key(task_id: str):
    return f'{task_id}:result'


def task_state_key(task_id: str):
    return f'{task_id}:state'


def handle_text(task_id: str, message_type: str, content, done=False):
    if not done and not content:
        return
    key = task_result_key(task_id)
    msg = {'type': message_type, 'content': content}
    if done:
        msg['done'] = True
    redis_client.rpush(key, json.dumps(msg, ensure_ascii=False))
    redis_client.expire(key, 60 * 60)


def handle_error(e: Exception, task_id: str):
    error = HTTPError()
    if isinstance(e, (openai.error.OpenAIError, HTTPError)):
        error = HTTPError(str(e), e.code)
    error_info = json.dumps({'code': error.code, 'message': str(error)}, ensure_ascii=False)
    msg = json.dumps({'type': 'error', 'content': error_info, 'done': True}, ensure_ascii=False)
    key = task_result_key(task_id)
    redis_client.rpush(key, msg)
    redis_client.expire(key, 60 * 60)
    set_task_status(task_id, TaskStatus.error, 0, error_info)


def create_task():
    task_id = str(uuid())
    key = task_state_key(task_id)
    redis_client.hsetnx(key, 'status', TaskStatus.created.name)
    redis_client.expire(key, 60 * 60)
    return task_id


def set_task_status(task_id: str, status: TaskStatus, progress=0, message=None):
    assert status in TASK_STAGES
    lock = redis_client.lock(name=f'lock:set_task_status:{task_id}', timeout=60)
    try:
        lock.acquire()
        key = task_state_key(task_id)
        if status == TaskStatus.error:
            redis_client.hset(key, TaskStatus.error.name, message)
        else:
            redis_client.hset(key, 'status', status.name)
            redis_client.hset(key, f'{status.name}_progress', progress)
    finally:
        lock.release()


def set_save_document_finished(task_id: str):
    lock = redis_client.lock(name=f'lock:set_task_generating_status:{task_id}', timeout=60)
    try:
        lock.acquire()
        key = task_state_key(task_id)
        redis_client.hset(key, 'save_document_finished', '1')
        if redis_client.hget(key, 'save_document_started_generating') == '1':
            set_task_status(task_id, TaskStatus.generating, 100)
    finally:
        lock.release()


def set_summary_document_started_generating(task_id: str):
    lock = redis_client.lock(name=f'lock:set_task_generating_status:{task_id}', timeout=60)
    try:
        lock.acquire()
        key = task_state_key(task_id)
        redis_client.hset(key, 'save_document_started_generating', '1')
        if redis_client.hget(key, 'save_document_finished') == '1':
            set_task_status(task_id, TaskStatus.generating, 100)
    finally:
        lock.release()


task_stage_progress_points = {
    TaskStatus.parse: [0, 10, 20, 30, 50, 100],
    TaskStatus.generating: [0, 100],
}


def forward_progress(task_id: str):
    lock = redis_client.lock(name=f'lock:set_task_status:{task_id}', timeout=60)
    try:
        lock.acquire()
        key = task_state_key(task_id)
        task_state = redis_client.hgetall(key)
        status = TASK_STATUS_DICT[task_state['status']]
        progress = int(task_state.get(f'{status.name}_progress'))

        step_len = 2
        need_forward = False
        for i in range(len(task_stage_progress_points[status]) - 1):
            curr_point = task_stage_progress_points[status][i]
            next_point = task_stage_progress_points[status][i + 1]
            if curr_point <= progress < next_point:
                need_forward = progress + step_len < next_point
                break
        if need_forward:
            redis_client.hset(key, f'{status.name}_progress', progress + step_len)
    finally:
        lock.release()


def get_task_status(task_id: str):
    task_state = redis_client.hgetall(task_state_key(task_id))
    curr_status = TaskStatus.unknown.name
    curr_progress = 0

    if task_state and task_state != {}:
        if TaskStatus.error.name in task_state:
            error_info = json.loads(task_state.get('error'))
            return {
                'status': TaskStatus.error.name,
                'progress': 0,
                'code': error_info.get('code'),
                'message': error_info.get('message')
            }

        for status in TASK_STAGES:
            progress = task_state.get(f'{status.name}_progress')
            if progress:
                curr_status = status.name
                curr_progress = int(progress)

    total_progress = 0
    if curr_status == TaskStatus.parse.name:
        total_progress = int(curr_progress * 0.3)
    if curr_status == TaskStatus.generating.name:
        total_progress = int(30 + curr_progress * 0.7)

    result = {
        'status': curr_status,
        'progress': curr_progress,
        'total_progress': total_progress,
    }

    if curr_status in [TaskStatus.parse.name, TaskStatus.generating.name]:
        forward_progress(task_id)
    return result


def generate_result(task_id, message_types):
    result_key = task_result_key(task_id)
    done_types = set()
    while True:
        redis_client.keys(result_key)
        data = redis_client.blpop(result_key, timeout=300)
        if not data:
            yield f"{json.dumps([{'type': 'error', 'content': '任务结果获取超时'}], ensure_ascii=False)}\n"
        msg = json.loads(data[1])
        logging.debug(msg)
        if msg.get('type') == 'error':
            yield f'{json.dumps(msg, ensure_ascii=False)}\n'
            break
        if msg.get('done'):
            done_types.add(msg.get('type'))
            if message_types.issubset(done_types):
                yield f'{json.dumps(msg, ensure_ascii=False)}\n'
                break
        yield f'{json.dumps(msg, ensure_ascii=False)}\n'
