import pandas as pd
import hashlib
import argparse


def generate_key(row):
    hash_value = hashlib.sha256(
        f"{row['name']}_{row['region']}_{row['country']}".encode('utf-8')).hexdigest()
    key = hash_value[:16]
    return key


def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(
        description='Process CSV file and generate SupplierID (_key) column.')
    parser.add_argument('file_path', help='Path to the CSV file')
    args = parser.parse_args()

    # Load the CSV file
    df = pd.read_csv(args.file_path, delimiter=';')

    # Rename columns
    df = df.rename(columns={'SuplierRegion': 'region',
                   'SuplierCountry': 'country', 'Supplier': 'name'})

    # Generate the _key column
    df['_key'] = df.apply(generate_key, axis=1)

    # Drop duplicate rows based on all columns
    df.drop_duplicates(inplace=True)

    # Save the result to a new CSV file (same path)
    df.to_csv(args.file_path, index=False, sep=';')
    print("Modified file saved")


if __name__ == "__main__":
    main()
