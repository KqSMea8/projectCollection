import fetch from '@alipay/kobe-fetch';
// 应用组名称
export function queryAppNames(param) {
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryAppNames',
    param,
  });
}
