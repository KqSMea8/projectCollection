import fetch from '@alipay/kobe-fetch';

export function getList(param) {
  return fetch({
    url: 'kobe.demo.pc.getList',
    param,
    mockTime: 1000,
  });
}
