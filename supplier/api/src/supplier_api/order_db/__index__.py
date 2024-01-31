import requests

from ..constants import ORDER_API_HOST


def get_orders(item_id: str) -> list:
    r = requests.get(ORDER_API_HOST + '/api/orders/' + item_id, timeout=10)
    if r.ok:
        return r.json()
    raise ConnectionAbortedError('Got not ok response')
