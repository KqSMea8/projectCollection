import fetch from '@alipay/kobe-fetch';

export function addSubCompany(merchantId, content) {
  return fetch({
    url: 'kbsales.merchantCompanyManager.add',
    param: {
      merchantId,
      name: content,
    },
  });
}
