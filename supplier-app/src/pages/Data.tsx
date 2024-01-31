import { FC, MouseEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
// import Suppliers from '../APIs/suppliers';
// import Supplier from '../APIs/suppliers/supplier';
// import Item from '../APIs/suppliers/item';
import EditableField from '../components/EditableField';
import UneditableField from '../components/Field';
import { Card } from 'primereact/card';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Column, ColumnBodyOptions, ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Order, OrderApi } from '../APIs/orders';
import Toolbar from '../components/Toolbar';
import { ItemApi, SupplierApi, ItemModel, SupplierModel } from '../APIs/supplier-generated';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Button, ButtonProps } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

type DataParams = {
  supplier_key: string;
};

interface ItemWithOrders extends ItemModel {
  orders: Order[]|undefined; 
}

const Data: FC = () => {
  const { t } = useTranslation();
  const { supplier_key } = useParams<DataParams>();
  const [supplier, setSupplier] = useState<SupplierModel>();
  const [items, setItems] = useState<ItemWithOrders[]>([]);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows[]>();
  const [editMode, setEditMode] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  const orderApi = new OrderApi();
  const supplierApi = new SupplierApi();
  const itemApi = new ItemApi();

  const orderPriorities = Object.keys(Order.OrderPriorityEnum);
  // console.log(orderPriorities)
  function getSeverity(priority: Order.OrderPriorityEnum|undefined) {
    switch (priority) {
      case Order.OrderPriorityEnum.H:
        return 'danger';
      case Order.OrderPriorityEnum.M:
        return 'warning';
      case Order.OrderPriorityEnum.L:
        return 'success';
      case Order.OrderPriorityEnum.C:
        return 'info';
    }
  }
  const itemTypes = Object.keys(ItemModel.ItemTypeEnum).filter((key: string) => key.match(/[a-z][A-Z]/) === null);

  // useEffect(() => {
  //   setSuppliers(Suppliers.getInstance());
  // }, []);

  // useEffect(() => {
  //   if (supplier_key !== undefined) {
  //     suppliers?.getSupplier(supplier_key).then(setSupplier);
  //   }
  // }, [supplier_key, suppliers]);

  useEffect(() => {
    if (supplier_key !== undefined) {
      supplierApi.supplierSupplierIDGet(supplier_key).then(setSupplier);
    }
  }, [supplier_key]);

  useEffect(() => {
    if (supplier?.itemList === undefined) {
      return;
    }
    // map itemIds to promises
    let responses = supplier.itemList.map((itemId) => itemApi.itemItemIDGet(itemId));
    Promise.all(responses).then((items: ItemModel[]) => {
      const itemsWithOrders = items as ItemWithOrders[];
      setItems(itemsWithOrders);
    });
  }, [supplier])

  const onRowExpand = (event: any) => {
    console.log(event)
    orderApi.getOrdersByItemID(event.data._key).then((res :any) => {
        console.log(res)
        setItems(items.map(item => {
          if (item == event.data) {
            item.orders = res;
          }
          return item;
        }));
    });
  }
  
  const onItemEditComplete = (e: any) => {
    let _items = [...items];
    let { newData, index } = e;

    // Suppliers.getInstance()
    //   .updateItem(item)
    if (newData._key.length > 7) {
      itemApi
        .itemItemIDPut(newData._key, newData)
        .then((res) => {
            _items[index] = newData;
            setItems(_items);
            toast.current?.show({ severity: 'success', summary: 'Updated', detail: `The item ${newData._key} was saved.` });
        }).catch((e) => {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: e });
        });
    } else {
      const { itemType, unitCost, unitPrice } = newData;
      itemApi.itemPost({ itemType, unitCost, unitPrice } as ItemModel)
        .then((res: any) => {
          newData._key = res;
          _items[index] = newData;
          setItems(_items)
          toast.current?.show({ severity: 'success', summary: 'Created', detail: `The item ${newData._key} was saved.` });
          supplierApi.supplierSupplierIDSuppliesItemIDPut(supplier_key!, res)
            .then((res => {
              toast.current?.show({ severity: 'success', summary: 'Saved', detail: `The item was saved to your collection.` });
            }))
            .catch((e) => {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message });
            });
        }).catch((e) => {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message });
        });
    }
  }

  const onOrderEditComplete = (e: any) => {
    let _items = [...items];
    let { newData, index } = e;
    let itemIndex = _items.findIndex(el => el?._key === newData.itemID);
    console.log(itemIndex, _items[itemIndex], _items, newData)
    _items[itemIndex].orders![index] = newData;
  
    if (newData._key) {
      orderApi.updateOrder(newData, newData._key)
        .then((res) => {
          setItems(_items)
          toast.current?.show({ severity: 'success', summary: 'Updated', detail: `The order ${newData._key} was saved.` });
        }).catch((e) => {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message  });
        });
    } else {
      orderApi.createOrder(newData)
        .then((res) => res.json().then((res: Order[]) => {
          console.log(res)
          _items[itemIndex].orders![index] = res[0];
          setItems(_items)
          toast.current?.show({ severity: 'success', summary: 'Created', detail: `The order ${newData._key} was saved.` });
        }).catch((e) => {
          console.log(e)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message });
        }));
    }
  }
  const onItemDelete = (item: ItemWithOrders) => {
    if (item._key.startsWith('tmp_')) {
      setItems(items.filter(el => el._key !== item._key));
      return;
    }
    supplierApi.supplierSupplierIDSuppliesItemIDDelete(supplier_key!, item._key)
    // itemApi.itemItemIDDelete(item._key)
      .then(_ => {
        setItems(items.filter(el => el._key !== item._key));
        toast.current?.show({ severity: 'success', summary: 'Deleted', detail: `The item was deleted.` });
      })
      .catch(e => toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message  }));
  }
  const onSupplierEditComplete = (e: any) => {
    supplierApi.supplierSupplierIDPut(supplier!._key, supplier).then(res => {
      setSupplier(res);
      setEditMode(false);
      toast.current?.show({ severity: 'success', summary: 'Updated', detail: `Your data have been updated.` });
    }).catch((e) => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: e.message });
    });
  }
  
  const textEditor = (options: ColumnEditorOptions) => {
    return <InputText type="text" value={options.value} onChange={(e) =>{options.editorCallback!(e.target.value)}} style={{ width: '100%' }} />;
  };

  const itemTypeEditor = (options: ColumnEditorOptions) => {
    return <Dropdown value={options.value} onChange={(e) =>{options.editorCallback!(e.target.value)}} options={itemTypes} placeholder='Item Type' style={{ width: '100%' }} />;
  };

  const priceEditor = (options: ColumnEditorOptions) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback!(e.value)} mode="currency" currency="EUR" style={{ width: '100%' }} />;
  };

  const numberEditor = (options: ColumnEditorOptions) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback!(e.value)} />;
  };

  // const statusBodyTemplate = (rowData) => {
  //     return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData.inventoryStatus)}></Tag>;
  // };

  const priceBodyTemplate = (rowData: ItemWithOrders, options: ColumnBodyOptions) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(rowData[options.field as keyof ItemWithOrders] as number);
  };
  
  const deleteItemBodyTemplate = (rowData: ItemWithOrders, options: ColumnBodyOptions) => {
    return <Button icon="pi pi-trash" rounded text severity='danger' onClick={() => onItemDelete(rowData)}></Button>
  }

  const priorityTag = (rowData: Order) => <Tag value={rowData.orderPriority} severity={getSeverity(rowData.orderPriority)}></Tag>;
  const priorityEditor = (options: ColumnEditorOptions) => {
        return (
            <Dropdown
                value={options.value}
                options={orderPriorities}
                onChange={(e) => options.editorCallback!(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

  const addOrderEntry = (item: ItemWithOrders) => {
    item.orders?.unshift({ key: 'tmp_' + item.orders.length, itemID: item._key, supplierID: supplier_key });
    const _items = [...items];
    setItems(_items);
  }
  const addOrderButton = (item: ItemWithOrders) => (
          <Button className='add-more-button' text onClick={(event) => addOrderEntry(item)}>{t('add_item')}</Button>
  );
  const orderListTemplate = (item: ItemWithOrders) => {
    return (
      item.orders === undefined ?
      <ProgressBar mode='indeterminate'/>
      :
      <DataTable value={item.orders} paginator rowsPerPageOptions={[10, 25, 50, 100]} paginatorLeft={<div></div>} paginatorRight={addOrderButton(item)} onRowEditComplete={onOrderEditComplete} rows={10} dataKey='_key' editMode='row' tableStyle={{ width: '100%' }}>
          <Column field='orderDate' header='order Date' sortable editor={textEditor} style={{ width: '15%' }}></Column> 
          <Column field='shipDate' header='ship Date' sortable editor={textEditor} style={{ width: '15%' }}></Column> 
          <Column field='orderPriority' header='order Priority' sortable editor={priorityEditor} style={{ width: '5%' }} body={priorityTag}></Column> 
          <Column field='region' header='Region' editor={textEditor} sortable style={{ width: '10%' }}></Column> 
          <Column field='country' header='country' editor={textEditor} sortable style={{ width: '10%' }}></Column> 
          <Column field='unitsSold' header='Units Sold' editor={numberEditor} sortable style={{ width: '10%' }}></Column> 
          <Column field='totalCost' header='total Cost' editor={(options) => priceEditor(options)} sortable body={priceBodyTemplate} style={{ width: '10%' }}></Column> 
          <Column field='totalRevenue' header='total Revenue' editor={(options) => priceEditor(options)} sortable body={priceBodyTemplate} style={{ width: '10%' }}></Column> 
          <Column field='totalProfit' header='total Profit' editor={(options) => priceEditor(options)} sortable body={priceBodyTemplate} style={{ width: '10%' }}></Column> 
          <Column rowEditor={true} style={{ width: '2%' }}></Column>
      </DataTable>
    );
  }


  return (
    <div>
      <Toolbar></Toolbar>
      <div id="data-cards">
        <Card title={t('data')} id="supplier-data-card">
          {supplier ? (
            <div className="supplier-data">
              <label>{t('name')}</label>
              <p>{supplier.name}</p>
              <label>{t('id')}</label>
              <p>{supplier._key}</p>
              <label>{t('country')}</label>
              {editMode ? <InputText value={supplier.country} onChange={(e) => setSupplier({ ...supplier, country: e.target.value })}></InputText> : <p>{supplier.country}</p>}
              <label>{t('region')}</label>
              {editMode ? <InputText value={supplier.region} onChange={(e) => setSupplier({ ...supplier, region: e.target.value })}></InputText> : <p>{supplier.region}</p>}
              <div></div>
              {editMode ? <div><Button icon="pi pi-check" rounded text severity="success" onClick={onSupplierEditComplete}></Button><Button icon="pi pi-times" rounded text severity="danger" onClick={() => setEditMode(false)}></Button></div> : <Button icon="pi pi-pencil" rounded text onClick={() => setEditMode(true)}></Button> }
            </div>
          ) : (
            t('loading')
          )}
        </Card>
        <Card title={t('items')}>
          <DataTable value={items} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows[])} onRowExpand={onRowExpand} rowExpansionTemplate={orderListTemplate}
                    onRowEditComplete={onItemEditComplete} editMode="row" dataKey='_key' scrollable scrollHeight='100%'>
            <Column expander={(rowData) => rowData._key}></Column>
            <Column field='_key' header='ID'></Column> 
            <Column field='itemType' header='Item Type' editor={itemTypeEditor}></Column> 
            <Column field='unitCost' header='Unit Cost' editor={(options) => priceEditor(options)} body={priceBodyTemplate}></Column> 
            <Column field='unitPrice' header='Unit Price' editor={(options) => priceEditor(options)} body={priceBodyTemplate}></Column> 
            <Column rowEditor={true}></Column>
            <Column body={deleteItemBodyTemplate}></Column>
          </DataTable>
          <Button className='add-more-button' text onClick={(event) => setItems([...items, { _key: 'tmp_'+ items.length.toString() } as ItemWithOrders])}>{t('add_item')}</Button>
        </Card>
      </div>
      <Toast ref={toast} position="bottom-center" content='' />
    </div>
  );
};

export default Data;
