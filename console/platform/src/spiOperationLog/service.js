import fetch from '@alipay/kobe-fetch';

// 操作日志列表
export function queryLogList(param) {
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryLogList',
    param,
  });
}

// spi接口回滚
export function rollBackSpiConfig(param) {
  return fetch({
    url: 'ikbservcenter.spiConfManageService.rollBackSpiConfig',
    param,
  });
}
