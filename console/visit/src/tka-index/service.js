import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../common/systems-host';

export function loadMyVisit(pageNo) {
  return fetch.ajax({
    url: `${SystemsHost.kbservcenter}/wireless/visitrecord/queryVisitRecords.json`,
    data: {
      pageNum: pageNo,
      pageSize: 20,
      customerType: 'MERCHANT',
      isContainSub: '0',
    },
  });
}

export function loadTeamVisit(pageNo, pageSize = 100) {
  return fetch.ajax({
    url: `${SystemsHost.kbservcenter}/wireless/visitrecord/queryAllSubordinate.json`,
    data: {
      startLine: (pageNo - 1) * pageSize,
      linesSize: pageSize,
    },
  });
}
