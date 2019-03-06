import fetch from '@alipay/kobe-fetch';

// 查询订单
export function queryMerchantOrderByOrderId(param) {
  return fetch({
    url: 'kbservindustryprod.merchantOrderManager.queryManualRefundOrder',
    devServer: ['kbservindustryprod-ztt-3.gz00b.dev.alipay.net'],
    param,
  });
}

// 确认退款
export function refundBookingOrder(param) {
  return fetch({
    url: 'kbservindustryprod.merchantOrderManager.refundBookingOrder',
    devServer: ['kbservindustryprod-ztt-3.gz00b.dev.alipay.net'],
    param,
  });
}
