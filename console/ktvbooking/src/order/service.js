import fetch from '@alipay/kobe-fetch';

export function getList(param) {
  return fetch({
    url: 'kbservindustryprod.merchantOrderManager.queryMerchantOrderList',
    devServer: 'kbservindustryprod-ztt-3.gz00b.dev.alipay.net',
    param,
  });
}

export function confirmOrder(param) {
  return fetch({
    url: 'kbservindustryprod.merchantOrderManager.confirmBookingOrder',
    devServer: 'kbservindustryprod-ztt-3.gz00b.dev.alipay.net',
    param,
  });
}

export function queryWaitConfirmOrderCount(param) { // 查询待接单数量
  return fetch({
    url: 'kbservindustryprod.merchantOrderManager.queryWaitConfirmOrderCount',
    devServer: 'kbservindustryprod-ztt-3.gz00b.dev.alipay.net',
    param,
  });
}

export function rejectOrder(param) {
  return fetch({
    url: 'kbservindustryprod.merchantOrderManager.rejectBookingOrder',
    devServer: 'kbservindustryprod-ztt-3.gz00b.dev.alipay.net',
    param,
  });
}

export function consumeOrder(param) { // 确认核销
  return fetch({
    url: 'kbservindustryprod.merchantOrderManager.consumeBookingOrder',
    devServer: 'kbservindustryprod-ztt-3.gz00b.dev.alipay.net',
    param,
  });
}
