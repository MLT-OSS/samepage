import logging
from typing import List

import tiktoken
from langchain.schema import BaseMessage

from conf import constant


def get_num_tokens(messages: List[BaseMessage]) -> int:
    enc = tiktoken.get_encoding('cl100k_base')
    num_tokens = 0
    for msg in messages:
        num_tokens += len(enc.encode(msg.content))
    return num_tokens


def sub_messages_by_max_token(messages, max_tokens):
    num_tokens = get_num_tokens(messages)
    if num_tokens > max_tokens:
        for i in range(len(messages) - 1):
            sub_messages = messages[i + 1:]
            num_tokens = get_num_tokens(sub_messages)
            if num_tokens <= max_tokens:
                return sub_messages
    return messages


def reduce_messages(chat_model, messages):
    num_tokens = get_num_tokens(messages)
    if chat_model == 'GPT_3_5_4K':
        if num_tokens > 1024 * 3:
            chat_model = 'GPT_3_5_16K'
    if chat_model == 'GPT_3_5_16K':
        messages = sub_messages_by_max_token(messages, 1024 * 12)
    elif chat_model == 'GPT_4':
        messages = sub_messages_by_max_token(messages, 1024 * 6)
    else:
        messages = sub_messages_by_max_token(messages,
                                             int(constant.MODEL_TOKEN_DICT.get(chat_model, 1024 * 3)))
    return messages, get_chat_model_name(chat_model)


def get_chat_model_name(chat_model):
    model = chat_model
    if chat_model == 'GPT_3_5_4K':
        model = constant.OPENAI_CHAT_MODEL_GPT_3_5_4K
    if chat_model == 'GPT_3_5_16K':
        model = constant.OPENAI_CHAT_MODEL_GPT_3_5_16K
    if chat_model == 'GPT_4':
        model = constant.OPENAI_CHAT_MODEL_GPT_4
    return model
