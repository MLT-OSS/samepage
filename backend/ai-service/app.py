#!/usr/bin/env python3
# -*-coding:utf8-*-

import json

from flask import Flask, request, Response, stream_with_context, copy_current_request_context
from flask_restful import Api
import time

from common.error import BusinessError
from conf.config import Config
from extension import ext_redis, ext_celery, ext_database
from common import global_logger
import threading

from core.chat_task import ChatTask
from core.summary_task import SummaryTask
from task.summary_task import summary_task
from core.task_pub_handler import sync_task_pub_handler, async_task_pub_handler
from util import md5_util
from util import tokens
from anthropic import HUMAN_PROMPT, AI_PROMPT

logging = global_logger.get_logger()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config())
    initialize_extensions(app)
    return app


def initialize_extensions(app):
    ext_database.init_app(app)
    ext_redis.init_app(app)
    # ext_storage.init_app(app)
    ext_celery.init_app(app)


app = create_app()
api = Api(app)
celery = app.extensions["celery"]


@app.post("/api/task/summary_document")
def submit_summary_document_task():
    params = request.get_json()
    logging.info(f"POST /api/task/summary_document {params}")
    document_text = params.get('document_text')
    document_url = params.get('document_url')
    document_type = params.get('document_type', 'text')
    lang = params.get('lang', 'chinese')
    document_id = ''

    if document_text:
        document_id = md5_util.md5(document_text)
    elif document_url:
        document_id = document_url.split('?')[0].split('/')[-1]

    task_id = async_task_pub_handler.create_task()
    logging.info(f'创建任务: {task_id}')
    task = summary_task.apply_async(args=[document_text, document_url, document_type, document_id, lang, task_id], task_id=task_id)
    return {'document_id': document_id, 'task_id': task.id}


@app.get("/api/task/summary_document/status")
def get_task_status():
    task_id = request.args.get("task_id")
    logging.info(f"POST /api/task/summary_document/status {task_id}")
    return json.dumps(async_task_pub_handler.get_task_status(task_id), ensure_ascii=False)


@app.get("/api/task/summary_document/result")
def summary_document_task_result():
    task_id = request.args.get("task_id")
    logging.info(f"POST /api/task/summary_document/result {task_id}")

    task_status = async_task_pub_handler.get_task_status(task_id)
    if task_status['status'] == async_task_pub_handler.TaskStatus.unknown.name:
        return Response(stream_with_context(gen_error(BusinessError('任务不存在'))), mimetype="text/event-stream")

    if task_status['status'] == async_task_pub_handler.TaskStatus.error.name:
        return Response(stream_with_context(gen_error(BusinessError('任务执行失败'))), mimetype="text/event-stream")

    if task_status['status'] == async_task_pub_handler.TaskStatus.send.name:
        return Response(stream_with_context(gen_error(BusinessError('任务结果已返回, 不可重复获取'))), mimetype="text/event-stream")

    if int(task_status['total_progress']) < 100:
        return Response(stream_with_context(gen_error(BusinessError('任务未完成'))), mimetype="text/event-stream")

    async_task_pub_handler.set_task_status(task_id, async_task_pub_handler.TaskStatus.send)

    return Response(stream_with_context(async_task_pub_handler.generate_result(
        task_id,
        {'save_document', 'summary', 'suggested_questions'}
    )), mimetype="text/event-stream")


@app.post("/api/summary_document/regen")
def summary_document_regen():
    params = request.get_json()
    logging.info(f"POST /api/summary_document/regen {params}")
    document_id = params.get('document_id')
    document_type = params.get('document_type', 'text')
    lang = params.get('lang', 'chinese')

    task_id = async_task_pub_handler.create_task()
    logging.info(f'创建任务: {task_id}')

    @copy_current_request_context
    def run_task(_document_id, _document_type, _lang, _task_id):
        SummaryTask(
            task_id=_task_id,
            task_pub_handler=async_task_pub_handler,
            document_id=_document_id,
            document_type=_document_type,
            lang=_lang
        ).run()
    threading.Thread(target=run_task, args=(document_id, document_type, lang, task_id)).start()

    while True:
        task_status = async_task_pub_handler.get_task_status(task_id)
        if task_status['status'] == async_task_pub_handler.TaskStatus.error.name:
            return Response(stream_with_context(gen_error(BusinessError('任务执行失败'))), mimetype="text/event-stream")
        if int(task_status['total_progress']) == 100:
            break
        time.sleep(0.5)

    return Response(stream_with_context(async_task_pub_handler.generate_result(
        task_id,
        {'save_document', 'summary', 'suggested_questions'}
    )), mimetype="text/event-stream")


@app.post("/api/chat")
def chat():
    params = request.get_json()
    logging.info(f"POST /api/chat {params}")
    question = params['question']
    history = params.get('history', [])
    document_id = params.get('document_id')
    document_type = params.get('document_type', 'text')
    lang = params.get('lang', 'auto')
    chat_model = params.get('chat_model', 'GPT_3_5_4K')
    web_search = params.get('web_search')

    task_id = sync_task_pub_handler.create_task()

    def run_task(_question, _history, _document_id, _document_type, _lang, _task_id, _chat_model, _web_search):
        ChatTask(_task_id, sync_task_pub_handler, _question, _history, _document_id, _document_type, _lang, _chat_model, _web_search).run()

    threading.Thread(target=run_task, args=(question, history, document_id, document_type, lang, task_id, chat_model, web_search)).start()
    return Response(stream_with_context(sync_task_pub_handler.generate_result(task_id, {'answer'})), mimetype="text/event-stream")

@app.post("/api/tokenizer")
def tokenizer():
    params = request.get_json()
    logging.info(f"POST /api/tokenizer {params}")
    messages = params['messages']
    prompt = ''
    for msg in messages:
        if msg["role"] == "assistant":
            prompt = prompt + AI_PROMPT + msg["content"]
        if msg["role"] == "user":
            prompt = prompt + HUMAN_PROMPT + msg["content"]
    count = tokens.sync_tokens(prompt)
    if count > 100_000:
        return {'token_length': count, 'over_flag': True}
    return {'token_length': count, 'over_flag': False}

def gen_error(error):
    error_info = {'code': error.code, 'message': error.message}
    yield f"{json.dumps({'type': 'error', 'content': json.dumps(error_info, ensure_ascii=False)}, ensure_ascii=False)}\n"


if __name__ == "__main__":
    start = time.time()
    app.run(
        host='0.0.0.0',
        port=8082,
        debug=False,
    )
    end = time.time()
    logging.info(end - start)
