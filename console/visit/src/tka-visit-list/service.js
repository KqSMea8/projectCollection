import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../common/systems-host';

export function visitList(param) {
  return fetch.ajax({
    url: `${SystemsHost.kbservcenter}/wireless/visitrecord/queryVisitRecords.json`,
    data: {
      ownerId: param.opId,
      visitPersonId: param.opId,
      pageNum: param.pageNum,
      pageSize: 20,
      customerType: 'MERCHANT',
      isContainSub: '0',
    },
  });
}
