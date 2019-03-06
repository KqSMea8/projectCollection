import fetch from '@alipay/kb-fetch';

export const getAuthTree = () => {
  return fetch({
    url: 'crmhome.PermissionSPIProcessor.queryPermissionTree',
    host: ['crmhome-zth-18.gz00b.dev.alipay.net']
  });
};
export const publish = () => {
  return fetch({
    url: 'crmhome.PermissionSPIProcessor.publishSysMdpVersion',
    host: ['crmhome-zth-18.gz00b.dev.alipay.net']
  });
};

export const addAuth = (param) => {
  return fetch({
    url: 'crmhome.PermissionSPIProcessor.createPermission',
    host: ['crmhome-zth-18.gz00b.dev.alipay.net'],
    param
  });
};

export const modifyAuth = (param) => {
  return fetch({
    url: 'crmhome.PermissionSPIProcessor.updatePermission',
    host: ['crmhome-zth-18.gz00b.dev.alipay.net'],
    param
  });
};

export const deleteAuth = (param) => {
  return fetch({
    url: 'crmhome.PermissionSPIProcessor.deletePermission',
    host: ['crmhome-zth-18.gz00b.dev.alipay.net'],
    param
  });
};
