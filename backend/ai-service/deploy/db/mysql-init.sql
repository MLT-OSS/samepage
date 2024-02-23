create table t_document_parse_result
(
    id               bigint auto_increment comment '唯一标识'
        primary key,
    doc_id           varchar(64)                        not null comment '文档id',
    document_content mediumtext                         null comment '文档内容',
    detailed_summary text                               null comment '文档详细摘要',
    create_time      datetime default CURRENT_TIMESTAMP not null comment '创建时间'
)
    comment '文档解析结果表' charset = utf8mb4;

create index idx_t_document_parse_result_doc_id
    on t_document_parse_result (doc_id);
