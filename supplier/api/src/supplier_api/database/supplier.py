import hashlib
from typing import Any
from arango import DocumentInsertError, DocumentDeleteError
from arango.collection import StandardCollection
from arango.database import StandardDatabase

from ..database import Database
from ..database.item import Item


class Supplier():
    """Representation of a document from the Items collection
    """

    def __init__(self, db_document: Any) -> None:
        self._supplier_id: str = db_document['_key']
        self.name: str = db_document['name']
        self.country: str = db_document['country']
        self.region: str = db_document['region']
        self.item_list: list[str] = db_document['itemList']

    @property
    def supplier_id(self) -> str:
        """SupplierID

        Returns:
            str: SupplierID
        """
        return self._supplier_id

    @property
    def db_dict(self) -> dict:
        """Get the Supplier as a dict that looks like the document in the database.

        Returns:
            dict: Database like Supplier document
        """
        return {
            '_key': self.supplier_id,
            'name': self.name,
            'country': self.country,
            'region': self.region,
            'itemList': self.item_list
        }

    @staticmethod
    def _generate_id(name: str, region: str, country: str) -> str:
        """Generates an ID based on the given args

        Returns:
            str: generated ID
        """
        hash_value = hashlib.sha256(f'{name}_{region}_{country}'.encode('utf-8')).hexdigest()
        key = hash_value[:16]
        return key

    @classmethod
    def create_supplier(cls, name: str, country: str, region: str, item_list: list[str | Item] = None):
        """Create a new Supplier representation

        Args:
            name (str): name
            country (str): country
            region (str): region
            item_list (list[str | Item], optional): supplied items. Defaults to [].
        """
        item_list = [] if item_list is None else item_list
        supplier_id = cls._generate_id(name, region, country)
        return cls(
            {
                '_key': supplier_id,
                'name': name,
                'country': country,
                'region': region,
                'itemList': [item.item_id for item in item_list] if len(item_list) > 0 and isinstance(item_list[0], Item) else item_list
            }
        )


class SupplierCollection():
    """Represents the Supplier collection from the database
    """

    _database: StandardDatabase = None
    _collection: StandardCollection = None

    def __init__(self) -> None:
        if self._database is None:
            self._database = Database().db
        if self._collection is None:
            self._collection = self._database.collection('Suppliers')

    def get(self, supplier_id: str) -> Supplier | None:
        """Get a supplier by its id.

        Args:
            supplier_id (str): SupplierID of the supplier to get

        Returns:
            Supplier | None: Supplier with the given id or `None` if no document found
        """
        cursor = self._collection.find({'_key': supplier_id})
        count = cursor.count()
        assert count <= 1
        if count == 0:
            return None
        ret = Supplier(cursor.next())
        cursor.close()
        return ret

    def delete(self, supplier_id: str) -> bool:
        """Delete a supplier by its id.

        Args:
            supplier_id (str): SupplierID of the supplier to delete

        Returns:
            bool: `True` if deletion was successful. `False` if any error occurred.
        """
        try:
            self._collection.delete(supplier_id)
            return True
        except DocumentDeleteError:
            return False

    def update(self, supplier_id: str, name: str | None = None, country: str | None = None, region: str | None = None) -> Supplier:
        """Update a supplier by its id.

        Args:
            supplier_id (str): ID of the supplier to update.
            name (str | None, optional): New name. Only if you want to update it. Defaults to None.
            country (str | None, optional): New country. Only if you want to update it. Defaults to None.
            region (str | None, optional): New region. Only if you want to update it. Defaults to None.

        Returns:
            Supplier: The updated supplier
        """
        doc = {'_key': supplier_id}
        if name is not None:
            doc['name'] = name
        if country is not None:
            doc['country'] = country
        if region is not None:
            doc['region'] = region
        return Supplier(self._collection.update(doc, return_new=True)['new'])

    def add_item(self, supplier_id: str, item_id) -> bool | None:
        """Add an ItemID to the itemList of a supplier

        Args:
            supplier_id (str): ID of the supplier to add the itemLists item to.
            item_id (str): item_id to add to the list

        Returns:
            bool | None: `False` if supplier doesn't exist, `None` if the item_id is already in the itemList of the given supplier, `True` the update was successful.
        """
        supplier = self.get(supplier_id)
        if supplier is None:
            return False
        if item_id in supplier.item_list:
            return None
        self._collection.update({'_key': supplier_id, 'itemList': supplier.item_list + [item_id]})
        return True

    def remove_item(self, supplier_id: str, item_id) -> bool:
        """Remove an ItemID to the itemList of a supplier

        Args:
            supplier_id (str): ID of the supplier to remove the itemLists item from.
            item_id (str): item_id to remove from the list

        Returns:
            bool | None: `False` if supplier doesn't exist, `None` if the item_id already isn't part of the itemList of the given supplier, `True` the update was successful.
        """
        supplier = self.get(supplier_id)
        if supplier is None:
            return False
        if item_id not in supplier.item_list:
            return None
        new_list_as_set = set(supplier.item_list).remove(item_id)
        new_list: list[str] = []
        if new_list_as_set is not None:
            new_list = list(new_list_as_set)
        self._collection.update({'_key': supplier_id, 'itemList': new_list})
        return True

    def create(self, supplier: Supplier) -> bool:
        """Create the given supplier in the database.

        Args:
            supplier (Supplier): Supplier to create.

        Returns:
            bool: `True` if the creation was successful. `False` if an insert error occurred.
        """
        try:
            self._collection.insert(supplier.db_dict)
            return True
        except DocumentInsertError:
            return False
