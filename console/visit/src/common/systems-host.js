import sysConfig from '@alipay/kb-systems-config';
import { getEnv } from '@alipay/kobe-util';

const sysDevHost = {
  kbservcenter: 'http://kbservcenter-zth-5.gz00b.dev.alipay.net',
};

const sysHost = {};
const envConvertMap = {
  prod: 'prod',
  pre: 'prod',
  test: 'test',
  stable: 'stable',
  dev: 'stable',
  local: 'stable',
};
const sysEnv = envConvertMap[getEnv()];
Object.keys(sysConfig).forEach(sys => {
  if (sysEnv === 'stable') {
    sysHost[sys] = sysDevHost[sys] || sysConfig[sys][sysEnv];
  } else {
    sysHost[sys] = sysConfig[sys][sysEnv];
  }
});

export default sysHost;
