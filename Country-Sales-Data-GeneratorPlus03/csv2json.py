#! /usr/bin/python3
import csv
import json
import argparse


def convert_csv_numeric(csv_dict_reader: csv.DictReader) -> csv.DictReader:
    """
    Converts numeric strings in a CSV DictReader to their corresponding float values.

    Parameters:
        csv_dict_reader (csv.DictReader): The CSV DictReader containing the data.

    Returns:
        csv.DictReader: The CSV DictReader with numeric string values converted to floats.
    """
    for row in csv_dict_reader:
        for key, value in row.items():
            # Check if the value is a numeric string
            if isinstance(value, str) and value.replace(",", "").replace(".", "").isdigit():
                # Replace , with . if present and convert the value to float
                if ',' in value:
                    row[key] = float(value.replace(",", "."))
                else:
                    row[key] = float(value)
    return csv_dict_reader


def csv_to_json(csv_path: str, output_file: str | None = None):
    """
    Convert a CSV file to a JSON file.

    Args:
        csv_file (str): The path or URL to the CSV file.
        output_file (str, optional): The path to the output JSON file. If not provided, the result will be printed.

    Returns:
        dict: The JSON data.

    Raises:
        FileNotFoundError: If the CSV file is not found.
    """
    try:
        # Read CSV file with semicolon as the delimiter
        with open(csv_path, 'r') as csv_file:
            csv_reader = csv.DictReader(csv_file, delimiter=';')
            data = list(csv_reader)

        # Cast numerical values
        typed_data = convert_csv_numeric(data)

        # Convert to JSON
        json_data = json.dumps(typed_data, indent=2)

        # Output to file or print to console
        if output_file:
            with open(output_file, 'w') as json_output:
                json_output.write(json_data)
        else:
            print(json_data)

        return data
    except FileNotFoundError:
        raise FileNotFoundError(f"CSV file '{csv_path}' not found.")


def main():
    # Argument parser setup
    parser = argparse.ArgumentParser(description='Convert CSV to JSON.')
    parser.add_argument('csv_file', help='Path or URL to the CSV file')
    parser.add_argument('-o', '--output', help='Path to the output JSON file')

    # Parse arguments
    args = parser.parse_args()

    # Convert CSV to JSON
    result = csv_to_json(args.csv_file, args.output)

    return result


if __name__ == "__main__":
    main()
