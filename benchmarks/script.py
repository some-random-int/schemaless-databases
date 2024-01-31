from datetime import datetime, timedelta
import json
import random
import sys
import threading
from typing import Literal
import requests

COLLECTION_NAME = 'ShardedBenchmarkTesting'
BACKGROUND_COLLECTION = 'ShardedBackground'

COUNT = int(sys.argv[1])
BACKGROUND_THREADS = int(sys.argv[2])
SETS_PER_BACKGROUND_TASK = 100000
TIMES = 10


class DB:
    @staticmethod
    def get(path: str, collection: str = COLLECTION_NAME) -> requests.Response:
        return requests.get(f'http://10.20.110.67:8529/_db/TestDB/_api/{path.replace("@", collection)}')

    @staticmethod
    def put(path: str, body: dict | list | None = None, collection: str = COLLECTION_NAME) -> requests.Response:
        return requests.put(f'http://10.20.110.66:8529/_db/TestDB/_api/{path.replace("@", collection)}', json=body)

    @staticmethod
    def post(path: str, body: dict | list | None = None, collection: str = COLLECTION_NAME) -> requests.Response:
        return requests.post(f'http://10.20.110.68:8529/_db/TestDB/_api/{path.replace("@", collection)}', json=body)

    @staticmethod
    def patch(path: str, body: dict | list | None = None, collection: str = COLLECTION_NAME) -> requests.Response:
        return requests.patch(f'http://10.20.110.66:8529/_db/TestDB/_api/{path.replace("@", collection)}', json=body)

    @staticmethod
    def delete(path: str, body: dict | list | None = None, collection: str = COLLECTION_NAME) -> requests.Response:
        return requests.delete(f'http://10.20.110.67:8529/_db/TestDB/_api/{path.replace("@", collection)}', json=body)


def truncate(collection: str = COLLECTION_NAME) -> None:
    DB.put('collection/@/truncate', collection=collection)


def create(documents: list[dict], collection: str = COLLECTION_NAME) -> None:
    DB.post(
        'document/@#multiple?returnNew=false&returnOld=false&silent=true', body=documents, collection=collection)


def read(ids: list[str], collection: str = COLLECTION_NAME) -> None:
    DB.put('document/@#get', body=ids, collection=collection)


def update(documents: list[dict], collection: str = COLLECTION_NAME) -> None:
    DB.patch('document/@', body=documents, collection=collection)


def delete(ids: list[str], collection: str = COLLECTION_NAME) -> None:
    DB.delete('document/@', body=ids, collection=collection)


def get_keys(count: int, collection: str = COLLECTION_NAME) -> list[str]:
    aql_query = f"""
    FOR doc IN {collection}
        RETURN doc._key
    """

    payload = {
        'query': aql_query,
        'batchSize': count
    }

    return DB.post('/cursor', body=payload).json()['result']


def get_documents(count: int) -> list[dict]:
    if count > 10000000:
        ret: list[dict] = []
        j = 0
        while len(ret) < count and j < 20:
            with open(f'/home/team23w4/team23w4/benchmarks/big_data/out_{j}.json', 'r', encoding='UTF-8') as f:
                ret += json.load(f)
            ret = ret[:count]
            j += 1
        if len(ret) < count:
            print(f'Asked for {count} documents, but we have only {len(ret)}')
        return ret
    d: dict = None
    orig: dict = None
    with open('/home/team23w4/team23w4/Country-Sales-Data-GeneratorPlus03/Country-Sales-Data-GeneratorPlus03_1Mio.json', 'r', encoding='UTF-8') as f:
        d = json.load(f)
        orig = d.copy()
    while count > len(d):
        new_docs = orig.copy()
        for j, _ in enumerate(new_docs):
            new_docs[j]['Sales Channel'] = 'Online' if random.random(
            ) < 0.5 else 'Offline'
            new_docs[j]['Order Priority'] = random.choice(['L', 'M', 'H', 'C'])
            start_date = datetime(2010, 1, 1)
            end_date = datetime(2023, 12, 31)
            end_date2 = datetime(2024, 1, 6)
            order_date = start_date + \
                timedelta(days=random.randint(0, (end_date - start_date).days))
            ship_date = order_date + \
                timedelta(days=random.randint(
                    0, (end_date2 - order_date).days))
            new_docs[j]['Order Date'] = order_date.strftime('%Y-%m-%d')
            new_docs[j]['Ship Date'] = ship_date.strftime('%Y-%m-%d')
            new_docs[j]['Order ID'] = str(random.randint(100000000, 999999999))
        seen_oids = set()
        filtered_nd = []
        for x in new_docs:
            oid = x['Order ID']
            if oid not in seen_oids:
                seen_oids.add(oid)
            filtered_nd.append(x)
        d += filtered_nd
    return d[:count]


def created_update_docs(documents: list[dict], ids: list[str]) -> list[dict]:
    assert len(documents) == len(ids)
    _documents = documents.copy()
    random.shuffle(_documents)
    ret = []
    for doc, key in zip(_documents, ids):
        new_doc = doc.copy()
        new_doc['_key'] = key
        ret.append(new_doc)
    return ret


def background(b_docs: list[dict], exit_event: threading.Event):
    while not exit_event.is_set():
        action = random.randint(0, 3)
        count = random.randint(500, 2000)
        try:
            if action == 0:
                create([random.choice(b_docs)
                        for _ in range(count)], BACKGROUND_COLLECTION)
            else:
                b_keys = get_keys(1000000, BACKGROUND_COLLECTION)
                if action == 1:
                    read([random.choice(b_keys)
                          for _ in range(count)], BACKGROUND_COLLECTION)
                elif action == 2:
                    u_docs = created_update_docs(
                        [random.choice(b_docs) for _ in range(count)],
                        [random.choice(b_keys) for _ in range(count)]
                    )
                    update(u_docs, BACKGROUND_COLLECTION)
                else:
                    delete(b_keys, BACKGROUND_COLLECTION)
        except IndexError:
            pass


if __name__ == '__main__':
    truncate(BACKGROUND_COLLECTION)
    docs = get_documents(COUNT*6)
    thread_list = []
    exit_signal = threading.Event()
    if BACKGROUND_THREADS > 0:
        background_docs = get_documents(
            BACKGROUND_THREADS*SETS_PER_BACKGROUND_TASK)
        init_b_docs = [random.choice(background_docs)
                       for _ in range(int(BACKGROUND_THREADS*SETS_PER_BACKGROUND_TASK/2))]
        for t in range(BACKGROUND_THREADS):
            create(init_b_docs[SETS_PER_BACKGROUND_TASK *
                   t:SETS_PER_BACKGROUND_TASK*(t+1)], BACKGROUND_COLLECTION)
        for i in range(BACKGROUND_THREADS):
            start_index = i * SETS_PER_BACKGROUND_TASK
            end_index = (i + 1) * SETS_PER_BACKGROUND_TASK
            thread = threading.Thread(target=background, args=(
                background_docs[start_index:end_index], exit_signal))
            thread.daemon = True
            thread.start()
            thread_list.append(thread)

    for t in range(TIMES):
        random.shuffle(docs)
        truncate()
        for u in range(5):
            create(docs[COUNT*u:COUNT*(u+1)])
        times: dict[
            Literal['create', 'read', 'update', 'delete'],
            dict[
                Literal['start', 'end'],
                datetime
            ]
        ] = {
            'create': {'start': datetime.now(), 'end': datetime.now()},
            'read': {'start': datetime.now(), 'end': datetime.now()},
            'update': {'start': datetime.now(), 'end': datetime.now()},
            'delete': {'start': datetime.now(), 'end': datetime.now()}
        }

        times['create']['start'] = datetime.now()
        create(docs[COUNT*5:])
        times['create']['end'] = datetime.now()

        keys = get_keys(COUNT*6)
        update_docs = created_update_docs(
            [random.choice(docs) for _ in range(COUNT)], [random.choice(keys) for _ in range(COUNT)])

        times['read']['start'] = datetime.now()
        read([random.choice(keys) for _ in range(COUNT)])
        times['read']['end'] = datetime.now()

        times['update']['start'] = datetime.now()
        update(update_docs)
        times['update']['end'] = datetime.now()

        times['delete']['start'] = datetime.now()
        delete([random.choice(keys) for _ in range(COUNT)])
        times['delete']['end'] = datetime.now()

        for o in ['create', 'read', 'update', 'delete']:
            print(f'{o}: {times[o]["end"] - times[o]["start"]}')
        print()

    if BACKGROUND_THREADS > 0:
        exit_signal.set()
        for thread in thread_list:
            thread.join()
