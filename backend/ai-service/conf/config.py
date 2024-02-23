# -*- coding:utf-8 -*-
import os
from urllib.parse import quote_plus as urlquote

import dotenv
from langchain.vectorstores.pgvector import PGVector

dotenv.load_dotenv()

DEFAULTS = {
    'DB_USERNAME': 'root',
    'DB_PASSWORD': '',
    'DB_HOST': 'localhost',
    'DB_PORT': '3306',
    'DB_DATABASE': 'test',
    'SQLALCHEMY_POOL_SIZE': 30,
    'SQLALCHEMY_ECHO': 'False',
    'PGVECTOR_DRIVER': 'psycopg2',
    'PGVECTOR_USER': 'postgres',
    'PGVECTOR_PASSWORD': '',
    'PGVECTOR_HOST': 'localhost',
    'PGVECTOR_PORT': '5432',
    'PGVECTOR_DATABASE': 'pg_vector',
    'REDIS_HOST': 'localhost',
    'REDIS_PORT': '6379',
    'REDIS_DB': '0',
    'REDIS_USE_SSL': 'False',
    'STORAGE_TYPE': 'local',
    'STORAGE_LOCAL_PATH': 'storage',
    'CELERY_BACKEND': 'database',
}


def get_env(key):
    return os.environ.get(key, DEFAULTS.get(key))


def get_bool_env(key):
    return get_env(key).lower() == 'true'


class Config:
    """Application configuration class."""

    def __init__(self):
        # Redis
        self.REDIS_HOST = get_env('REDIS_HOST')
        self.REDIS_PORT = get_env('REDIS_PORT')
        self.REDIS_USERNAME = get_env('REDIS_USERNAME')
        self.REDIS_PASSWORD = get_env('REDIS_PASSWORD')
        self.REDIS_DB = get_env('REDIS_DB')
        self.REDIS_USE_SSL = get_bool_env('REDIS_USE_SSL')

        # Postgresql
        self.PGVECTOR_DRIVER = get_env('PGVECTOR_DRIVER')
        self.PGVECTOR_HOST = get_env('PGVECTOR_HOST')
        self.PGVECTOR_PORT = get_env('PGVECTOR_PORT')
        self.PGVECTOR_DATABASE = get_env('PGVECTOR_DATABASE')
        self.PGVECTOR_USER = get_env('PGVECTOR_USER')
        self.PGVECTOR_PASSWORD = get_env('PGVECTOR_PASSWORD')
        self.PG_CONNECTION_STRING = PGVector.connection_string_from_db_params(
            driver=self.PGVECTOR_DRIVER,
            host=self.PGVECTOR_HOST,
            port=self.PGVECTOR_PORT,
            database=self.PGVECTOR_DATABASE,
            user=self.PGVECTOR_USER,
            password=self.PGVECTOR_PASSWORD
        )

        # Storage
        self.STORAGE_TYPE = get_env('STORAGE_TYPE')
        self.STORAGE_LOCAL_PATH = get_env('STORAGE_LOCAL_PATH')
        self.S3_ENDPOINT = get_env('S3_ENDPOINT')
        self.S3_BUCKET_NAME = get_env('S3_BUCKET_NAME')
        self.S3_ACCESS_KEY = get_env('S3_ACCESS_KEY')
        self.S3_SECRET_KEY = get_env('S3_SECRET_KEY')
        self.S3_REGION = get_env('S3_REGION')

        # MySQL
        db_credentials = {
            key: get_env(key) for key in
            ['DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_DATABASE']
        }

        self.SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{db_credentials['DB_USERNAME']}:{urlquote(db_credentials['DB_PASSWORD'])}@{db_credentials['DB_HOST']}:{db_credentials['DB_PORT']}/{db_credentials['DB_DATABASE']}"
        self.SQLALCHEMY_ENGINE_OPTIONS = {'pool_size': int(get_env('SQLALCHEMY_POOL_SIZE'))}

        self.SQLALCHEMY_ECHO = get_bool_env('SQLALCHEMY_ECHO')

        # Celery
        self.CELERY_BROKER_URL = get_env('CELERY_BROKER_URL')
        self.CELERY_BACKEND = get_env('CELERY_BACKEND')
        # self.CELERY_RESULT_BACKEND = 'db+{}'.format(self.SQLALCHEMY_DATABASE_URI) \
        #     if self.CELERY_BACKEND == 'database' else self.CELERY_BROKER_URL
        self.CELERY_RESULT_BACKEND = self.CELERY_BROKER_URL
        self.BROKER_USE_SSL = self.CELERY_BROKER_URL.startswith('rediss://')
