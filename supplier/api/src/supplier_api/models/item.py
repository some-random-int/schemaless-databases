from flask_restful_swagger_3 import Schema


class ItemModel(Schema):
    properties = {
        '_key': {
            'maxLength': 14,
            'minLength': 14,
            'readOnly': True,
            'required': True,
            'type': 'string'
        },
        'itemType': {
            'enum': [
                'Office Supplies',
                'Vegetables',
                'Baby Food',
                'Cosmetics',
                'Personal Care',
                'Meat',
                'Snacks',
                'Household',
                'Beverages',
                'Fruits',
                'Clothes',
                'Cereal'
            ],
            'required': True,
            'type': 'string'
        },
        'unitCost': {
            'minimum': 0,
            'required': True,
            'type': 'number'
        },
        'unitPrice': {
            'minimum': 0,
            'required': True,
            'type': 'number'
        }
    }
