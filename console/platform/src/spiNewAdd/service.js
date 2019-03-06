import fetch from '@alipay/kobe-fetch';

// 详情接口
export function queryDetail(param) {
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryDetail',
    param,
    devServer: ['ikbservcenter-zth-12.gz00b.dev.alipay.net'],
  });
}

// 新增接口
export function addSpiConfig(param) {
  return fetch({
    url: 'ikbservcenter.spiConfManageService.addSpiConfig',
    param,
  });
}

// 修改接口
export function updateSpiConfig(param) {
  return fetch({
    url: 'ikbservcenter.spiConfManageService.updateSpiConfig',
    param,
  });
}

// SPI应用组添加
export function addKbProxyenvGroup(param) {
  return fetch({
    url: 'ikbservcenter.spiConfManageService.addKbProxyenvGroup',
    param,
  });
}

// SPI应用组修改
export function updateKbProxyenvGroup(param) {
  return fetch({
    url: 'ikbservcenter.spiConfManageService.updateKbProxyenvGroup',
    param,
  });
}

// 应用名详情查询
export function queryProxyenvGroupDetail(param) {
  return fetch({
    url: 'ikbservcenter.spiConfQueryService.queryProxyenvGroupDetail',
    param,
  });
}
