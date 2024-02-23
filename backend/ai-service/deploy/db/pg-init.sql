create table if not exists langchain_pg_collection
(
    name      varchar(50),
    cmetadata json,
    uuid      uuid not null
        primary key
);

alter table langchain_pg_collection owner to pgpool;

create index if not exists langchain_pg_collection_name_index
    on langchain_pg_collection (name);


create table langchain_pg_embedding
(
    collection_id uuid
        references langchain_pg_collection
            on delete cascade,
    embedding     vector(1536),
    document      varchar,
    cmetadata     json,
    custom_id     varchar,
    uuid          uuid not null
        primary key
);

alter table langchain_pg_embedding
    owner to pgpool;

create index langchain_pg_embedding_collection_id_index
    on langchain_pg_embedding (collection_id);

