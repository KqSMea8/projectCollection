import fetch from '@alipay/kb-fetch';

export const queryAuth = (param) => {
  return fetch({
    url: 'crmhome.PermissionSPIProcessor.queryOperatorPermission',
    param
  });
};
