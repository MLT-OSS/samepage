from extension.ext_database import db


class DocumentParseResult(db.Model):
    __tablename__ = 't_document_parse_result'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    doc_id = db.Column(db.String(64), nullable=False)
    document_content = db.Column(db.String(), nullable=True)
    detailed_summary = db.Column(db.String(), nullable=True)
    create_time = db.Column(db.DateTime, nullable=False, server_default=db.text('CURRENT_TIMESTAMP'))
