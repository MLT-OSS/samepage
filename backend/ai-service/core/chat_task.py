import json
from typing import Any

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.tools.render import format_tool_to_openai_function
from langchain.vectorstores.pgvector import PGVector, DistanceStrategy

from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage, SystemMessage, FunctionMessage
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

from common import global_logger
from conf import constant
from conf.prompts import (
    WEB_SEARCH_SYSTEM_PROMPT,
    get_qa_system_prompt,
    get_qa_prompt,
    get_qa_with_context_prompt,
)
from core.callback_handler.task_streaming_callback import TaskStreamingCallbackHandler
from core.tool.web_search_tool import WebSearchTool
from util import message_util

logging = global_logger.get_logger()

PG_CONNECTION_STRING = PGVector.connection_string_from_db_params(
    driver=constant.PGVECTOR_DRIVER,
    host=constant.PGVECTOR_HOST,
    port=int(constant.PGVECTOR_PORT),
    database=constant.PGVECTOR_DATABASE,
    user=constant.PGVECTOR_USER,
    password=constant.PGVECTOR_PASSWORD
)

embeddings = OpenAIEmbeddings(
    openai_api_base=constant.OPENAI_API_BASE_BLOCK,
    model=constant.EMBEDDING_MODEL_NAME,
    openai_api_key=constant.OPENAI_API_KEY,
    allowed_special='all',
)


class ChatTask:
    def __init__(self, task_id: str, task_pub_handler, question: str, history: list, document_id: str,
                 document_type: str, lang: str, chat_model: str, web_search: str) -> None:
        self.task_id = task_id
        self.task_pub_handler = task_pub_handler
        self.history = history
        self.document_id = document_id
        self.document_type = document_type
        self.lang = lang
        self.chat_model = chat_model
        self.web_search = web_search

        max_len = constant.QUESTION_MAX_LEN
        if len(question) > max_len:
            question = question[:max_len]
            logging.info(f"question长度超过{max_len}, 已截断, ```{question}...```")
        self.question = question

    def run(self):
        try:
            self.chat()
        except Exception as e:
            logging.error(e, exc_info=True)
            self.task_pub_handler.handle_error(e, self.task_id)
            raise e

    def chat(self):
        logging.info(f'问题: {self.question}')

        history_messages = []
        if self.history and len(self.history):
            for his in self.history:
                if his['role'] == 'user':
                    history_messages.append(HumanMessage(content=his['content']))
                elif his['role'] == 'assistant':
                    history_messages.append(AIMessage(content=his['content']))
                elif his['role'] == 'system':
                    history_messages.append(SystemMessage(content=his['content']))

        system_prompt = SystemMessagePromptTemplate.from_template(get_qa_system_prompt(self.lang))
        if 'lang' in system_prompt.input_variables:
            system_message = system_prompt.format(lang=self.lang)
        else:
            system_message = system_prompt.format()

        model_name = message_util.get_chat_model_name(self.chat_model)
        logging.info(f'模型：{model_name},key:{constant.OPENAI_API_KEY},api:{constant.OPENAI_API_BASE_CHAT}')
        llm = ChatOpenAI(
            openai_api_key=constant.OPENAI_API_KEY,
            openai_api_base=constant.OPENAI_API_BASE_CHAT,
            model_name=model_name,
            callbacks=[TaskStreamingCallbackHandler(task_id=self.task_id, message_type='answer',
                                                    task_pub_handler=self.task_pub_handler)],
            streaming=True,
            # max_tokens=constant.QUESTION_ANSWER_MAX_TOKEN,
        )

        if self.document_id:
            answer = self._chat_with_document(history_messages, system_message, llm)
        elif self.web_search:
            answer = self._chat_with_search(history_messages, system_message, llm)
        else:
            answer = self._chat(history_messages, system_message, llm)

        logging.info(f'回答: {answer}')
        self.task_pub_handler.handle_text(self.task_id, 'answer', None, True)

    def _chat(self, history_messages, system_message, llm):
        logging.info("-" * 40 + 'chat' + '-' * 40)

        chat_prompt = ChatPromptTemplate.from_messages(
            [HumanMessagePromptTemplate.from_template(get_qa_prompt(self.lang))])
        message = chat_prompt.format_prompt(question=self.question, lang=self.lang).to_messages()[0]

        return self._predict_messages(llm, [system_message, *history_messages, message]).content

    def _chat_with_document(self, history_messages, system_message, llm):
        logging.info("-" * 40 + 'chat_with_document' + '-' * 40)

        summary_db = PGVector.from_existing_index(
            embedding=embeddings,
            collection_name=f"{self.document_id}_summary",
            distance_strategy=DistanceStrategy.COSINE,
            connection_string=PG_CONNECTION_STRING,
            pre_delete_collection=False,
        )
        summary_docs = summary_db.similarity_search_with_score(query=self.question, k=1)
        db = PGVector.from_existing_index(
            embedding=embeddings,
            collection_name=self.document_id,
            distance_strategy=DistanceStrategy.COSINE,
            connection_string=PG_CONNECTION_STRING,
            pre_delete_collection=False,
        )
        docs = db.similarity_search_with_score(query=self.question, k=constant.MAX_SIMILARITY_SEARCH_COUNT)
        if len(summary_docs):
            docs.insert(0, summary_docs[0])
        logging.info('命中文档:')
        for doc, score in docs:
            logging.info(f"Score: {score}")
            logging.info(doc.page_content)
            logging.info("-" * 80)
        docs = list(filter(lambda x: x[1] < constant.MAX_SIMILARITY_SEARCH_SCORE, docs))
        sources = []
        for doc, _ in docs:
            source = {'text': doc.page_content}
            if self.document_type == 'pdf':
                if not doc.metadata or doc.metadata == {}:
                    # pdf来源排除长摘要
                    continue
                page = doc.metadata.get('page')
                if page is not None:
                    source['pos'] = [page, page]
            sources.append(source)
        self.task_pub_handler.handle_text(self.task_id, 'sources', json.dumps(sources, ensure_ascii=False), True)
        # llm qa时总是包含长摘要
        texts = list(map(lambda x: x[0].page_content, docs))
        text = '\n\n'.join(texts).replace('\\n', '\n')

        chat_prompt = ChatPromptTemplate.from_messages(
            [HumanMessagePromptTemplate.from_template(get_qa_with_context_prompt(self.lang))])
        message = chat_prompt.format_prompt(text=text, question=self.question, lang=self.lang).to_messages()[0]

        return self._predict_messages(llm, messages=[system_message, *history_messages, message], temperature=0).content

    def _chat_with_search(self, history_messages, system_message, llm):
        logging.info("-" * 40 + 'chat_with_search' + '-' * 40)

        chat_prompt = ChatPromptTemplate.from_messages(
            [HumanMessagePromptTemplate.from_template(get_qa_prompt(self.lang))])
        chat_message = chat_prompt.format_prompt(question=self.question, lang=self.lang).to_messages()[0]
        messages = [system_message, *history_messages]

        tool = WebSearchTool()
        functions = [format_tool_to_openai_function(tool)]
        function_call_arg = {'name': 'web_search'} if self.web_search == 'force' else 'auto'

        function_call_messages = [*messages, SystemMessage(content=WEB_SEARCH_SYSTEM_PROMPT), chat_message]
        logging.info(f'reduce_message:{self.chat_model},dict:{constant.MODEL_TOKEN_DICT}')
        function_call_messages, model = message_util.reduce_messages(self.chat_model, function_call_messages)
        assistant_message = self._predict_messages(
            llm,
            function_call_messages,
            functions=functions,
            function_call=function_call_arg,
            model=model,
        )
        messages.append(assistant_message)

        function_call = assistant_message.additional_kwargs.get('function_call')
        logging.debug(f'function_call: {function_call}')

        if function_call:
            function_name = function_call["name"]
            function_args = json.loads(function_call["arguments"])

            if function_name == "web_search":
                query = function_args.get("query")
                logging.info(f'search_query: {query}')
                self.task_pub_handler.handle_text(self.task_id, 'web_search_input', query, True)

                search_result = tool.run(query)
                search_result_json = json.dumps(search_result, ensure_ascii=False)
                logging.info(f'search_result: {search_result_json}')
                self.task_pub_handler.handle_text(self.task_id, 'web_search_result', search_result_json, True)

                snippets = '\n'.join([res['snippet'] for res in search_result])
                function_msg = FunctionMessage(name=function_name, content=snippets)
                messages.append(function_msg)
            else:
                raise Exception(f'不支持的function: {function_call}')

            messages.append(chat_message)
            messages, model = message_util.reduce_messages(self.chat_model, messages)

            return self._predict_messages(llm, messages=messages, model=model).content

    @staticmethod
    def _predict_messages(llm, messages, **kwargs: Any):
        for msg in messages:
            if not msg.content:
                msg.content = ' '
        return llm.predict_messages(messages, **kwargs)
