import fetch from '@alipay/kobe-fetch';
// 新增
export function createList(param) {
  return fetch({
    url: 'kbsales.KbReportOrderManageFacade.createReportOrder',
    param: { ...param },
    devServer: ['kbsales-zth-10.gz00b.dev.alipay.net'],
  });
}

// 销售人/  报单人
export function getOrderOwnerId(param) {
  return fetch({
    url: 'kbsales.kbReportOrderCommonFacade.searchUsers',
    param,
    devServer: ['kbsales-zth-10.gz00b.dev.alipay.net'],
  });
}

// 报单修改详情
export function getModifyReport(param) {
  return fetch({
    url: 'kbsales.KbReportOrderQueryFacade.queryReportOrderDetail',
    param,
    devServer: ['kbsales-zth-10.gz00b.dev.alipay.net'],
  });
}

// 报单修改
export function createModifyReport(param) {
  return fetch({
    url: 'kbsales.KbReportOrderManageFacade.modifyReportOrder',
    param,
    devServer: ['kbsales-zth-10.gz00b.dev.alipay.net'],
  });
}

// 权限
export function getRight(param) {
  return fetch({
    url: 'kbsales.KbReportOrderManageFacade.checkPermission',
    param,
    devServer: ['kbsales-zth-10.gz00b.dev.alipay.net'],
  });
}

// 搜索上下级权限
export function getPemission(param) {
  return fetch({
    url: 'kbservcenter.authHelper.checkLoginUserPermission',
    param,
    devServer: ['kbservcenter-ztt-1.gz00b.dev.alipay.net'],
  });
}
