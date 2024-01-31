from flask import abort, request
from flask_restful_swagger_3 import swagger, Resource

from ..database.item import ItemCollection
from ..models.supplier import SupplierModel
from ..database.supplier import SupplierCollection, Supplier


@swagger.tags('Supplier')
class SupplierByIdResource(Resource):
    @swagger.reorder_with(SupplierModel, summary='Get a Supplier by its ID', description='Get the Supplier with the given ID')
    @swagger.response(404, 'No Supplier with the given id exists')
    def get(self, **kwargs):
        # parse args
        assert 'SupplierID' in kwargs
        supplier_id = kwargs['SupplierID']
        # get and return supplier
        ret = SupplierCollection().get(supplier_id)
        if ret is None:
            abort(404, f'No Supplier with SupplierID="{supplier_id}" exists')
        return ret.db_dict

    @swagger.reorder_with(SupplierModel, summary='Update an Supplier by its ID', description='Update the Supplier with the given ID. Return the new Supplier')
    @swagger.response(204, 'No changes to do')
    @swagger.response(404, 'No Supplier with the given id exists')
    def put(self, **kwargs):
        # parse args
        assert 'SupplierID' in kwargs
        supplier_id = kwargs['SupplierID']
        # get original
        original = SupplierCollection().get(supplier_id)
        if original is None:
            abort(404, f'No item with SupplierID="{supplier_id}" exists')
        # Check for new values
        update = False
        values = {
            'name': None,
            'country': None,
            'region': None
        }
        if 'name' in request.json and request.json['name'] != original.name:
            update = True
            values['name'] = request.json['name']
        if 'country' in request.json and request.json['country'] != original.country:
            update = True
            values['country'] = request.json['country']
        if 'region' in request.json and request.json['region'] != original.region:
            update = True
            values['region'] = request.json['region']
        # update
        if update:
            return SupplierCollection().update(supplier_id, values['name'], values['country'], values['region']).db_dict
        return '', 204


@swagger.tags('Supplier')
class SupplierResource(Resource):
    @swagger.reorder_with(SupplierModel, summary='Add the given Supplier to the collection', description='Add a new Supplier')
    @swagger.response(400, 'Got an error while insert')
    @swagger.expected(SupplierModel)
    def post(self):
        new_supplier = Supplier.create_supplier(request.json['name'], request.json['country'], request.json['region'])
        success = SupplierCollection().create(new_supplier)
        if not success:
            abort(400, 'Unknown error occurred')
        return new_supplier.supplier_id


@swagger.tags('Supplier')
class SupplierSuppliesItemsResource(Resource):
    @swagger.reorder_with(
        SupplierModel,
        summary='Add the given ItemID to the item list of the given Supplier',
        description='Add an item to a suppliers item list'
    )
    @swagger.response(204, 'Supplier already supplies the item')
    @swagger.response(404, 'Supplier or Item does not exist')
    def put(self, **kwargs):
        # parse args
        assert 'SupplierID' in kwargs
        assert 'ItemID' in kwargs
        supplier_id = kwargs['SupplierID']
        item_id = kwargs['ItemID']
        if ItemCollection().get(item_id) is None:
            abort(404, f'No item with id={item_id} exists')
        ret = SupplierCollection().add_item(supplier_id, item_id)
        if ret is False:
            abort(404, f'No supplier with id={supplier_id} exists')
        if ret is None:
            return '', 204

    @swagger.reorder_with(
        SupplierModel,
        summary='Remove the given ItemID from the item list of the given Supplier',
        description='Remove an item from the suppliers item list'
    )
    @swagger.response(204, 'Supplier already does not supply the item')
    @swagger.response(404, 'Supplier or Item does not exist')
    def delete(self, **kwargs):
        # parse args
        assert 'SupplierID' in kwargs
        assert 'ItemID' in kwargs
        supplier_id = kwargs['SupplierID']
        item_id = kwargs['ItemID']
        if ItemCollection().get(item_id) is None:
            abort(404, f'No item with id={item_id} exists')
        ret = SupplierCollection().remove_item(supplier_id, item_id)
        if ret is None:
            return '', 204
