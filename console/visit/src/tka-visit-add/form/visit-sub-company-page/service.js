import fetch from '@alipay/kobe-fetch';

export function getSubCompany(merchantId) {
  return fetch({
    url: 'kbsales.merchantCompanyManager.getByMerchantId',
    param: {
      merchantId,
    },
    mockTime: 1000,
  });
}
