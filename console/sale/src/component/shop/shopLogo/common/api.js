import fetch from '@alipay/kb-fetch';

/**
 * 查询图片
 */
export function queryPicture(param) {
  return fetch({
    url: 'kbservindustryprod.shopLogoManager.queryPicture',
    param,
    devServer: ['kbservindustryprod-eu95-2.gz00b.dev.alipay.net'],
  });
}

/**
 * 图片资源落库
 */
export function uploadPicture(param) {
  return fetch({
    url: 'kbservindustryprod.shopLogoManager.uploadPicture',
    param,
    devServer: ['kbservindustryprod-eu95-2.gz00b.dev.alipay.net'],
  });
}
