import psycopg2
from conf import constant

conn = psycopg2.connect(
    host=constant.PGVECTOR_HOST,
    port=constant.PGVECTOR_PORT,
    database=constant.PGVECTOR_DATABASE,
    user=constant.PGVECTOR_USER,
    password=constant.PGVECTOR_PASSWORD
)
conn.autocommit = True


def collection_exist(collection_name):
    cur = conn.cursor()
    cur.execute(f"select 1 from langchain_pg_collection where name='{collection_name}'")
    exist = cur.fetchone()
    cur.close()
    return exist


def close():
    conn.close()
