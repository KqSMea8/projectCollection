import './common.less';
import ajax from './ajax';
import fetch from '@alipay/kb-fetch';

ajax.ajaxSetup({
  contentType: 'application/x-www-form-urlencoded; charset=utf-8',
  useIframeProxy: true,
  traditional: true,
  // 设置自定义错误拦截
  errorInterceptors: [(t) => {
    return (t.status === false || t.status === 'failed' || t.status === 'fail') ? (t.resultMsg || t.errorMsg || '请求异常') : null;
  }],
});

if (!/test\.alipay\.net/.test(location.hostname) && /\.alipay\.net/.test(location.hostname)) {
  fetch.setup({
    gwServer: 'http://kbservcenter-zth-32.gz00b.dev.alipay.net/spigw.json',
    devServer: [
      window.APP.kbservcenterUrl,
      window.APP.crmhomeUrl,
      window.APP.kbsalesUrl,
      'kbshopdecorate-zth-2.gz00b.dev.alipay.net',
      'kbaudit-zth-4.gz00b.dev.alipay.net',
    ],
  });
}
