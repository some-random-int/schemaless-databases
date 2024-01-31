import { FC, useEffect, useState } from 'react';
import ItemListElement from './ItemListElement';
import { useTranslation } from 'react-i18next';
import EditPopup from './EditPopup';
import Item from '../../APIs/suppliers/item';
import ItemType from '../../APIs/suppliers/item/itemType';

type ItemListType = {
  itemIds: Array<string>;
};

const ItemList: FC<ItemListType> = (props) => {
  const { itemIds } = props;
  const [items, setItems] = useState<Array<JSX.Element>>();
  const { t } = useTranslation();

  useEffect(() => {
    setItems(itemIds.map((itemId) => <ItemListElement key={itemId} itemId={itemId} />));
  }, [itemIds]);

  const getNewItem: () => Promise<Item> = () =>
    new Promise((res) => res(new Item('placeholder', ItemType.BABY_FOOD, 100, 200)));

  return (
    <ul>
      {items}
      <li>
        <EditPopup getInitialItem={getNewItem} triggerButtonText={t('add_item')} createMode />
      </li>
    </ul>
  );
};

export default ItemList;
