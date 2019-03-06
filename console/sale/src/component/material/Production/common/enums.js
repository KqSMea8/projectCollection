import { keyMirror } from 'Common/TypeUtils';
export const OrderStatus = keyMirror({
  INIT: null,
  PURCHASING: null,
  ASSIGNABLE: null,
  ASSIGNED: null
});
export const OrderStatusText = {
  [OrderStatus.INIT]: '初始化',
  [OrderStatus.PURCHASING]: '采购中',
  [OrderStatus.ASSIGNABLE]: '可分配',
  [OrderStatus.ASSIGNED]: '分配完成'
};
