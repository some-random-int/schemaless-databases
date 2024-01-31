import argparse
import pandas as pd


def remove_duplicates(input_file):
    # Load CSV file
    df = pd.read_csv(input_file, sep=';')

    # Remove duplicates
    df.drop_duplicates(inplace=True)

    # Rename columns
    df = df.rename(columns={'ItemID': '_key', 'Item Type': 'itemType',
                   'Unit Cost': 'unitCost', 'Unit Price': 'unitPrice'})

    # Write results back to the same CSV file, overwriting the original file
    df.to_csv(input_file, index=False, sep=';')


def main():
    # Set up command-line arguments
    parser = argparse.ArgumentParser(
        description='Remove duplicate rows from a CSV file.')
    parser.add_argument('input_file', help='Path to the input CSV file')

    # Parse command-line arguments
    args = parser.parse_args()

    # Remove duplicates and overwrite the original file
    remove_duplicates(args.input_file)


if __name__ == '__main__':
    main()
