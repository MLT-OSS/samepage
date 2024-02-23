from extension.ext_database import db


class ArticleSource(db.Model):
    __tablename__ = 't_article_source'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    doc_id = db.Column(db.String(64), nullable=False)
    source = db.Column(db.String(), nullable=False)
    create_time = db.Column(db.DateTime, nullable=False, server_default=db.text('CURRENT_TIMESTAMP'))
