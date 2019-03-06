import {keyMirror} from '../TypeUtils';
export const Env = keyMirror({
  DEV: null,
  LOCAL: null,
  TEST: null,
  STABLE: null,
  PROD: null
});

const domain = location.hostname;
let _env = Env.PROD;

if (/\.alipay\.net$/.test(domain)) {
  if (/mock\.alipay\.net$/.test(domain)) {
    _env = Env.LOCAL; // mock
  } else if (/\.test\.alipay\.net$/.test(domain)) {
    _env = Env.TEST;
  } else if (/\.stable\.alipay\.net$/.test(domain)) {
    _env = Env.STABLE;
  } else {
    _env = Env.DEV;
  }
}

export default _env;
