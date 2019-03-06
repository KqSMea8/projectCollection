export const pathToTab = {
  '/order/stay': 'stay',
  '/order/unused': 'unused',
  '/order/consumed': 'consumed',
  '/order/back': 'back',
};

export const tabToStatus = {
  stay: 'WAIT_CONFIRM', // 待接单
  unused: 'WAIT_CONSUME', // 未消费
  consumed: 'CONSUMED', // 已消费
  back: 'REFUND', // 已退订
};

export const statusToTab = {
  WAIT_CONFIRM: 'stay', // 待接单
  WAIT_CONSUME: 'unused', // 未消费
  CONSUMED: 'consumed', // 已消费
  REFUND: 'back', // 已退订
};

export const orderStatus = {
  WAIT_CONFIRM: '待接单', // PENDING_ORDER WAIT_CONFIRM
  WAIT_CONSUME: '未消费', // WAIT_CONSUME UNCONSUMED
  CONSUMED: '已消费',
  REFUND: '已退订',
};
