import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../../../common/systems-host';

export function getVisitObject(merchantId) {
  return fetch.ajax({
    url: `${SystemsHost.kbservcenter}/wireless/visitrecord/queryContacts.json`,
    data: { customerId: merchantId },
    mockTime: 1000,
  }).then(res => ({
    ...res,
    data: res.data.map(item => ({
      id: item.contactId,
      name: item.name,
      job: item.position === 'OTHER' ? item.remark : item.positionDesc,
      phone: item.tel,
    })),
  }));
}

export function deleteVisitObject(objectId) {
  return fetch({
    url: 'kbservcenter.visitContactPersonManager.deleteContactPerson',
    param: {
      id: objectId,
    },
  });
}
