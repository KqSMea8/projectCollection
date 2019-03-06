import fetch from '@alipay/kobe-fetch';

export function approve(param) {
  return fetch({
    url: 'kbservcenter.visitRecordOpManager.auditRecord',
    param,
    mockTime: 1000,
  });
}
