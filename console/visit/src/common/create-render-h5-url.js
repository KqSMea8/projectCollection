import { getEnv } from '@alipay/kobe-util';

/**
 * @param h5AppName h5 应用名，如 kb-m-tkacrm
 * @param path html 路径，带上 query。如：/www/detail.html?pid=2088301224074575
 * @return string 返回 h5应用在当前环境的页面路径，如：
 * http://render-dev.site.alipay.net/p/h5_dev/kb-m-tkacrm-S6180473/www/detail.html?pid=2088301224074575
 */
export default function (h5AppName, path) {
  if (!path) path = '/www/index.html'; // eslint-disable-line
  if (path[0] !== '/') path = `/${path}`; // eslint-disable-line
  const env = getEnv();
  if (env === 'stable' || env === 'dev' || env === 'local') {
    return `http://render-dev.site.alipay.net/p/h5_dev/${h5AppName}${path}`;
  } else if (env === 'test') {
    return `https://render-dev.site.alipay.net/p/h5_test/${h5AppName}${path}`;
  } else if (env === 'pre') {
    return `https://render-pre.alipay.com/p/h5/${h5AppName}${path}`;
  }
  return `https://render.alipay.com/p/h5/${h5AppName}${path}`;
}
