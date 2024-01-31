import os
from dotenv import load_dotenv


def to_bool(bool_str: str) -> bool:
    if bool_str in ['false', 'False']:
        return False
    if bool_str in ['true', 'True']:
        return True
    raise AttributeError(f'"{bool_str}" as environment variable cannot be parsed to boolean. Use "True" or "False"')


load_dotenv()

ARANGO_DB = os.getenv('ARANGO_DB')
ARANGO_HOST = os.getenv('ARANGO_HOST')
ARANGO_SECURE = to_bool(os.getenv('ARANGO_SECURE'))
ARANGO_PW = os.getenv('ARANGO_PW')
ARANGO_PORT = os.getenv('ARANGO_PORT')
ARANGO_USERNAME = os.getenv('ARANGO_USERNAME')

ORDER_API_HOST = os.getenv('ORDER_API_HOST')
