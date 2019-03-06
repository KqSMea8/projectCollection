import fetch from '@alipay/kobe-fetch';

export function getShops() {
  return fetch.ajax({
    url: `${window.APP.crmhomeUrl}/goods/itempromokb/getShops.json`,
    method: 'get',
    // data: { categoryId: '2016042200000078' },
  });
}

export function getShopsByCity(cityCode) {
  return fetch.ajax({
    url: `${window.APP.crmhomeUrl}/promo/conponsVerify/getShopsByCityForNewCamp.json`,
    method: 'get',
    data: { cityCode },
  });
}
