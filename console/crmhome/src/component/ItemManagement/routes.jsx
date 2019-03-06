import BulkAdd from './QuantityItems';
import ItemList from './ItemList/ItemList';
import DetailView from './ItemDetail/DetailView';
// import ItemForm from './ItemDetail/ItemForm';
import ItemOperate from './ItemDetail/ItemOperate';
import './commodity.less';

const routes = [{
  path: 'item-management/item-list',
  component: ItemList,
}, {
  path: 'item-management/detail-edit/:id',
  component: ItemOperate,
}, {
  path: 'item-management/detail-view/:id',
  component: DetailView,
}, {
  path: 'item-management/add-item',
  component: ItemOperate,
}, {
  path: 'item-management/bulk-add',
  component: BulkAdd,
}];

export default routes;
