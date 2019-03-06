import fetch from '@alipay/kobe-fetch';

// 查询列表
export function queryList(param) {
  console.log('param', param);
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryList',
    param,
  });
}

// 删除
export function delSpiConfig(param) {
  console.log('param', param);
  return fetch({
    url: 'ikbservcenter.spiConfManageService.delSpiConfig',
    param,
  });
}

// 详情接口
export function queryDetail(param) {
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryDetail',
    param,
    devServer: ['ikbservcenter-zth-12.gz00b.dev.alipay.net'],
  });
}

// 修改spi归属人
export function updateSpiOwner(param) {
  console.log('param', param);
  return fetch({
    url: 'ikbservcenter.spiConfManageService.updateSpiOwner',
    param,
  });
}
