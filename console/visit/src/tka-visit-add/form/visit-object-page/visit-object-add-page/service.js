import fetch from '@alipay/kobe-fetch';
import SystemsHost from '../../../../common/systems-host';

const JobNameToCode = {
  CEO: 'CEO',
  运营总监: 'STAY_DIRECTOR',
  市场总监: 'MARKET_DIRECTOR',
  推广总监: 'WIDE_DIRECTOR',
};

export function addVisitObject(param) {
  return fetch.ajax({
    url: `${SystemsHost.kbservcenter}/wireless/visitrecord/createContact.json`,
    method: 'post',
    data: {
      customerId: param.merchantId,
      name: param.name,
      tel: param.phone,
      position: JobNameToCode[param.job] || 'OTHER',
      otherPosition: !JobNameToCode[param.job] && param.job,
      bizType: 'MERCHANT',
    },
  });
}

export function modifyVisitObject(param) {
  return fetch({
    url: 'kbservcenter.visitContactPersonManager.modifyContactPerson',
    param: {
      customerId: param.merchantId,
      id: param.id,
      name: param.name,
      tel: param.phone,
      position: JobNameToCode[param.job] || 'OTHER',
      otherPosition: !JobNameToCode[param.job] && param.job,
      bizType: 'MERCHANT',
    },
  });
}
