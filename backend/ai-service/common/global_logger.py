import logging
from logging.config import fileConfig
import os


def get_logger():
    fileConfig(os.path.join(os.path.dirname(__file__) + '/../conf/logger_config.ini'))
    logger = logging.getLogger()
    return logger
