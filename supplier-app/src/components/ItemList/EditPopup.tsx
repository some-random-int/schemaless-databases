import { FC, useState } from 'react';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Item from '../../APIs/suppliers/item';
import ItemType from '../../APIs/suppliers/item/itemType';
import { useTranslation } from 'react-i18next';
import Suppliers from '../../APIs/suppliers';

type EditPopupType = {
  getInitialItem: () => Promise<Item>;
  triggerButtonText?: string;
  createMode?: boolean;
};

const EditPopup: FC<EditPopupType> = (props) => {
  const { getInitialItem, triggerButtonText = '🖉', createMode = false } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [initialItem, setInitialItem] = useState<Item>();
  const [itemType, setItemType] = useState<ItemType>();
  const [unitCost, setUnitCost] = useState<number>();
  const [unitPrice, setUnitPrice] = useState<number>();

  const onOpen = () => {
    if (!initialItem) {
      getInitialItem().then((item) => {
        setInitialItem(item);
        setItemType(item.itemType);
        setUnitCost(item.unitCost);
        setUnitPrice(item.unitPrice);
        setOpen(true);
      });
    } else {
      setOpen(true);
    }
  };

  const onSave = () => {
    if (!initialItem || !itemType || !unitCost || !unitPrice) {
      setOpen(false);
      return;
    } else if (!createMode) {
      let itemToSave = initialItem.copy();
      itemToSave.itemType = itemType;
      itemToSave.unitCost = unitCost;
      itemToSave.unitPrice = unitPrice;
      Suppliers.getInstance()
        .updateItem(itemToSave)
        .then(() => setOpen(false));
    } else {
      Suppliers.getInstance()
        .addItem(itemType, unitCost, unitPrice)
        .then(() => setOpen(false));
    }
  };

  const onDelete = () => {
    if (!initialItem) {
      return;
    }
    Suppliers.getInstance()
      .deleteItem(initialItem.id)
      .then(() => setOpen(false));
  };

  return (
    <Popup
      trigger={<button className="button">{triggerButtonText}</button>}
      modal
      closeOnDocumentClick={false}
      open={open}
      onOpen={onOpen}
    >
      <div>
        <div>
          <p>
            Type:{' '}
            <select
              value={Object.keys(ItemType).filter((k, i) => Object.values(ItemType)[i] === itemType?.valueOf())[0]}
              onChange={(event) => setItemType(ItemType[event.target.value as keyof typeof ItemType])}
            >
              {Object.keys(ItemType).map((key) => (
                <option key={key.valueOf()} value={key}>
                  {ItemType[key as keyof typeof ItemType]}
                </option>
              ))}
            </select>
          </p>
          <p>
            Cost: <input value={unitCost || ''} onChange={(e) => setUnitCost(Number.parseFloat(e.target.value))} />
          </p>
          <p>
            Price: <input value={unitPrice || ''} onChange={(e) => setUnitPrice(Number.parseFloat(e.target.value))} />
          </p>
        </div>
        <div>
          {' '}
          <button onClick={() => setOpen(false)}>{t('abort')}</button> <button onClick={onSave}>{t('save')}</button>{' '}
          {createMode || <button onClick={onDelete}>{t('delete')}</button>}
        </div>{' '}
      </div>
    </Popup>
  );
};

export default EditPopup;
