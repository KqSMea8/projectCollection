import fetch from '@alipay/kobe-fetch';

export function getEditData(param) {
  return fetch({
    url: 'kbservindustryprod.reservedConfigManager.query',
    devServer: 'kbservindustryprod-ztt-1.gz00b.dev.alipay.net',
    param,
  });
}

export function saveData(param) {
  return fetch({
    url: 'kbservindustryprod.reservedConfigManager.save',
    devServer: 'kbservindustryprod-ztt-1.gz00b.dev.alipay.net',
    param,
  });
}
