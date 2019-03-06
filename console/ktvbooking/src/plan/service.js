import fetch from '@alipay/kobe-fetch';

const { userId: principalId } = window.GLOBAL_NAV_DATA;

export function queryMerchantSign(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanQueryManager.queryMerchantSign',
    param: { ...param, principalId },
  });
}

export function createMerchantSign(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanOperateManager.createMerchantSign',
    param: { ...param, principalId },
    devServer: ['kbservindustryprod-ztt-3.gz00b.dev.alipay.net'],
  });
}

export function queryServiceList(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanQueryManager.queryServiceList',
    param: { ...param, principalId },
  });
}

export function modifyService(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanManager.modifyService',
    param: { ...param, principalId },
  });
}

export function queryPackageList(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanQueryManager.queryPackageList',
    param: { ...param, principalId },
  });
}

export function modifyPackageAttribute(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanManager.modifyPackageAttribute',
    param: { ...param, principalId },
  });
}

export function queryPriceList(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanQueryManager.queryPriceList',
    param: { ...param, principalId },
  });
}

export function releaseReservationPlan(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanOperateManager.releaseReservationPlan',
    param: { ...param, principalId },
  });
}

/**
 * 默认值
 * @param {*} name 列表名称
 * @param {*} list 现有列表值
 */
export function defaultValue(name, list) {
  if (list && list.length) {
    return list;
  }
  switch (name) {
    case 'resourceList':
      return [{
        resourceId: '',
        resourceName: '小包',
        minUserNumbers: '1',
        maxUserNumbers: '5',
      }, {
        resourceId: '',
        resourceName: '中包',
        minUserNumbers: '6',
        maxUserNumbers: '10',
      }, {
        resourceId: '',
        resourceName: '大包',
        minUserNumbers: '11',
        maxUserNumbers: '15',
      }];
    case 'timeList':
      return [{
        timeId: '',
        startTimeType: 'CURRENT_DAY',
        startTime: '11:00',
        endTimeType: 'CURRENT_DAY',
        endTime: '18:00',
        timeModel: 'PACKAGE_MODE',
      }, {
        timeId: '',
        startTimeType: 'CURRENT_DAY',
        startTime: '18:00',
        endTimeType: 'NEXT_DAY',
        endTime: '00:00',
        timeModel: 'PACKAGE_MODE',
      }, {
        timeId: '',
        startTimeType: 'NEXT_DAY',
        startTime: '00:00',
        endTimeType: 'NEXT_DAY',
        endTime: '06:00',
        timeModel: 'PACKAGE_MODE',
      }];
    case 'packageList':
      return [{
        contentId: '',
        contentType: 'PACKAGE',
        contentName: '',
        contentDesc: '',
        timeIds: [],
        resourceIds: [],
      }];
    default:
      return [];
  }
}
