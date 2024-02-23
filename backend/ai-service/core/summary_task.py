import asyncio
import json
import re
import time
from concurrent import futures

import tiktoken
from flask import current_app
from langchain import PromptTemplate, LLMChain
from langchain.chains import StuffDocumentsChain, MapReduceDocumentsChain, MapReduceChain
from langchain.document_loaders import PyMuPDFLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.schema import Document, SystemMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores.pgvector import PGVector, DistanceStrategy
from langchain.chains.summarize import load_summarize_chain

from langchain.chat_models import ChatOpenAI

from common import global_logger
from common.error import ContentModerationBlockError, DocumentContentTooLongError, DocumentContentEmptyError
from core.callback_handler.task_streaming_callback import TaskStreamingCallbackHandler
from db import pg_utils
from extension.ext_database import db
from conf import constant
from conf.prompts import (
    SUMMARY_PROMPT,
    SUMMARY_REFINE_PROMPT,
    SUMMARY_REDUCE_PROMPT,
    SUGGESTED_QUESTIONS_PROMPT,
    DETAILED_SUMMARY_PROMPT,
    # DETAILED_SUMMARY_SYSTEM_PROMPT,
    DETAILED_SUMMARY_REDUCE_PROMPT,
    DETAILED_SUMMARY_REFINE_PROMPT,
    SUGGESTED_QUESTIONS_REDUCE_PROMPT,
)
from core.task_pub_handler.async_task_pub_handler import TaskStatus
from extension.ext_redis import redis_client
from model.article_source import ArticleSource
from model.document_parse_result import DocumentParseResult
from util import file_util

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
    chunk_size=16,
    openai_api_base=constant.OPENAI_API_BASE_BLOCK,
    model=constant.EMBEDDING_MODEL_NAME,
    openai_api_key=constant.OPENAI_API_KEY,
    allowed_special='all',
)


class SummaryTask:
    def __init__(self, task_id: str, task_pub_handler, document_text=None, document_url=None, document_type=None,
                 document_id=None, lang='chinese') -> None:
        self.app = current_app._get_current_object()
        self.task_id = task_id
        self.task_pub_handler = task_pub_handler
        self.document_text = document_text
        self.document_url = document_url
        self.document_type = document_type
        self.document_id = document_id
        self.lang = lang
        self.document_file = None
        self.tokens = 0
        self.doc_content_is_less = False

    def run(self):
        logging.info(f'run task: {self.task_id}')

        try:
            # 文档解析阶段
            self.task_pub_handler.set_task_status(self.task_id, TaskStatus.parse, 10)

            # 兼容旧版本历史数据没有长摘要的情况
            if self.document_type == 'text' and not self.document_text and self.document_id:
                article_source = ArticleSource.query.filter_by(doc_id=self.document_id).first()
                if article_source:
                    self.document_text = article_source.source

            # 解析PDF内容
            if self.document_type == 'pdf' and self.document_url:
                self.document_file = file_util.download(self.document_url, self.document_id, self.task_id)
                _, self.document_text = self.load_pdf(self.document_file)

            self.task_pub_handler.set_task_status(self.task_id, TaskStatus.parse, 20)

            # 计算token
            if self.document_text:
                self.tokens = self.get_num_tokens(self.document_text)
                logging.info(f"文档[{self.document_id}] token数: {self.tokens} length: {len(self.document_text)}")

                if self.tokens > constant.DOCUMENT_CONTENT_TOKEN_LIMIT:
                    raise DocumentContentTooLongError()

            self.task_pub_handler.set_task_status(self.task_id, TaskStatus.parse, 30)

            # 文档内容较长时, 需要在解析阶段生成长摘要; 文档内容较短时, 先生成短摘要和问题, 最后生成长摘要
            self.doc_content_is_less = self.tokens <= constant.SUMMARY_TEXT_SPLIT_CHUNK_SIZE * 2

            # 查询和保存中间结果到数据库
            document_parse_result = self.get_parse_result_from_db(self.document_id)
            if not document_parse_result:
                # 延后生成长摘要情况下需要保存原文, 长摘要生成失败后重试时从db获取
                if self.doc_content_is_less:
                    document_parse_result = self.add_document_parse_result(self.document_id, self.document_text)
                else:
                    document_parse_result = self.add_document_parse_result(self.document_id, None)
            else:
                if self.document_text is None:
                    self.document_text = document_parse_result.document_content

            if (
                    not self.document_text or not self.document_text.strip()) and not document_parse_result.detailed_summary:
                raise DocumentContentEmptyError()

            self.task_pub_handler.set_task_status(self.task_id, TaskStatus.parse, 50)

            # 原文内容审核 (仅文档内容较短时)
            # if self.doc_content_is_less:
            #    self.moderation_text(self.document_text, self.document_id)

            self.task_pub_handler.set_task_status(self.task_id, TaskStatus.parse, 100)

            detailed_summary = document_parse_result.detailed_summary
            with futures.ThreadPoolExecutor(max_workers=10) as executor:
                # embedding
                save_document_future = executor.submit(self.save_document, self.document_text, self.document_file,
                                                       self.document_type, self.document_id, self.task_id)

                # 生成阶段
                self.task_pub_handler.set_task_status(self.task_id, TaskStatus.generating, 0)

                # 生成长摘要
                if self.doc_content_is_less:
                    executor.submit(self.detailed_summary_document, self.document_text, self.document_id, self.task_id)
                else:
                    detailed_summary = self.detailed_summary_document(self.document_text, self.document_id,
                                                                      self.task_id)
                    # 长摘要内容审核 (仅文档内容较长时)
                    # self.moderation_text(detailed_summary, self.document_id)

                # 生成短摘要
                executor.submit(self.summary_document, self.document_text, self.lang, detailed_summary, self.task_id)

                # 生成问题
                executor.submit(self.suggested_questions, self.document_text, self.lang, detailed_summary, self.task_id)

                save_document_future.result()
                self.task_pub_handler.set_save_document_finished(self.task_id)
        except Exception as e:
            logging.error(e, exc_info=True)
            self.task_pub_handler.handle_error(e, self.task_id)
            raise e
        finally:
            file_util.delete(self.document_id, self.task_id)

    def save_document(self, document_text: str, document_file: str, document_type: str, document_id: str, task_id: str):
        logging.info("-" * 40 + 'save_document' + '-' * 40)
        logging.info(f'document_id: {document_id}')
        lock = None
        try:
            lock = redis_client.lock(name=f'lock:save_document:{document_id}', timeout=60 * 5)
            lock.acquire()

            document_info = {'document_id': document_id}
            if document_text:
                exceeding_token_limit = self.tokens > constant.SUMMARY_DOCUMENT_CONTENT_TOKEN_LIMIT
                document_info['token'] = self.tokens
                document_info['exceeding_token_limit'] = exceeding_token_limit

            if pg_utils.collection_exist(document_id):
                self.task_pub_handler.handle_text(task_id, 'save_document',
                                                  json.dumps(document_info, ensure_ascii=False), True)
                return

            docs = []
            if document_type == 'text':
                text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
                    model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                    chunk_size=constant.EMBEDDING_TEXT_SPLIT_CHUNK_SIZE,
                    chunk_overlap=constant.EMBEDDING_TEXT_SPLIT_CHUNK_OVERLAP_SIZE,
                    allowed_special='all',
                )
                docs = text_splitter.create_documents([document_text])

            if document_type == 'pdf':
                text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
                    model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                    chunk_size=constant.EMBEDDING_PDF_TEXT_SPLIT_CHUNK_SIZE,
                    chunk_overlap=constant.EMBEDDING_PDF_TEXT_SPLIT_CHUNK_OVERLAP_SIZE,
                    allowed_special='all',
                )
                pages, document_text = self.load_pdf(document_file)
                docs = text_splitter.split_documents(pages)

            t1 = time.time()
            PGVector.from_documents(
                documents=docs,
                embedding=embeddings,
                collection_name=document_id,
                connection_string=PG_CONNECTION_STRING,
                distance_strategy=DistanceStrategy.COSINE,
                pre_delete_collection=True,
            )
            logging.info(f'文档[{document_id}] embedding完成, 耗时: {int(time.time() - t1)}s')
            self.task_pub_handler.handle_text(task_id, 'save_document', json.dumps(document_info, ensure_ascii=False),
                                              True)
        except Exception as e:
            logging.error(e, exc_info=True)
            self.task_pub_handler.handle_error(e, task_id)
            raise e
        finally:
            if lock:
                lock.release()

    def summary_document(self, document_text: str, lang: str, detailed_summary: str, task_id: str):
        logging.info("-" * 40 + 'summary_document' + '-' * 40)
        try:
            text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
                model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                chunk_size=constant.SUMMARY_TEXT_SPLIT_CHUNK_SIZE,
                chunk_overlap=constant.SUMMARY_TEXT_SPLIT_CHUNK_OVERLAP_SIZE,
                allowed_special='all',
            )

            prompt = PromptTemplate(template=SUMMARY_PROMPT, input_variables=["text", "lang"])

            if not detailed_summary:
                docs = text_splitter.create_documents([document_text])
                # 根据原文生成
                llm = ChatOpenAI(
                    openai_api_base=constant.OPENAI_API_BASE_CHAT,
                    openai_api_key=constant.OPENAI_API_KEY,
                    model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                    streaming=True,
                    temperature=constant.GENERATE_TEMPERATURE,
                    max_tokens=constant.SUMMARY_MAX_TOKEN,
                    callbacks=[TaskStreamingCallbackHandler(message_type='summary', task_stage=TaskStatus.generating)],
                )

                doc_count = len(docs)
                chain_type = 'refine' if doc_count <= 2 else 'map_reduce'
                total_chat = doc_count - 1 if chain_type == 'refine' else 0
                stream_out_llm = ChatOpenAI(
                    openai_api_base=constant.OPENAI_API_BASE_CHAT,
                    openai_api_key=constant.OPENAI_API_KEY,
                    model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                    streaming=True,
                    temperature=constant.GENERATE_TEMPERATURE,
                    max_tokens=constant.SUMMARY_MAX_TOKEN,
                    callbacks=[
                        TaskStreamingCallbackHandler(
                            task_id=task_id,
                            message_type='summary',
                            total_chat=total_chat,
                            task_stage=TaskStatus.generating,
                            task_pub_handler=self.task_pub_handler
                        )
                    ],
                )

                if chain_type == 'refine':
                    # refine
                    refine_prompt = PromptTemplate(template=SUMMARY_REFINE_PROMPT,
                                                   input_variables=["existing_answer", "text", "lang"])
                    chain = load_summarize_chain(
                        llm=llm if doc_count > 1 else stream_out_llm,
                        chain_type="refine",
                        refine_llm=stream_out_llm,
                        question_prompt=prompt,
                        refine_prompt=refine_prompt,
                    )
                    summary = chain.run(input_documents=docs, lang=lang, return_only_outputs=True)
                else:
                    # map_reduce
                    reduce_prompt = PromptTemplate(template=SUMMARY_REDUCE_PROMPT, input_variables=["text", "lang"])
                    chain = load_summarize_chain(
                        llm,
                        reduce_llm=stream_out_llm,
                        chain_type="map_reduce",
                        map_prompt=prompt,
                        combine_prompt=reduce_prompt,
                        token_max=1024 * 13,
                    )

                    new_loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(new_loop)
                    loop = asyncio.get_event_loop()
                    future = asyncio.ensure_future(
                        chain.arun(input_documents=docs, lang=lang, return_only_outputs=True))
                    loop.run_until_complete(future)
                    summary = future.result()
            else:
                # 根据长摘要生成
                llm = ChatOpenAI(
                    openai_api_base=constant.OPENAI_API_BASE_CHAT,
                    openai_api_key=constant.OPENAI_API_KEY,
                    model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                    streaming=True,
                    temperature=constant.GENERATE_TEMPERATURE,
                    max_tokens=constant.SUMMARY_MAX_TOKEN,
                    callbacks=[
                        TaskStreamingCallbackHandler(
                            task_id=task_id,
                            message_type='summary',
                            task_stage=TaskStatus.generating,
                            task_pub_handler=self.task_pub_handler
                        )
                    ],
                )

                chain = StuffDocumentsChain(
                    llm_chain=LLMChain(llm=llm, prompt=prompt),
                    document_variable_name='text'
                )

                doc = Document(page_content=detailed_summary)
                summary = chain.run(input_documents=[doc], lang=lang)

            logging.info(f'文档摘要: {summary}')

            self.task_pub_handler.handle_text(task_id, 'summary', None, True)
            return summary
        except Exception as e:
            logging.error(e, exc_info=True)
            self.task_pub_handler.handle_error(e, task_id)
            raise e

    def suggested_questions(self, document_text: str, lang: str, detailed_summary: str, task_id: str):
        logging.info("-" * 40 + 'suggested_questions' + '-' * 40)
        try:
            stream_out_llm = ChatOpenAI(
                openai_api_base=constant.OPENAI_API_BASE_CHAT,
                openai_api_key=constant.OPENAI_API_KEY,
                model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                streaming=True,
                max_tokens=constant.SUGGESTED_QUESTIONS_MAX_TOKEN,
                temperature=constant.GENERATE_TEMPERATURE,
                callbacks=[
                    TaskStreamingCallbackHandler(
                        task_id=task_id,
                        message_type='suggested_questions',
                        task_pub_handler=self.task_pub_handler
                    )
                ],
            )

            if not detailed_summary:
                # 根据原文生成
                text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
                    model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                    chunk_size=constant.SUMMARY_TEXT_SPLIT_CHUNK_SIZE,
                    chunk_overlap=constant.SUMMARY_TEXT_SPLIT_CHUNK_OVERLAP_SIZE,
                    allowed_special='all',
                )
                docs = text_splitter.create_documents([document_text])

                if len(docs) == 1:
                    prompt = PromptTemplate(input_variables=["text", "lang"], template=SUGGESTED_QUESTIONS_PROMPT)
                    chain = StuffDocumentsChain(
                        llm_chain=LLMChain(llm=stream_out_llm, prompt=prompt),
                        document_variable_name='text'
                    )
                    questions = chain.run(input_documents=docs, lang=lang)
                else:
                    llm = ChatOpenAI(
                        openai_api_base=constant.OPENAI_API_BASE_CHAT,
                        openai_api_key=constant.OPENAI_API_KEY,
                        model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                        streaming=True,
                        temperature=constant.GENERATE_TEMPERATURE,
                        max_tokens=constant.SUMMARY_MAX_TOKEN,
                        callbacks=[
                            TaskStreamingCallbackHandler(message_type='suggested_questions')],
                    )

                    map_prompt = PromptTemplate(input_variables=["text", "lang"], template=SUGGESTED_QUESTIONS_PROMPT)
                    reduce_prompt = PromptTemplate(input_variables=["questions", "lang"],
                                                   template=SUGGESTED_QUESTIONS_REDUCE_PROMPT)

                    chain = load_summarize_chain(
                        llm,
                        reduce_llm=stream_out_llm,
                        chain_type="map_reduce",
                        map_prompt=map_prompt,
                        combine_prompt=reduce_prompt,
                        combine_document_variable_name='questions',
                        token_max=1024 * 13,
                    )

                    new_loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(new_loop)
                    loop = asyncio.get_event_loop()
                    future = asyncio.ensure_future(
                        chain.arun(input_documents=docs, lang=lang, return_only_outputs=True))
                    loop.run_until_complete(future)
                    questions = future.result()
            else:
                # 根据长摘要生成
                prompt = PromptTemplate(input_variables=["text", "lang"], template=SUGGESTED_QUESTIONS_PROMPT)
                chain = StuffDocumentsChain(
                    llm_chain=LLMChain(llm=stream_out_llm, prompt=prompt),
                    document_variable_name='text'
                )
                docs = [Document(page_content=detailed_summary)]
                questions = chain.run(input_documents=docs, lang=lang)

            questions_arr = []
            for q in questions.split('\n'):
                if q and re.match('^Q\d: ', q):
                    questions_arr.append(q[4:])
            questions = '\n'.join(questions_arr)
            logging.info(f'建议的问题: {questions}')

            self.task_pub_handler.handle_text(task_id, 'suggested_questions', None, True)
            return questions
        except Exception as e:
            logging.error(e, exc_info=True)
            self.task_pub_handler.handle_error(e, task_id)
            raise e

    def detailed_summary_document(self, document_text, document_id, task_id):
        logging.info("-" * 40 + 'detailed_summary_document' + '-' * 40)
        lock = None
        try:
            with self.app.app_context():
                lock = redis_client.lock(name=f'lock:detailed_summary:{document_id}', timeout=60 * 5)
                lock.acquire()
                detailed_summary = self.get_detailed_summary_from_db(document_id)
                if detailed_summary:
                    self.task_pub_handler.handle_text(task_id, 'detailed_summary', None, True)
                    return detailed_summary

                llm = ChatOpenAI(
                    openai_api_base=constant.OPENAI_API_BASE_BLOCK,
                    openai_api_key=constant.OPENAI_API_KEY,
                    model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                    streaming=False,
                    temperature=0,
                    max_tokens=constant.DETAILED_SUMMARY_MAX_TOKEN,
                    callbacks=[TaskStreamingCallbackHandler(message_type='detailed_summary',
                                                            task_stage=TaskStatus.generating)],
                )

                text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
                    model_name=constant.SUMMARY_OPENAI_CHAT_MODEL,
                    chunk_size=constant.DETAILED_SUMMARY_TEXT_SPLIT_CHUNK_SIZE,
                    chunk_overlap=constant.DETAILED_SUMMARY_TEXT_SPLIT_CHUNK_OVERLAP_SIZE,
                    allowed_special='all',
                )
                docs = text_splitter.create_documents([document_text])
                docs = docs[0:int(
                    constant.SUMMARY_DOCUMENT_CONTENT_TOKEN_LIMIT / constant.DETAILED_SUMMARY_TEXT_SPLIT_CHUNK_SIZE)]

                prompt = PromptTemplate(template=DETAILED_SUMMARY_PROMPT, input_variables=["text"])
                prompt = ChatPromptTemplate.from_messages([
                    # SystemMessage(content=DETAILED_SUMMARY_SYSTEM_PROMPT),
                    HumanMessagePromptTemplate(prompt=prompt)
                ])

                if len(docs) <= 2:
                    # refine
                    refine_prompt = PromptTemplate(template=DETAILED_SUMMARY_REFINE_PROMPT,
                                                   input_variables=["existing_answer", "text"])
                    refine_prompt = ChatPromptTemplate.from_messages([
                        # SystemMessage(content=DETAILED_SUMMARY_SYSTEM_PROMPT),
                        HumanMessagePromptTemplate(prompt=refine_prompt)
                    ])
                    chain = load_summarize_chain(
                        llm=llm,
                        chain_type="refine",
                        question_prompt=prompt,
                        refine_prompt=refine_prompt,
                    )
                else:
                    # map_reduce
                    reduce_prompt = PromptTemplate(template=DETAILED_SUMMARY_REDUCE_PROMPT, input_variables=["text"])
                    reduce_prompt = ChatPromptTemplate.from_messages([
                        # SystemMessage(content=DETAILED_SUMMARY_SYSTEM_PROMPT),
                        HumanMessagePromptTemplate(prompt=reduce_prompt)
                    ])
                    chain = load_summarize_chain(
                        llm,
                        chain_type="map_reduce",
                        map_prompt=prompt,
                        combine_prompt=reduce_prompt,
                        token_max=1024 * 13,
                    )

                new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                loop = asyncio.get_event_loop()
                future = asyncio.ensure_future(chain.arun(input_documents=docs, return_only_outputs=True))
                loop.run_until_complete(future)
                summary = future.result()

                logging.info(f'详细文档摘要: {summary}')

                store = PGVector(
                    collection_name=f"{document_id}_summary",
                    connection_string=PG_CONNECTION_STRING,
                    embedding_function=embeddings,
                    distance_strategy=DistanceStrategy.COSINE,
                    pre_delete_collection=True,
                )
                store.add_texts(texts=[f"summary: {summary}"])

                document_parse_result = self.get_parse_result_from_db(document_id)
                if not document_parse_result.detailed_summary:
                    document_parse_result.detailed_summary = summary
                    db.session.add(document_parse_result)
                    db.session.commit()

                self.task_pub_handler.handle_text(task_id, 'detailed_summary', None, True)
                return summary
        except Exception as e:
            logging.error(e, exc_info=True)
            self.task_pub_handler.handle_error(e, task_id)
            raise e
        finally:
            if lock:
                lock.release()

    @classmethod
    def load_pdf(cls, document_file):
        # TODO: 获取元素坐标使用 UnstructuredPDFLoader("./tidb.pdf", mode="elements")
        t1 = time.time()
        docs = PyMuPDFLoader(document_file).load()
        logging.info(f'文件[{document_file}] load耗时: {int(time.time() - t1)}s')
        text = '\n'.join([page.page_content for page in docs])
        return docs, text

    @classmethod
    def get_parse_result_from_db(cls, document_id):
        return DocumentParseResult.query.filter_by(doc_id=document_id).first()

    @classmethod
    def get_detailed_summary_from_db(cls, document_id):
        document_parse_result = cls.get_parse_result_from_db(document_id)
        if document_parse_result:
            return document_parse_result.detailed_summary

    @classmethod
    def add_document_parse_result(cls, document_id, document_text):
        document_parse_result = DocumentParseResult(doc_id=document_id)
        document_parse_result.document_content = document_text
        db.session.add(document_parse_result)
        db.session.commit()
        return document_parse_result

    @classmethod
    def get_num_tokens(cls, text):
        encoding_name = tiktoken.model.MODEL_TO_ENCODING.get(constant.SUMMARY_OPENAI_CHAT_MODEL)
        if not encoding_name:
            encoding_name = "cl100k_base"
        encoding = tiktoken.get_encoding(encoding_name)
        token = encoding.encode(text=text, allowed_special='all')
        return len(token)
