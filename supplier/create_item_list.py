import argparse
import json
import csv

def load_json(file_path):
    with open(file_path, 'r') as json_file:
        return json.load(json_file)

def load_csv(file_path):
    with open(file_path, 'r') as csv_file:
        reader = csv.DictReader(csv_file, delimiter=';')
        return list(reader)

def update_json_with_items(json_data, csv_data):
    for entry in json_data:
        supplier_name = entry.get('name')
        associated_items = {row['ItemID'] for row in csv_data if row['Supplier'] == supplier_name}
        entry['itemList'] = list(associated_items)
    return json_data

def save_json(updated_json_data, output_file):
    with open(output_file, 'w') as json_output_file:
        json.dump(updated_json_data, json_output_file, indent=2)

def main():
    parser = argparse.ArgumentParser(description='Update JSON objects with associated unique ItemIDs from a CSV file.')
    parser.add_argument('suppliers_json', help='Path to the suppliers JSON file')
    parser.add_argument('item2supplier_csv', help='Path to the item2supplier CSV file')
    parser.add_argument('output_json', help='Path to the output JSON file')
    args = parser.parse_args()

    suppliers_data = load_json(args.suppliers_json)
    item2supplier_data = load_csv(args.item2supplier_csv)

    updated_suppliers_data = update_json_with_items(suppliers_data, item2supplier_data)

    save_json(updated_suppliers_data, args.output_json)
    print(f'Updated JSON saved to {args.output_json}')

if __name__ == '__main__':
    main()
