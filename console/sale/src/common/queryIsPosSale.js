import fetch from '@alipay/kb-fetch';

let loadingPromise;
export default function() {
  if (loadingPromise) return loadingPromise;
  loadingPromise = fetch({
    url: 'kbsales.operatorService.queryLoginUserRoleV2',
  }).then(getUserResp => {
    return getUserResp.data.isPosSale === 'Y';
  }).catch(e => {
    loadingPromise = null;
    throw e;
  });
  return loadingPromise;
}
