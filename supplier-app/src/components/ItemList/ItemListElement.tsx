import { FC, useState } from 'react';

import Item from '../../APIs/suppliers/item';
import Suppliers from '../../APIs/suppliers';
import EditPopup from './EditPopup';

type ItemListElementType = {
  itemId: string;
};

const ItemListElement: FC<ItemListElementType> = (props) => {
  const { itemId } = props;
  const [extended, setExtended] = useState<boolean>(false);
  const [item, setItem] = useState<Item>();

  const ensureItem = (callback?: (item: Item) => void) => {
    if (!item) {
      Suppliers.getInstance()
        .getItem(itemId)
        .then((item) => {
          setItem(item);
          callback && callback(item);
        })
        .catch(console.error);
    }
  };

  const getInitialItem: () => Promise<Item> = () => {
    return new Promise<Item>((res) => ensureItem(res));
  };

  const onExtend = () => {
    setExtended(!extended);
    ensureItem();
  };

  return (
    <li>
      {extended && item ? item.toString() : itemId} <button onClick={onExtend}>{extended ? '<' : '>'}</button>{' '}
      <EditPopup getInitialItem={getInitialItem} />
    </li>
  );
};

export default ItemListElement;
