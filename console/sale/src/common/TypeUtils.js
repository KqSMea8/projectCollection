export function enumFactory(obj) {
  const fields = Object.keys(obj);
  const res = {};
  fields.forEach((field) => {
    res[res[field] = obj[field]] = field;
  });
  return res;
}

export class HashSet {
  constructor() {
    Object.defineProperty(this, '_array_', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: [],
    });
  }

  add(v) {
    let res = false;
    if (this._array_.indexOf(v) === -1) {
      res = true;
      this._array_.push(v);
    }
    return res;
  }

  contains(v) {
    return this._array_indexOf(v) === -1;
  }

  all() {
    return this._array_;
  }
}

/**
 * @copyright facebook @see https://github.com/STRML/keyMirror/blob/master/index.js
 * @param obj
 * @returns {{}}
 */
export function keyMirror(obj) {
  const ret = {};
  let key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = key;
    }
  }
  return ret;
}
