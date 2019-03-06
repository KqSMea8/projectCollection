export const couponType = {
  ALL_MONEY: '全场代金券',
  ONE_RATE: '单品折扣券',
  ONE_MONEY: '单品代金券',
  ONE_MONEY_REDUCETO: '单品换购券',
  EXCHANGE: '兑换券',
};

export const couponStyle = {
  display: 'inline-block',
  textAlign: 'center',
  verticalAlign: 'top',
  backgroundColor: '#8a8a8a',
  color: '#fff',
  lineHeight: 1.5,
  marginTop: -7,
  marginLeft: 8,
  padding: '4px 16px',
};

export function getShopIds(shopList) {
  if (!shopList) {
    return undefined;
  }
  const shopIds = [];
  if (shopList.length > 0 && shopList[0].shops) {
    shopList.forEach((row) => {
      if (typeof row !== 'object') {
        shopIds.push(row);
      } else {
        row.shops.forEach((r) => {
          shopIds.push(r.id);
        });
      }
    });
    return shopIds;
  }
  return shopList.map(r => r.shopId);
}

export function getPhotoId(url) {
  const match = /\?fileIds=([^&]+)/.exec(url);
  return match ? match[1] : '';
}
