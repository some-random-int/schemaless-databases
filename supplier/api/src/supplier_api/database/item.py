from enum import Enum
import random
from typing import Any
from arango import DocumentInsertError, DocumentDeleteError
from arango.collection import StandardCollection
from arango.database import StandardDatabase

from ..database import Database


class ItemType(Enum):
    OFFICE_SUPPLIES = 'Office Supplies'
    VEGETABLES = 'Vegetables'
    BABY_FOOD = 'Baby Food'
    COSMETICS = 'Cosmetics'
    PERSONAL_CARE = 'Personal Care'
    MEAT = 'Meat'
    SNACK = 'Snacks'
    HOUSEHOLD = 'Household'
    BEVERAGES = 'Beverages'
    FRUITS = 'Fruits'
    CLOTHES = 'Clothes'
    CEREAL = 'Cereal'


class Item():
    """Representation of a document from the Items collection
    """

    def __init__(self, db_document: Any) -> None:
        self._item_id: str = db_document['_key']
        self.item_type: ItemType = ItemType(db_document['itemType'])
        self.unit_cost: float = db_document['unitCost']
        self.unit_price: float = db_document['unitPrice']

    @property
    def item_id(self) -> str:
        """ItemID

        Returns:
            str: ItemID
        """
        return self._item_id

    @property
    def db_dict(self) -> dict:
        """Get the Item as a dict that looks like the document in the database.

        Returns:
            dict: Database like Item document
        """
        return {
            '_key': self.item_id,
            'itemType': self.item_type.value,
            'unitCost': self.unit_cost,
            'unitPrice': self.unit_price
        }

    @staticmethod
    def _generate_random_id() -> str:
        """
        Generate a pseudo-random ID consisting of 8 uppercase letters followed by 4 digits and then 2 uppercase letters.

        Returns:
            str: Pseudo-randomly generated ID.
        """
        uppercase_letters = [chr(random.randint(65, 90)) for _ in range(8)]
        digits = [str(random.randint(0, 9)) for _ in range(4)]
        final_letters = [chr(random.randint(65, 90)) for _ in range(2)]

        random_id = ''.join(uppercase_letters + digits + final_letters)
        return random_id

    @classmethod
    def create_item(cls, item_type: ItemType | str, unit_cost: float, unit_price: float):
        """Create a new Item representation

        Args:
            item_type (ItemType): ItemType
            unit_cost (float): UnitCost
            unit_price (float): UnitPrice

        Returns:
            Item: Created Item representation
        """
        item_id = cls._generate_random_id()
        return cls(
            {
                '_key': item_id,
                'itemType': item_type.value if isinstance(item_type, ItemType) else item_type,
                'unitCost': unit_cost,
                'unitPrice': unit_price
            }
        )


class ItemCollection():
    """Represents the Item collection from the database
    """

    _database: StandardDatabase = None
    _collection: StandardCollection = None

    def __init__(self) -> None:
        if self._database is None:
            self._database = Database().db
        if self._collection is None:
            self._collection = self._database.collection('Items')

    def get(self, item_id: str) -> Item | None:
        """Get an item by its id.

        Args:
            item_id (str): ItemID of the item to get

        Returns:
            Item | None: Item with the given id or `None` if no document found
        """
        cursor = self._collection.find({'_key': item_id})
        count = cursor.count()
        assert count <= 1
        if count == 0:
            return None
        ret = Item(cursor.next())
        cursor.close()
        return ret

    def delete(self, item_id: str) -> bool:
        """Delete an item by its id.

        Args:
            item_id (str): ItemID of the item to delete

        Returns:
            bool: `True` if deletion was successful. `False` if any error occurred.
        """
        try:
            self._collection.delete(item_id)
            return True
        except DocumentDeleteError:
            return False

    def update(self, item_id: str, item_type: ItemType | None = None, unit_cost: float | None = None, unit_price: float | None = None) -> Item:
        """Update an item by its id.

        Args:
            item_id (str): ID of the item to update
            item_type (ItemType | None, optional): New itemType. Only if you want to update it. Defaults to None.
            unit_cost (float | None, optional): New unitCost. Only if you want to update it. Defaults to None.
            unit_price (float | None, optional): New unitPrice. Only if you want to update it. Defaults to None.

        Returns:
            Item: The updated item
        """        
        doc = {'_key': item_id}
        if item_type is not None:
            doc['itemType'] = item_type
        if unit_cost is not None:
            doc['unitCost'] = unit_cost
        if unit_price is not None:
            doc['unitPrice'] = unit_price
        return Item(self._collection.update(doc, return_new=True)['new'])

    def create(self, item: Item) -> bool:
        """Create the given item in the database.

        Args:
            item (Item): Item to create.

        Returns:
            bool: `True` if the creation was successful. `False` if an insert error occurred.
        """
        try:
            self._collection.insert(item.db_dict)
            return True
        except DocumentInsertError:
            return False
