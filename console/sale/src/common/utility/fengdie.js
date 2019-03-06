import env, { Env } from './env';
import ajax from '@alipay/kb-ajax';
const GATEWAY = {
  [Env.LOCAL]: 'http://mobilegw.aaa.alipay.net/mgw.htm',
  [Env.DEV]: 'http://mobilegw.aaa.alipay.net/mgw.htm',
  [Env.TEST]: 'https://mobilegw.test.alipay.net/mgw.htm',
  [Env.STABLE]: 'http://mobilegw.aaa.alipay.net/mgw.htm',
  [Env.PROD]: 'https://mobilegw.alipay.com/mgw.htm',
};

export const gateway = GATEWAY[env];

/**
 * getData 查询凤蝶区块
 * @param {*} path
 * @param {*} auth
 * @see https://lark.alipay.com/basement-group/basement_2.1/h5data
 */
export const getData = (path, options = {}, auth = false) => {
  const operationType = auth ? 'com.alipay.basement.gateway.endpoint' : 'com.alipay.basement.gateway.unauthorizedEndpoint';
  const params = {
    ...options,
    path,
    'x-basement-operation': 'com.alipay.h5data.fengdie.get', // 写死
    // 'x-basement-forward': '127.0.0.1', // 开发环境可以通过 ip 指定请求到特定服务器进行硬负载
  };
  const requestData = encodeURIComponent(JSON.stringify([ params ])); // 需要 encode，因为参数会通过 url 传递
  return new Promise((resolve, reject) => {
    ajax({
      url: `${gateway}?operationType=${operationType}&requestData=${requestData}`,
      type: 'jsonp',
    }).then(res => {
      if (res.resultStatus === 1000 && res.result.success) {
        resolve(res.result.result);
      } else {
        reject(res);
      }
    }).catch(res => {
      reject(res);
    });
  });
};
