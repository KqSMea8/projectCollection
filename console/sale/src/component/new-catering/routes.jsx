import MerchantOrder from './merchant/order';
import MerchantInventory from './merchant/inventory';
import MerchantShops from './merchant/shops';
import SupplierOrder from './supplier/order';
import SupplierGoods from './supplier/goods';
import SupplierInventory from './supplier/inventory';

export default [
  {
    path: 'new-catering/merchant/order', // 商家-采购订单
    component: MerchantOrder,
  }, {
    path: 'new-catering/merchant/inventory', // 商家-库存管理
    component: MerchantInventory,
  }, {
    path: 'new-catering/merchant/shops', // 商家-新餐饮服务管理
    component: MerchantShops,
  }, {
    path: 'new-catering/supplier/order', // 供应商-供货订单
    component: SupplierOrder,
  }, {
    path: 'new-catering/supplier/goods', // 供应商-货品档案
    component: SupplierGoods,
  }, {
    path: 'new-catering/supplier/inventory', // 供应商-库存管理
    component: SupplierInventory,
  },
];
