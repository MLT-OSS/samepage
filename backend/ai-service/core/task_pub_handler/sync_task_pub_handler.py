import json
from uuid import uuid4 as uuid

import openai

from common import global_logger
from common.error import HTTPError
from extension.ext_redis import redis_client

logging = global_logger.get_logger()


def handle_text(task_id: str, message_type: str, content, done=False):
    if not done and not content:
        return
    msg = {'type': message_type, 'content': content}
    if done:
        msg['done'] = True
    pub_text(task_id, json.dumps(msg, ensure_ascii=False))


def handle_error(e: Exception, task_id: str):
    error = HTTPError()
    if isinstance(e, (openai.error.OpenAIError, HTTPError)):
        error = HTTPError(str(e), e.code)
    error_info = json.dumps({'code': error.code, 'message': str(error)}, ensure_ascii=False)
    msg = json.dumps({'type': 'error', 'content': error_info, 'done': True}, ensure_ascii=False)
    pub_text(task_id, msg)


def create_task():
    return str(uuid())


def set_task_status(task_id: str, status=None, progress=0, message=None):
    pass


def get_task_status(task_id: str):
    pass


def generate_channel_name(task_id: str):
    return f'generate_result:{task_id}'


def pub_text(task_id: str, text: str):
    redis_client.publish(generate_channel_name(task_id), text)


def generate_result(task_id, message_types):
    pubsub = redis_client.pubsub()
    pubsub.subscribe(generate_channel_name(task_id))
    done_types = set()
    for message in pubsub.listen():
        if message["type"] == "message":
            msg = message["data"]
            logging.debug(msg)
            msg_dict = json.loads(msg)
            if msg_dict.get('type') == 'error':
                yield f"{msg}\n"
                break
            if msg_dict.get('done'):
                done_types.add(msg_dict.get('type'))
                if message_types.issubset(done_types):
                    yield f"{msg}\n"
                    break
            yield f"{msg}\n"
