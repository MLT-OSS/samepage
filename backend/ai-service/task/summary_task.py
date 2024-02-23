from celery import shared_task

from core.summary_task import SummaryTask
from core.task_pub_handler import async_task_pub_handler


@shared_task(autoretry_for=())
def summary_task(document_text: str | None, document_url: str | None, document_type: str, document_id: str, lang: str, task_id: str):
    SummaryTask(
        task_id=task_id,
        task_pub_handler=async_task_pub_handler,
        document_text=document_text,
        document_url=document_url,
        document_type=document_type,
        document_id=document_id,
        lang=lang
    ).run()
