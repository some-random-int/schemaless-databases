#! /usr/bin/bash

pushd .
cd ~/team23w4/supplier/data
python3 ~/team23w4/Country-Sales-Data-GeneratorPlus03/subCsv.py ~/team23w4/Country-Sales-Data-GeneratorPlus03/Country-Sales-Data-GeneratorPlus03_1Mio.csv items.csv -c "Item Type" "Unit Price" "Unit Cost" "ItemID"
python3 ~/team23w4/Country-Sales-Data-GeneratorPlus03/subCsv.py ~/team23w4/Country-Sales-Data-GeneratorPlus03/Country-Sales-Data-GeneratorPlus03_1Mio.csv suppliers.csv -c "Supplier" "SuplierRegion" "SuplierCountry"
python3 ~/team23w4/Country-Sales-Data-GeneratorPlus03/subCsv.py ~/team23w4/Country-Sales-Data-GeneratorPlus03/Country-Sales-Data-GeneratorPlus03_1Mio.csv items2suppliers.csv -c "Supplier" "ItemID"
python3 ../prepare_items.py items.csv
python3 ../prepare_suppliers.py suppliers.csv
python3 ~/team23w4/Country-Sales-Data-GeneratorPlus03/csv2json.py items.csv -o items.json
python3 ~/team23w4/Country-Sales-Data-GeneratorPlus03/csv2json.py suppliers.csv -o suppliers.json
python3 ../create_item_list.py suppliers.json items2suppliers.csv suppliers.json
# python3 ../replace_name_with_id_in2list.py items2suppliers.csv suppliers.json items2suppliers.csv
# python3 ~/team23w4/Country-Sales-Data-GeneratorPlus03/csv2json.py items2suppliers.csv -o items2suppliers.json
popd
