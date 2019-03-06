import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../common/systems-host';

export function getData(id) {
  return fetch.ajax({
    url: `${
      SystemsHost.kbservcenter
    }/wireless/visitrecord/queryDetailInfo.json`,
    data: { recordId: id },
  });
}
