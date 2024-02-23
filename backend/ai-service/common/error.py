# -*- coding:utf-8 -*-

class HTTPError(Exception):
    code = 'internal_server_error'
    message = "发生未知异常请稍后重试"

    def __init__(self, message=None, code=None) -> None:
        if code is not None:
            self.code = code
        if message is not None:
            self.message = message

    def __str__(self):
        return self.message


class BusinessError(HTTPError):
    code = 'business_error'
    message = "业务异常"


class ContentModerationBlockError(BusinessError):
    code = 'content_moderation_block'
    message = "文档内容审核不通过"


class DocumentContentTooLongError(HTTPError):
    code = 'document_content_too_long'
    message = "文档内容过长, 超过token限制"


class DocumentContentEmptyError(BusinessError):
    code = 'document_content_empty'
    message = "文档内容不能为空"
