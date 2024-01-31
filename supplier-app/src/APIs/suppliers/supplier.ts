class Supplier {
  private _key: string;
  private _name: string;
  private _country: string;
  private _region: string;
  private _itemList: Array<string>;

  constructor(_key: string, name: string, country: string, region: string, itemList: Array<string>) {
    this._key = _key;
    this._name = name;
    this._country = country;
    this._region = region;
    this._itemList = itemList.slice();
  }

  get id(): string {
    return this._key;
  }

  get name(): string {
    return this._name;
  }

  get country(): string {
    return this._country;
  }

  get region(): string {
    return this._region;
  }

  get itemList(): Array<string> {
    return this._itemList.slice();
  }

  set country(new_country) {
    this._country = new_country
  }

  setCountry(new_country: string) {
    this.country = new_country;
  }

  setRegion(new_region: string) {
    this._region = new_region;
  }
}

export default Supplier;
