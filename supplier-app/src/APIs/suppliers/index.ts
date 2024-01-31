import Item from './item';
import ItemType from './item/itemType';
import Supplier from './supplier';

class Suppliers {
  private static instance = new Suppliers();

  static getInstance(): Suppliers {
    return this.instance;
  }

  /**
   * Tests the connectivity to the Suppliers-Database-API
   *
   * @returns `true` if the Suppliers-Database-API is online
   */
  ping(): Promise<boolean> {
    return new Promise<boolean>((res) => {
      fetch('http://localhost:5002')
        .then((response) => {
          res(response.ok);
        })
        .catch(() => res(false));
    });
  }

  /**
   * Get an supplier by its _key
   *
   * @param id _key, of the supplier you need
   * @returns Promise resolving the supplier, if a supplier with the given id exists
   */
  getSupplier(id: string): Promise<Supplier> {
    if (id === '0123456789abcdef') {
      return new Promise((res) =>
        res(new Supplier('0123456789abcdef', 'test supplier', 'Germany', 'Europe', ['ABANGOFF0001GE'])),
      );
    } else {
      return new Promise((res, rej) => rej('Unknown ID, use test id "0123456789abcdef"'));
    }
  }

  updateSupplier(supplier: Supplier): Promise<boolean> {
    return new Promise<boolean>((res) => res(true));
  }

  /**
   * Get an item by its _key
   *
   * @param id _key, of the item you need
   * @returns Promise resolving the item, if an item with the given id exists
   */
  getItem(id: string): Promise<Item> {
    if (id === 'ABANGOFF0001GE') {
      return new Promise((res) => res(new Item('ABANGOFF0001GE', ItemType.FRUITS, 123, 456)));
    } else {
      return new Promise((res, rej) => rej('Unknown ID, use test id "ABCDEFGH1234IJ"'));
    }
    //   return new Promise<string>((res, rej) => {
    //     fetch(`http://localhost:5000/item/${id}`).then((response) => {
    //       if (!response.ok) {
    //         rej('Item not found');
    //       }
    //       response.text().then(res);
    //     });
    //   });
  }

  updateItem(item: Item): Promise<boolean> {
    return new Promise<boolean>((res) => res(true));
  }

  deleteItem(id: string): Promise<boolean> {
    return new Promise<boolean>((res) => res(true));
  }

  /**
   * Create and add a new Item
   * 
   * @param itemType 
   * @param unitCost 
   * @param unitPrice 
   * @returns the _key of the newly created item
   */
  addItem(itemType: ItemType, unitCost: number, unitPrice: number): Promise<string> {
    return new Promise<string>((res) => res('todo'));
  }
}

export default Suppliers;
