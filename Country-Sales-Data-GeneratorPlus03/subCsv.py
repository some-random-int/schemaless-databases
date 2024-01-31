#! /usr/bin/python3
import csv
import argparse

def get_column_input(column):
    while True:
        include = input(f"Should column '{column}' be included in the new file? (Y/n) ").lower()
        if include in {'y', 'n', ''}:
            return include
        print("Invalid input. Please enter 'y', 'n', or nothing.")

def create_subset(input_file, output_file, columns=None):
    # Read the CSV file
    with open(input_file, 'r') as in_file:
        reader = csv.DictReader(in_file, delimiter=';')

        # If no columns are specified, ask about each column
        if not columns:
            columns = []
            for column in reader.fieldnames:
                include = get_column_input(column)
                if include == 'y' or include == '':
                    columns.append(column)

        # Write the subset to the new file
        with open(output_file, 'w', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=columns, delimiter=';')
            writer.writeheader()

            for row in reader:
                writer.writerow({column: row[column] for column in columns})

if __name__ == "__main__":
    # Use argparse for command-line arguments
    parser = argparse.ArgumentParser(description="Create a subset of a CSV file with specific columns.")
    parser.add_argument("input_file", help="Path to the input CSV file")
    parser.add_argument("output_file", help="Path to the output CSV file")
    parser.add_argument("-c", "--columns", nargs="+", help="Names of columns to be included in the output")

    args = parser.parse_args()

    # If no columns are specified, pass None
    columns = args.columns if args.columns else None

    create_subset(args.input_file, args.output_file, columns)
