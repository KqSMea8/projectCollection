import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../common/systems-host';

export function searchList(param) {
  return fetch.ajax({
    url: `${SystemsHost.kbservcenter}/wireless/visitrecord/queryVisitRecords.json`,
    data: {
      customerName: param.customerName ? param.customerName : undefined, // 搜索名称
      pageNum: param.pageNum,
      pageSize: 20,
      customerType: 'MERCHANT',
    },
  });
}
