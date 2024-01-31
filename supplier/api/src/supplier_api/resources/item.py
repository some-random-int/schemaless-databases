from flask import abort, request
from flask_restful_swagger_3 import swagger, Resource

from ..order_db.__index__ import get_orders
from ..models.item import ItemModel
from ..database.item import ItemCollection, Item


@swagger.tags('Item')
class ItemByIdResource(Resource):
    @swagger.reorder_with(ItemModel, summary='Get an Item by its ID', description='Get the Item with the given ID')
    @swagger.response(404, 'No Item with the given id exists')
    def get(self, **kwargs):
        # parse args
        assert 'ItemID' in kwargs
        item_id = kwargs['ItemID']
        # get and return item
        ret = ItemCollection().get(item_id)
        if ret is None:
            abort(404, f'No Item with ItemID="{item_id}" exists')
        return ret.db_dict

    @swagger.reorder_with(ItemModel, summary='Update an Item by its ID', description='Update the Item with the given ID. Return the new item')
    @swagger.response(204, 'No changes to do')
    @swagger.response(404, 'No Item with the given id exists')
    @swagger.expected(ItemModel)
    def put(self, **kwargs):
        # parse args
        assert 'ItemID' in kwargs
        item_id = kwargs['ItemID']
        # get original
        original = ItemCollection().get(item_id)
        if original is None:
            abort(404, f'No Item with ItemID="{item_id}" exists')
        # check for new values
        update = False
        values = {
            'itemType': None,
            'unitCost': None,
            'unitPrice': None
        }
        if 'itemType' in request.json and request.json['itemType'] != original.item_type:
            update = True
            values['itemType'] = request.json['itemType']
        if 'unitCost' in request.json and request.json['unitCost'] != original.unit_cost:
            update = True
            values['unitCost'] = request.json['unitCost']
        if 'unitPrice' in request.json and request.json['unitPrice'] != original.unit_price:
            update = True
            values['unitPrice'] = request.json['unitPrice']
        # update
        if update:
            return ItemCollection().update(item_id, values['itemType'], values['unitCost'], values['unitPrice']).db_dict
        return '', 204

    @swagger.reorder_with(ItemModel, summary='Delete an Item by its ID', description='Delete the Item with the given ID', response_code=204)
    @swagger.response(404, 'No Item with the given id exists')
    def delete(self, **kwargs):
        # parse args
        assert 'ItemID' in kwargs
        item_id = kwargs['ItemID']
        if not ItemCollection().delete(item_id):
            abort(404, f'No item with the id={item_id} exists')
        return '', 204


@swagger.tags('Item')
class ItemResource(Resource):
    @swagger.reorder_with(ItemModel, description='Add a new Item', summary='Add the given Item to the collection')
    @swagger.response(400, 'Got an error while insert')
    @swagger.expected(ItemModel)
    def post(self):
        new_item = Item.create_item(request.json['itemType'], request.json['unitCost'], request.json['unitPrice'])
        success = ItemCollection().create(new_item)
        if not success:
            abort(400, 'Unknown error occurred')
        return new_item.item_id


@swagger.tags('Item')
class ItemOrdersResource(Resource):
    @swagger.reorder_list_with(ItemModel, summary='Get all orders of a given item', description='Get orders of item')
    @swagger.response(404, 'Item with the given id does not exist')
    def get(self, **kwargs):
        # parse args
        assert 'ItemID' in kwargs
        item_id = kwargs['ItemID']
        if ItemCollection().get(item_id) is None:
            abort(404, f'Item with the id "{item_id}" does not exist')
        try:
            return get_orders(item_id)
        except ConnectionAbortedError:
            abort(500, 'Error while getting orders')
