export function getOrigin() {
  let origin = window.location.host.match(/(crmhome-zt)|(local.alipay)/) ? 'http://crmhome-zth-9.gz00b.dev.alipay.net' : '';
  if (window.location.search.match('__pickpost')) {
    origin = 'http://pickpost.alipay.net/mockspi/kbservcenter';
  }
  return origin;
}
