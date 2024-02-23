import os
import time
import urllib.request
from common import global_logger

logging = global_logger.get_logger()


def download(url, document_id, task_id):
    file_name = f'./data/{task_id}_{document_id}'
    t1 = time.time()
    urllib.request.urlretrieve(url, file_name)
    logging.info(f'文件[{url}] 下载耗时: {int(time.time() - t1)}s')
    return file_name


def delete(document_id, task_id):
    try:
        file_name = f'./data/{task_id}_{document_id}'
        if os.path.exists(file_name):
            os.remove(file_name)
    except:
        pass
