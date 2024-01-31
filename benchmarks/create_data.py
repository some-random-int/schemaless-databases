from datetime import datetime, timedelta
import json
import math
import random
import concurrent
import concurrent.futures


def generate_documents(orig: dict[list], count_per_thread: int):
    new_docs = orig.copy()

    while len(new_docs) < count_per_thread:
        new_docs += orig.copy()
    new_docs = new_docs[:count_per_thread]

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
    return new_docs


def generate_documents_parallel(orig, count_per_thread, num_threads):
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
        futures = [executor.submit(
            generate_documents, orig, count_per_thread) for _ in range(num_threads)]
        concurrent.futures.wait(futures)
        results = [future.result() for future in futures]

    merged_results = [item for sublist in results for item in sublist]
    seen_oids = set()
    filtered_results: list[dict] = []
    for x in merged_results:
        oid = x['Order ID']
        if oid not in seen_oids:
            seen_oids.add(oid)
        filtered_results.append(x)
    return filtered_results


if __name__ == '__main__':
    docs: list[dict] = []
    with open('../Country-Sales-Data-GeneratorPlus03/Country-Sales-Data-GeneratorPlus03_1Mio.json', 'r', encoding='UTF-8') as f:
        d = json.load(f)
        docs = d.copy()
    count_per_thread = 12500000
    num_threads = 8

    merged_results = generate_documents_parallel(
        docs, count_per_thread, num_threads)

    for i in range(math.ceil(count_per_thread*num_threads/5000000)):
        with open(f'./big_data/out_{i}.json', 'w', encoding='UTF-8') as file:
            file.write(json.dumps(merged_results[i*5000000:(i+1)*5000000]))
