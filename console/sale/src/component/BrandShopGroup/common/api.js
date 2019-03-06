import fetch from '@alipay/kb-fetch';

/**
 * 品牌门店组列表查询
 */
export function pageListShopGroup(param) {
  return fetch({
    url: 'kbsales.cspiShopGroupManagementService.pageListShopGroup',
    param,
  });
}

/**
 * 品牌门店组详情查询
 */
export function queryShopGroupDetail(param) {
  return fetch({
    url: 'kbsales.cspiShopGroupManagementService.queryShopGroupDetail',
    param,
  });
}

/**
 * 品牌门店组创建
 */
export function createNewShopGroup(param) {
  return fetch({
    url: 'kbsales.cspiShopGroupManagementService.createNewShopGroup',
    param,
  });
}

/**
 * 品牌门店组修改
 */
export function modifyShopGroup(param) {
  return fetch({
    url: 'kbsales.cspiShopGroupManagementService.modifyShopGroup',
    param,
  });
}

/**
 * 品牌门店组删除
 */
export function deleteShopGroup(param) {
  return fetch({
    url: 'kbsales.cspiShopGroupManagementService.deleteShopGroup',
    param,
  });
}

/**
 * 创建批处理任务
 */
export function createBatchOrder(param) {
  return fetch({
    url: 'kbsales.cspiShopGroupManagementService.createBatchOrder',
    param,
  });
}

/**
 * 导出
 */
export function batchTask(param) {
  return fetch({
    url: 'kbsales.cspiShopGroupManagementService.exportGroup',
    param,
  });
}
