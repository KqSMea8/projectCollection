import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../common/systems-host';

export function createRecord(param) {
  return fetch.ajax({
    url: `${
      SystemsHost.kbservcenter
    }/wireless/visitrecord/createVisitRecord.json`,
    method: 'post',
    data: {
      customerType: 'MERCHANT',
      ...param,
    },
  });
}

export function getMerchantDigitalFeedback(param) {
  return fetch({
    url: 'kbservcenter.visitRecordQrManager.getMerchantDigitalFeedback',
    devServer: ['kbservcenter-zth-5.gz00b.dev.alipay.net'],
    param,
  });
}
