import fetch from '@alipay/kobe-fetch';

export function querySevenDaysInventoryInfo(param) {
  return fetch({
    url: 'kbservindustryprod.roomStatusManager.querySevenDaysInventoryInfo',
    param,
    devServer: ['kbservindustryprod-zth-1.gz00b.dev.alipay.net'],
  });
}

export function modifyRoomStatusAndInventory(param) {
  return fetch({
    url: 'kbservindustryprod.roomStatusManager.modifyRoomStatusAndInventory',
    param,
    devServer: ['kbservindustryprod-zth-1.gz00b.dev.alipay.net'],
  });
}
