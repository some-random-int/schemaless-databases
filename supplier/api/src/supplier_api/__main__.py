"""over all main file, running the TrigDroid
"""
from flask import Flask
from flask_restful_swagger_3 import Api, get_swagger_blueprint

from .resources.supplier import SupplierByIdResource, SupplierResource, SupplierSuppliesItemsResource
from .resources.item import ItemByIdResource, ItemOrdersResource, ItemResource


def configure_swagger(app: Flask, api: Api) -> None:
    swagger_blueprint = get_swagger_blueprint(
        api.open_api_object,
        swagger_prefix_url='',
        swagger_url='supplier')

    app.register_blueprint(swagger_blueprint)


def _main() -> None:
    """main-method
    """
    supplier_app = Flask(__name__)
    supplier_api = Api(supplier_app, title='Supplier API', version='1.0.0')

    supplier_api.add_resource(ItemByIdResource, '/item/<string:ItemID>')
    supplier_api.add_resource(ItemResource, '/item')
    supplier_api.add_resource(ItemOrdersResource, '/item/<string:ItemID>/orders')
    supplier_api.add_resource(SupplierByIdResource, '/supplier/<string:SupplierID>')
    supplier_api.add_resource(SupplierSuppliesItemsResource, '/supplier/<string:SupplierID>/supplies/<string:ItemID>')
    supplier_api.add_resource(SupplierResource, '/supplier')

    configure_swagger(supplier_app, supplier_api)

    @supplier_app.after_request 
    def after_request(response):
        header = response.headers
        header['Access-Control-Allow-Origin'] = '*'
        header['Access-Control-Allow-Methods'] = '*'
        header['Access-Control-Allow-Headers'] = '*'
        # Other headers can be added here if needed
        return response

    supplier_app.run(port=5002)


if __name__ == '__main__':
    _main()
