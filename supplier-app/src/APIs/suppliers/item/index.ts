import ItemType from './itemType';

class Item {
  private _key: string;
  private _itemType: ItemType;
  private _unitCost: number;
  private _unitPrice: number;

  constructor(_key: string, itemType: ItemType, unitCost: number, unitPrice: number) {
    this._key = _key;
    this._itemType = itemType;
    this._unitCost = unitCost;
    this._unitPrice = unitPrice;
  }

  get id(): string {
    return this._key;
  }

  get itemType(): ItemType {
    return this._itemType;
  }

  set itemType(newItemType: ItemType) {
    this._itemType = newItemType;
  }

  get unitCost(): number {
    return this._unitCost;
  }

  set unitCost(newUnitCost: number) {
    this._unitCost = newUnitCost;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  set unitPrice(newUnitPrice: number) {
    this._unitPrice = newUnitPrice;
  }

  toString(): string {
    return `${this._key}: ${this._itemType.toString()} (Cost: ${this._unitCost}, Price: ${this._unitPrice})`;
  }

  copy(): Item {
    return new Item(this._key, this._itemType, this._unitCost, this._unitPrice);
  }
}

export default Item;
