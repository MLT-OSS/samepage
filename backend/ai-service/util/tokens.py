
from anthropic import Anthropic
from common import global_logger

logging = global_logger.get_logger()

def sync_tokens(text):
    client = Anthropic()
    tokens = client.count_tokens(text)
    logging.info(f"'{text}' is {tokens} tokens")
    return tokens