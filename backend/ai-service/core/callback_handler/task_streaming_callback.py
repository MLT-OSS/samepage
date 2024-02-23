import re
from typing import Any, Dict, List, Optional

from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import LLMResult

from common import global_logger
from core.task_pub_handler.async_task_pub_handler import TaskStatus

logging = global_logger.get_logger()


class TaskStreamingCallbackHandler(StreamingStdOutCallbackHandler):
    """Callback handler for streaming. Only works with LLMs that support streaming."""

    def __init__(self, message_type: Optional[str], task_stage=None, task_id=None, total_chat=0, task_pub_handler=None) -> None:
        """Initialize callback handler."""
        self.task_id = task_id
        self.message_type = message_type
        self.total_chat = total_chat
        self.chat_done_count = 0
        self.started_generating = False
        self.task_stage = task_stage
        self.task_pub_handler = task_pub_handler
        self.suggested_question_delta = ''

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Run when LLM starts running."""
        logging.info(prompts)

    def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        """Run on new LLM token. Only available when streaming is enabled."""
        # logging.debug(token)
        if self.task_id and self.chat_done_count >= self.total_chat - 1:
            if self.task_stage == TaskStatus.generating and not self.started_generating:
                self.started_generating = True
                self.task_pub_handler.set_summary_document_started_generating(self.task_id)

            if self.message_type == 'suggested_questions':
                for _token in token:
                    if re.match('^Q\d: ', self.suggested_question_delta):
                        self.task_pub_handler.handle_text(self.task_id, self.message_type, _token)
                    if '\n' in _token:
                        self.suggested_question_delta = ''
                    else:
                        self.suggested_question_delta += _token
            else:
                self.task_pub_handler.handle_text(self.task_id, self.message_type, token)

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        """Run when LLM ends running."""
        logging.info(response)
        self.chat_done_count += 1
