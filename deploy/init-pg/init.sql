CREATE EXTENSION IF NOT EXISTS vector;
create table IF NOT EXISTS langchain_pg_collection
(
    name      varchar(50),
    cmetadata json,
    uuid uuid not null primary key
);

create table IF NOT EXISTS langchain_pg_embedding
(
    collection_id uuid
        references langchain_pg_collection
        on delete cascade,
    embedding vector(1536),
    document  varchar,
    cmetadata json,
    custom_id varchar,
    uuid uuid not null
        primary key
);

create index IF NOT EXISTS langchain_pg_collection_name_index
    on langchain_pg_collection (name);

create index IF NOT EXISTS langchain_pg_embedding_collection_id_index on langchain_pg_embedding (collection_id);
