import fetch from '@alipay/kobe-fetch';

export function queryExpenseAndRefundInfoDetail(param) {
  return fetch({
    url: 'kbservindustryprod.reservedTradeDataManager.queryExpenseAndRefundInfoDetail',
    devServer: ['kbservindustryprod-ztt-2.gz00b.dev.alipay.net'],
    param,
  });
}
