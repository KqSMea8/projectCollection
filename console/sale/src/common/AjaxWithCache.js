import ajax from 'Utility/ajax';

const _cache = {};

class Storage {
  constructor({key, timeout = 30000}) {
    this.createdAt = Date.now();
    this.key = key;
    this.timeout = timeout;
    this.data = null;
  }
  get isTimeout() {
    return Date.now() - this.createdAt >= this.timeout;
  }
  remove() {
    _cache[this.key] = undefined;
  }
  set(data) {
    _cache[this.key].data = data;
    this.createdAt = Date.now();
  }
  get() {
    return _cache[this.key].data;
  }
}

function generateKey(opts) {
  return `${(opts.method || 'GET').toUpperCase()}${opts.url}${JSON.stringify(opts.data) || ''}`;
}

function generateOptions(opts, key) {
  const success = function wrapSuccess(data = {}) {
    if (data && (data.status === 'success' || data.status === 'succeed') && _cache[key]) {
      _cache[key].set(data);
    }
    if (typeof opts.success === 'function') opts.success.apply(this, [data]);
  };
  return Object.assign({}, opts, { success });
}

export default function ajaxWithCache(opts) {
  const key = generateKey(opts);
  const ajaxParams = generateOptions(opts, key);
  let res;
  let c = _cache[key];
  if (!c) {
    _cache[key] = c = new Storage({
      key, timeout: opts.cacheTimeout,
    });
    res = ajax(ajaxParams);
  } else if (c.isTimeout) {
    c.remove();
    res = ajax(ajaxParams);
  } else {
    opts.success(c.get());
    res = Promise.resolve(c.get());
  }
  return res;
}
