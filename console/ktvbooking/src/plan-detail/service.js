import fetch from '@alipay/kobe-fetch';

const { userId: principalId } = window.GLOBAL_NAV_DATA;

export function queryReservationPlanDetail(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanQueryManager.queryReservationPlanDetail',
    param: { ...param, principalId },
  });
}

export function switchReservationPlan(param) {
  return fetch({
    url: 'kbservindustryprod.reservationPlanOperateManager.switchReservationPlan',
    param: { ...param, principalId },
  });
}
