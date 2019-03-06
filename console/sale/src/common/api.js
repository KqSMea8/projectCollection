import fetch from '@alipay/kb-fetch';

export const getLoginRole = () => {
  return fetch({
    url: 'kbsales.operatorService.queryLoginUserRole',
  });
};
