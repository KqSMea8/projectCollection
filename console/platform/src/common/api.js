// spi应用列表接口
import fetch from '@alipay/kobe-fetch';

export function queryAppNames(param) {
  console.log('param', param);
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryAppNames',
    param,
  });
}

// 当前环境
export function queryEnvCode(param) {
  console.log('param', param);
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryEnvCode',
    param,
  });
}
