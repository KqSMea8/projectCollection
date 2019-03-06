import React from 'react';
import ajax, {getUrl} from 'Utility/ajax';
import { TreeSelect } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';

const TreeNode = TreeSelect.TreeNode;

/*eslint-disable */
export function array2StringJoinByComma(array = [], count = 4) {
  if (array && array.length > count) {
    const ret = [];
    for (let i = 0; i < Math.ceil(array.length / count); i++) {
      const itemArray = [];
      for (let j = i * count; j < i * count + count; j++) {
        if (array[j]) {
          itemArray.push(array[j]);
        }
      }
      ret.push(<p>{itemArray.join(',')}</p>);
    }
    return <div>{ret}</div>;
  }
  return array.join(',');
}
/*eslint-enable */
export function keepSessionAlive() {
  window.setInterval(() => {
    ajax({
      url: 'check.json',
      method: 'get',
      type: 'json',
      success: () => { },
    });
  }, 60000);
}

export function trimAjaxParams(params) {
  if (params) {
    for (const o in params) {
      if (params.hasOwnProperty(o) && typeof params[o] === 'string') {
        params[o] = params[o].trim();
      }
    }
  }
  return params;
}

export function appendOwnerUrlIfDev(url) {
  // moved to Utility/ajax, for more precise naming
  return getUrl(url);
}

export function remoteLog(seed) {
  if (window.Tracker && window.Tracker.click) {
    window.Tracker.click(seed);
  }
}

export const getEntityCode = (code) => {
  const dom = document.createElement('div');
  dom.innerHTML = code;
  return dom.innerText || dom.textContent;
};

// 格式化金额
function outPutDollars(number) {
  if (number.length <= 3) {
    return (number === '' ? '0' : number);
  }
  if (number.length > 3) {
    const mod = number.length % 3;
    let output = (mod === 0 ? '' : (number.substring(0, mod)));
    for (let i = 0; i < Math.floor(number.length / 3); i++) {
      if ((mod === 0) && (i === 0)) {
        output += number.substring(mod + 3 * i, mod + 3 * i + 3);
      } else {
        output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
      }
    }
    return (output);
  }
}
function outPutCents(amount) {
  const newAmount = Math.round(((amount) - Math.floor(amount)) * 100);
  return (newAmount < 10 ? '.0' + newAmount : '.' + newAmount);
}
// 有小数位时 金额每隔三位用逗号隔开，且第一位不出现逗号。且精确到.00
export function cutStr(number) {
  let newNum = number.replace(/\,/g, '');
  if (isNaN(newNum) || newNum === '') return '';
  newNum = Math.round(newNum * 100) / 100;
  if (newNum < 0) {
    return '-' + outPutDollars(Math.floor(Math.abs(newNum) - 0) + '') + outPutCents(Math.abs(newNum) - 0);
  }
  if (newNum >= 0) {
    return outPutDollars(Math.floor(newNum - 0) + '') + outPutCents(newNum - 0);
  }
}

// 无小数位时 数字每隔三位用逗号隔开，且第一位不出现逗号。
function cutNum(str) {
  const newStr = new Array(str.length + parseInt(str.length / 3, 10));
  const strArray = str.split('');
  newStr[newStr.length - 1] = strArray[strArray.length - 1];
  let currentIndex = strArray.length - 1;
  for (let i = newStr.length - 1; i >= 0; i--) {
    if ((newStr.length - i) % 4 === 0) {
      newStr[i] = ',';
    } else {
      newStr[i] = strArray[currentIndex--];
    }
    if (newStr.indexOf(',') === 0) {
      newStr.splice(0, 1);
    }
  }
  return newStr.join('');
}

export { cutNum };
export function subFloatNum(number) {
  let cutNum1;
  let str = '';
  if (number.indexOf('.') !== -1) {
    cutNum1 = number.substr(0, number.indexOf('.'));
    str = number.substr(number.indexOf('.'));
  } else {
    cutNum1 = number;
  }

  return cutNum(cutNum1) + str;
}


export function transFormAmount(amount) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(amount)) {
    return '数据非法';
  }
  let unit = '千百拾亿千百拾万千百拾元角分';
  let str = '';
  let n = amount;
  n += '00';
  const p = n.indexOf('.');
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2);
  }
  unit = unit.substr(unit.length - n.length);
  for (let i = 0; i < n.length; i++) {
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  }
  return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整');
}

export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

function transformMul(a, b) {
  let c = 0;
  const d = a.toString();
  const e = b.toString();
  try {
    c += d.split('.')[1].length;
    c += e.split('.')[1].length;
  } finally {
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
  }
}

//  浮点数的精确计算 相加
export function floatAdd(a, b) {
  let c = '';
  let d = '';
  let e = '';
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  e = Math.pow(10, Math.max(c, d));
  return (transformMul(a, e) + transformMul(b, e)) / e;
}

// 浮点数的精确计算 相减
export function floatSub(a, b) {
  let c = '';
  let d = '';
  let e = '';
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  e = Math.pow(10, Math.max(c, d));
  return (transformMul(a, e) - transformMul(b, e)) / e;
}

export function times(arg1, arg2) {
  let m = '';
  let n = '';
  let f = '';
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    m = 0;
  }
  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    n = 0;
  }
  f = Math.pow(10, Math.max(m, n));
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / f;
}

// 返回值：arg1除以arg2的精确结果
export function div(arg1, arg2) {
  let t1 = 0;
  let t2 = 0;
  let r1 = '';
  let r2 = '';
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

export function replaceDoubleQuotes(str) {
  return str.replace(/(^\")|(\"$)/g, '');
}

/**
 * 生成 TreeNode 用
 *
 * @export generateTree
 * @param {Object | null} [opts={
 *   value: d => d.value,
 *   key: d => d.key,
 *   title: d => d.title,
 *   disable: d => d.disable,
 *   children: d => d.children,
 * }]
 * @returns 用来生成树的工厂函数，可以随时改取值配置
 */
export function generateTree(opts = {
  value: d => d.value,        // 配置 value     取值委托
  key: d => d.key,            // 配置 key       取值委托
  title: d => d.title,        // 配置 title     取值委托
  disable: d => d.disable,    // 配置 disabled  取值委托
  children: d => d.children,  // 配置 children  取值委托
}) {
  const options = Object.assign({}, opts, {
    generateChildren: d => generateTree(options).create(options.children(d)),
  });
  const rtn = {
    value(fn) {
      options.value = fn;
      return rtn;
    },
    key(fn) {
      options.key = fn;
      return rtn;
    },
    title(fn) {
      options.title = fn;
      return rtn;
    },
    disabled(fn) {
      options.disabled = fn;
      return rtn;
    },
    /**
     * 传入树数据，生成 Tree
     * @param {Array} data 树数据
     * @returns Tree
     */
    create(data) {
      if (!data || !data.length) return null;
      const res = [];
      let datum;
      for (let i = 0; i < data.length; ++i) {
        datum = data[i];
        res.push(
          <TreeNode
            value={options.value(datum)}
            title={options.title(datum)}
            key={options.key(datum)}
            disabled={options.disable(datum)}
          >
            {datum.children && datum.children.length
              ? options.generateChildren(datum) : null}
          </TreeNode>
        );
      }
      return res;
    },
  };
  return rtn;
}


function _flattenWithDepth(array, result, dep, format) {
  const _dep = dep;
  for (let i = 0; i <= array.length - 1; ++i) {
    const v = format(array[i], _dep);
    if (v.array !== undefined && _dep > 0) {
      _flattenWithDepth(v.array, result, _dep - 1, format);
    }
    if (v.value !== undefined) {
      result.push(v.value);
    }
  }
  return result;
}

export function flatten(arr, format, depth) {
  let res;
  let f = (e) => {
    if (e.length) return { array: e };
    return { value: e };
  };
  if (typeof format === 'function') {
    f = format;
  }
  if (!isNaN(depth) && depth > 0) {
    res = _flattenWithDepth(arr, [], depth, f);
  } else if (depth <= 0) {
    res = [f(arr[0]).value];
  } else {
    res = [];
  }
  return res;
}

export function getUrlByResourceId(resourceId) {
  return `${window.APP.kbservcenterUrl}/sale/asset/saleFileDownload.resource?resourceId=${encodeURIComponent(resourceId)}`;
}

export function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
}

export function getQueryFromURL(search) {
  if (!search) return {};
  const searchMeta = search.charAt(0) === '?' ? search.substr(1) : search;
  return searchMeta
    .split('&')
    .map(d => {
      const mc = d.match(/(.+)=(.*)/i);
      return mc && mc.length ? d.match(/(.+)=(.*)/i).slice(1, 3) : undefined;
    })
    .reduce((res, c) => { if (c) { res[c[0]] = decodeURIComponent(c[1]); } return res; }, {});
}

export function getElementOffset(element) {
  let offset = {
    top: 0,
    left: 0
  };
  if (element) {
    let scrollY;
    let scrollX;
    const elementClientRect = element.getBoundingClientRect();
    if (window.pageYOffset !== null) {
      scrollY = window.pageYOffset;
      scrollX = window.pageXOffset;
    } else {
      const t = document.documentElement || document.body.parentNode;
      const tt = (typeof t.scrollTop === 'number' ? t : document.body);
      scrollY = tt.scrollTop;
      scrollX = tt.scrollLeft;
    }
    offset = {
      top: scrollY + elementClientRect.top,
      left: scrollX + elementClientRect.left
    };
  }
  return offset;
}

export function getImageById(id) {
  return `https://oalipay-dl-django.alicdn.com/rest/1.0/image?fileIds=${id}&zoom=original`;
}

export function hasSignPermisson() {
  return permission('KB_PROTOCAL_SIGN_MANAGE');
}
