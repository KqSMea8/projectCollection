import kbAjax from '@alipay/kb-framework/framework/ajax';
import env, {Env} from './env';
import { keyMirror } from '../TypeUtils';

kbAjax.ajaxSetup({
  contentType: 'application/x-www-form-urlencoded; charset=utf-8',
  useIframeProxy: true,
  buserviceUrl: window.APP.buserviceUrl,
  traditional: true,
  // 设置自定义错误拦截
  errorInterceptors: [(t) => {
    return (t.status === 'failed') ? t.resultMsg : null;
  }],
});

export const ApiStatus = {
  SUCCEED: 'succeed',
  FAILED: 'failed',
  SUCCESS: 'success',
};

export const SubmitStatus = keyMirror({
  INIT: null,
  SUBMITTING: null,
  FAILED: null,
  DONE: null
});

export const getUrl = (url) => {
  let completeUrl = window.APP.ownUrl ? window.APP.ownUrl + url : url;
  // 服务端是否为开发机，开发机调用kbasset需要传入相应机器地址
  let isDev = false;
  if (env === Env.LOCAL) {
    // 使用stable/test接口进行本地开发调试时
    isDev = !/(test)|(stable)\.alipay\.net$/.test(window.APP.ownUrl);
  }
  if (env === Env.DEV) {
    isDev = true;
  }

  const isSpi = /proxy\.json/.test(url);
  if (isDev && isSpi) {
    let testUrl = '';
    let type = '';
    if (url.indexOf('mappingValue=kbcateringprod') >= 0) {
      type = 'catering';
    }
    /* eslint indent:0 */
    switch (type) {
      case 'catering':
        testUrl = window.APP.kbcateringprod;
        break;
      default:
        testUrl = window.APP.kbassetServerAddress;
    }
    completeUrl += `${url.indexOf('?') > 0 ? '&' : '?'}testUrl=${testUrl}`;  // e.g. kbassets.dxxxx.alipay.net
  }
  return completeUrl;
};

export const commonCallHandler = options => {
  return new Promise((resolve, reject) => {
    kbAjax(options)
      .then(res => {
        if (res.status === ApiStatus.SUCCEED) {
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default kbAjax;
