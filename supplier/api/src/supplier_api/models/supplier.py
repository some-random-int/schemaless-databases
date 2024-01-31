from flask_restful_swagger_3 import Schema


class SupplierModel(Schema):
    properties = {
        'name': {
        'type': 'string'
      },
      '_key': {
        'maxLength': 16,
        'minLength': 16,
        'readOnly': True,
        'required': True,
        'type': 'string'
      },
      'country': {
        'type': 'string',
        'required': True
      },
      'itemList': {
        'items': {
          'type': 'string'
        },
        'type': 'array',
        'required': True
      },
      'region': {
        'type': 'string',
        'required': True
      }
    }
