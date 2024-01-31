import pandas as pd
import json
import argparse

def replace_supplier_with_key(csv_file_path, json_file_path, updated_csv_file_path):
    # Load the CSV file into a pandas DataFrame
    df_csv = pd.read_csv(csv_file_path, delimiter=';')

    # Load the JSON file
    with open(json_file_path, 'r') as json_file:
        json_data = json.load(json_file)

    # Create a dictionary that maps Supplier to _key
    supplier_to_key = {item['name']: item['_key'] for item in json_data}

    # Replace Supplier values in the CSV file with corresponding _key values
    df_csv['Supplier'] = df_csv['Supplier'].map(supplier_to_key)
    
    df_csv = df_csv.rename(columns={'Supplier': '_from', 'ItemID': '_to'})
    
    # Remove duplicates
    df_csv.drop_duplicates(inplace=True)
    
    # Prefixes for IDs
    df_csv['_from'] = 'Suppliers/' + df_csv['_from']
    df_csv['_to'] = 'Items/' + df_csv['_to']
    
    # Save the updated CSV file
    df_csv.to_csv(updated_csv_file_path, index=False, sep=';')

    print("Supplier values have been successfully replaced, and the updated CSV file has been saved.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Replace Supplier values in CSV file with corresponding _key values from JSON file.")
    parser.add_argument("csv_file", help="Path to the CSV file")
    parser.add_argument("json_file", help="Path to the JSON file")
    parser.add_argument("output_csv_file", help="Path to the updated CSV file")

    args = parser.parse_args()

    replace_supplier_with_key(args.csv_file, args.json_file, args.output_csv_file)
