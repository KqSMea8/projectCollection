import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../../../common/systems-host';

export function loadMyMerchant(customerName) {
  return fetch.ajax({
    url: `${SystemsHost.kbservcenter}/wireless/visitrecord/queryCustomer.json`,
    data: {
      type: 'MERCHANT',
      customerName,
      isSelf: 1,
    },
  });
}

export function loadUnderMerchant(customerName) {
  return fetch.ajax({
    url: `${SystemsHost.kbservcenter}/wireless/visitrecord/queryCustomer.json`,
    data: {
      type: 'MERCHANT',
      customerName,
      isSelf: 2,
    },
  });
}
