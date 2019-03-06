import fetch from '@alipay/kobe-fetch';
// 详情接口
export function queryDetail(param) {
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryDetail',
    param,
  });
}
