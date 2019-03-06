const ARRAY_TYPE = Object.prototype.toString.call([]);

export function flatten(input, shallow, strict, startIndex) {
  const output = []; let idx = 0;
  for (let i = startIndex || 0, length = input && input.length; i < length; i++) {
    let value = input[i];
    if (ARRAY_TYPE === Object.prototype.toString.call(value)) {
      if (!shallow) value = flatten(value, shallow, strict);
      let j = 0;
      const len = value.length;
      output.length += len;
      while (j < len) {
        output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}

export function nest(array, xpath) {
  const _array = flatten(array);
  const paths = xpath.split('.');

  const res = {};
  _array.forEach(d => {
    let curObj = res;
    for (let i = 0; i < paths.length; i++) {
      const curField = d[paths[i]];
      if (!curObj[curField]) {
        curObj[curField] = i === paths.length - 1 ? [] : {};
      }
      if (paths.length - 1 === i) {
        curObj[curField].push(d);
      }
      curObj = curObj[curField];
    }
  });
  return res;
}
