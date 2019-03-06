import React from 'react';
import ajax from '@alipay/ajax';
import moment from 'moment';
const saveKey = `crmhomeStorage${window.GLOBAL_NAV_DATA && window.GLOBAL_NAV_DATA.userId ? window.GLOBAL_NAV_DATA.userId : ''}`;

export function addNewline(text, limit) {
  if (!text) {
    return '';
  }
  const list = [];
  const total = text.length;
  let word = '';
  for (let i = 0; i < total; i++) {
    const char = text.charAt(i);
    word += char;
    if (word.length === limit || i + 1 === total) {
      list.push(word);
      list.push(<br key={i}/>);
      word = '';
    }
  }
  return list;
}
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
export function formateNum(price = 0, needInt) {
  if (!parseFloat(price)) {
    return '暂无数据';
  }

  const priceInit = parseFloat(price);
  const priceValue = String(parseInt(priceInit, 10)).split('').reverse();
  const priceLeave = priceInit && !needInt ? priceInit.toFixed(2).substr(-3) : '';
  return priceValue.map((item, index) => {
    let itemInfo = item;
    if (index && index % 3 === 0 && index !== price.length) {
      itemInfo += ',';
    }
    return itemInfo;
  }).reverse().join('') + priceLeave;
}

export function briefNum(price = 0, needInt) {
  const transferPrice = Number(price);
  if (transferPrice > 99999999.99) {
    return formateNum(transferPrice / 10000000, needInt) + '亿';
  }
  if (transferPrice.length > 9999.99) {
    return formateNum(transferPrice / 1000, needInt) + '万';
  }
  return formateNum(price, needInt);
}

export function decodeHTML(content) {
  const dom = document.createElement('div');
  dom.innerHTML = content;
  return dom.innerText || dom.textContent;
}

export function customLocation(url, target) {
  const merchantId = document.getElementById('J_crmhome_merchantId').value || '';
  const merchantParam = 'op_merchant_id=' + merchantId;
  let custUrl = url;
  if (merchantId) {
    const urlPattern = custUrl.split('#');
    const baseUrl = urlPattern[0];
    const hash = urlPattern[1];
    custUrl = baseUrl.indexOf('?') > -1 ? (baseUrl + '&' + merchantParam) : (baseUrl + '?' + merchantParam);
    if (hash) {
      custUrl = custUrl + '#' + hash;
    }
  }

  if (target === '_blank') {
    window.open(custUrl);
  } else {
    const node = document.getElementById('J_isFromKbServ');
    if (node && node.value === 'true') {
      window.location.href = custUrl;  // eslint-disable-line no-location-assign
    } else {
      window.top.location.href = custUrl;  // eslint-disable-line no-location-assign
    }
  }
}

export function saveJumpTo(url, target) {
  const merchantId = document.getElementById('J_crmhome_merchantId').value || '';
  let fullUrl = url;
  if (/(^http|https):\/\/.+/i.test(url)) {
    fullUrl = url;
  } else if (/^\/\/[^/].+/i.test(url)) {
    fullUrl = `${location.protocol}${url}`;
  } else if (url.charAt(0) === '/' && url.charAt(1) !== '/') {
    fullUrl = `${location.protocol}//${location.host}${location.port ? ':' : ''}${location.port}${url}`;
    if (merchantId) {
      fullUrl += `${url.indexOf('?') >= 0 ? '&' : '?'}op_merchant_id=${merchantId}`;
    }
  } else if (url.charAt(0) !== '#') { // 相对路径跳转
    const pathnameList = location.pathname.split('/');
    pathnameList.splice(-1, 1, url);
    fullUrl = `${location.protocol}//${location.host}${location.port ? ':' : ''}${location.port}${pathnameList.join('/')}`;
    if (merchantId) {
      fullUrl += `${url.indexOf('?') >= 0 ? '&' : '?'}op_merchant_id=${merchantId}`;
    }
  } else if (url.charAt(0) === '#') {
    fullUrl = location.href.replace(/#(.*)$/, url); // eslint-disable-line no-location-assign
    if (target === '_blank') {
      fullUrl = window.top.location.href.replace(/#(.*)$/, url);  // eslint-disable-line no-location-assign
    }
  }
  if (target === '_blank') {
    window.open(fullUrl);
  } else {
    location.href = fullUrl;  // eslint-disable-line no-location-assign
  }
}

export function getValueFromQueryString(name) {
  let value;
  const array = location.search.match((new RegExp('[\?\&]' + name + '=([^\&]+)', 'i')));
  if (array && array.length > 0) {
    value = array[1];
  }
  return value;
}

export function getUriParam(param, url) {
  const uri = url || location.href;
  const basePageUrl = (uri).replace(/[#\?].*/, '').replace(/[^\/]+$/, (part) => {
    return (/[^\/]$/).test(part) ? '' : part;
  }).replace(/\/+$/, '') + '/';

  const reg = new RegExp('(^|&?)' + param + '=([^&|#]*)(&|#|$)');
  const r = uri.replace(basePageUrl, '').substr(1).match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

// 防止页面session过期
let keepLoginInterval = null;
export function keepSession(timeout, times) {
  const t = times || 10;
  if (keepLoginInterval) {
    clearInterval(keepLoginInterval);
  }
  let keepLoginTimes = 0;
  const enterPageTime = moment().format('YYYY-MM-DD HH:mm:ss');
  if (timeout > 0) {
    setTimeout(() => {
      if (keepLoginInterval) {
        clearInterval(keepLoginInterval);
      }
    }, timeout);
  }

  keepLoginInterval = setInterval(() => {
    // 心跳调用不需要接入ajax统计
    ajax({
      url: (window.APP.ownUrl || '') + '/shop/alive.json',
      data: {
        enterTimestamp: enterPageTime,
      },
      success: (data) => {
        if (data && data.stat === 'deny') {
          clearInterval(keepLoginInterval);
        }
      },
    });
    keepLoginTimes += 1;
    if (t > 0 && keepLoginTimes >= t) {
      clearInterval(keepLoginInterval);
      keepLoginInterval = null;
    }
  }, 1000 * 60 * 3);
}

export const weekList = [
  {value: '7', label: '周日'},
  {value: '1', label: '周一'},
  {value: '2', label: '周二'},
  {value: '3', label: '周三'},
  {value: '4', label: '周四'},
  {value: '5', label: '周五'},
  {value: '6', label: '周六'},
];

export const weekMap = {};
weekList.forEach((row) => {
  weekMap[row.value] = row.label;
});

export const formatForbiddenVoucherTime = (timeString) => {
  const resultArray = [];
  if (timeString) {
    const timeArray = timeString.split('^');
    if (timeArray && timeArray.length > 0) {
      timeArray.forEach((item) => {
        const itemArray = item.split(',');
        if (itemArray && itemArray.length > 0) {
          resultArray.push(<p>{itemArray[0]}~{itemArray[1]}</p>);
        }
      });
    }
  }
  return resultArray;
};

export const formatAvailableVoucherTime = (availableVoucherTime) => {
  const resultArray = [];
  if (availableVoucherTime && availableVoucherTime.length > 0) {
    (availableVoucherTime || []).forEach((p) => {
      if (p.dimension && p.dimension === 'D') {
        const times = p.times.split(',');
        resultArray.push(<p>每月{p.values}号<span style={{marginLeft: '5px'}}></span>{times.join('-')}</p>);
      } else {
        const values = p.values.split(',');
        const times = p.times.split(',');
        const weekValues = values.map((val) => {
          return weekMap[val];
        });
        resultArray.push(<p>{weekValues.join(',')}<span style={{marginLeft: '5px'}}></span>{times.join('-')}</p>);
      }
    });
  }
  return resultArray;
};
export const isFromKbServ = () => {
  const kbInput = document.getElementById('J_isFromKbServ');
  return !!kbInput && kbInput.value === 'true';
};
export const getMerchantId = () => {
  const merchantIdInput = document.getElementById('J_crmhome_merchantId');
  return merchantIdInput ? merchantIdInput.value : '';
};

export const kbScrollToTop = () => {
  if (isFromKbServ() && window.parent) window.parent.scrollTo(0, 0);
};

export const repeat = (str, n) => {
  if (String.prototype.repeat) {
    return String.prototype.repeat.call(str, n);
  }
  let s = str;
  let res = '';
  let i = n;
  while (i > 0) {
    if (i % 2 === 1) {
      res += s;
    }
    if (i === 1) break;
    s += s;
    i = i >> 1;
  }
  return res;
};

export const padding = (source, index, str, totalLength) => {
  const output = Array.from(source);
  const deltaLen = totalLength - source.length;
  if (deltaLen <= 0 || source.length < index) return source;
  const n1 = Math.floor(deltaLen / str.length);
  let insert = repeat(str, n1);
  const n2 = deltaLen - insert.length;
  insert += str.substr(0, n2);
  output.splice(index, 0, ...Array.from(insert));
  return output.join('');
};

export const padEnd = (source, totalLength, str) => {
  if (String.prototype.padEnd) {
    return String.prototype.padEnd.call(source, totalLength, str);
  }
  return padding(source, source.length, str, totalLength);
};

export const padStart = (source, totalLength, str) => {
  if (String.prototype.padStart) {
    return String.prototype.padStart.call(source, totalLength, str);
  }
  return padding(source, 0, str, totalLength);
};

export const isIE = () => {
  return !!window.ActiveXObject || 'ActiveXObject' in window;
};

export const isIE9 = () => {
  return isIE && !window.AnimationEvent;
};

export const browserUpdateBar = (conditionFn) => {
  return (conditionFn() && window.parent === window ? <div className="low-version-browser-note">
    为获得更好的使用体验，建议使用chrome浏览器。
    <a href="http://www.google.cn/chrome/browser/" target="_blank">
      <img src="https://zos.alipayobjects.com/rmsportal/gltEtMMqlSZlDSt.png" />
    </a>
  </div> : null);
};

export const toggleListItem = (array, value) => {
  const res = Array.from(array);
  const idx = res.indexOf(value);
  if (idx >= 0) {
    res.splice(idx, 1);
  } else {
    res.unshift(value);
  }
  return res;
};

export const isArrayRepeated = (arr) => {
  const newArr = [];
  let repeated = false;
  for (let i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) >= 0) {
      repeated = true;
      break;
    } else {
      newArr.push(arr[i]);
    }
  }
  return repeated;
};

export function urlDecode() {
  const search = window.location.search.substr(1);
  return search.split('&').reduce((prev, curr) => {
    if (curr) {
      const arr = curr.split('=');
      prev[arr[0]] = decodeURIComponent(arr[1]);
    }
    return prev;
  }, {});
}

export function getStorage(key) {
  try {
    const now = Date.now();
    const storage = JSON.parse(localStorage.getItem(saveKey));
    const {value, expired, time} = storage[key];
    if (value && (!Number(expired) || Number(expired) + Number(time) > now)) {
      return value;
    }
    return storage;
  } catch (e) {
    return '';
  }
}

// expired 以ms计算
export function setStorage(key, value, expired = 0) {
  const info = getStorage() || {};
  info[key] = {value, expired, time: Date.now()};
  try {
    localStorage.setItem(saveKey, JSON.stringify(info));
  } catch (e) { return false; }
  return true;
}

export function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
}

export function convertServerNumber(val) {
  return ((typeof val === 'undefined') || val === '999999999' || val === 999999999) ? undefined : +val;
}

// 返回值：arg1乘以arg2的精确结果
export function accMul(arg1, arg2) {
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

export const fixFrameHeight = () => {
  setTimeout(() => window.parent.postMessage(JSON.stringify({ height: document.body.clientHeight, action: 'iframeHeight' }), '*'), 150);
};

export class Defer {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (reason) => { resolve.call(null, reason); this.status = 'resolved'; };
      this.reject = (err) => { reject.call(null, err); this.status = 'rejected'; };
      this.status = 'pending';
    });
  }
}
export function getParentNodeByClassName(dom, className) {
  let parentDom = dom.parentNode;
  while (parentDom.className.split(' ').indexOf(className) < 0) {
    parentDom = parentDom.parentNode;
  }
  return parentDom;
}

export function getImageById(id, size = 'origin') {
  return `https://oalipay-dl-django.alicdn.com/rest/1.0/image?fileIds=${id}&zoom=${size}`;
}

/**
 * 数字转中文
 *
 * @number { Integer } 形如123的数字
 * @return { String } 返回转换成的形如 一百二十三 的字符串
 */
/*eslint-disable */
export const numberToChinese = (number) => {
/*eslint-disable */
  /*
   * 单位
   */
  const units = '个十百千万@#%亿^&~';
  /*
   * 字符
   */
  const chars = '零一二三四五六七八九';
  const a = `${number}`.split('');
  const s = [];
  let j;
  let i;
  if (a.length > 12) {
    throw new Error('too big');
  } else {
    for (i = 0, j = a.length - 1; i <= j; i++) {
      if (j === 1 || j === 5 || j === 9) {// 两位数 处理特殊的 1*
        if (i === 0) {
          if (a[i] !== '1') {
            s.push(chars.charAt(a[i]));
          }
        } else {
          s.push(chars.charAt(a[i]));
        }
      } else {
        s.push(chars.charAt(a[i]));
      }
      if (i !== j) {
        s.push(units.charAt(j - i));
      }
    }
  }
  // return s;
  return s.join('').replace(/零([十百千万亿@#%^&~])/g, (m, d) => {// 优先处理 零百 零千 等
    const b = units.indexOf(d);
    if (b !== -1) {
      if (d === '亿') {
        return d;
      }
      if (d === '万') {
        return d;
      }

      if (a[j - b] === '0') {
        return '零';
      }
    }
    return '';
  }).replace(/零+/g, '零').replace(/零([万亿])/g, (m, b) => {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
    return b;
  }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, (m) => {
    return {
      '@': '十',
      '#': '百',
      '%': '千',
      '^': '十',
      '&': '百',
      '~': '千',
    }[m];
  }).replace(/([亿万])([一-九])/g, (m, d, b) => {
    const c = units.indexOf(d);
    if (c !== -1) {
      if (a[j - c] === '0') {
        return `${d}零${b}`;
      }
    }
    return m;
  });
};

export const rAF = window.cancelAnimationFrame && window.requestAnimationFrame || ((fn) => { return setTimeout(fn, 16); });
export const clearRAF = window.requestAnimationFrame && window.cancelAnimationFrame || clearTimeout;

// target 是否有一个 dom 的粑粑（包括自己）
export function hasParent(target, dom) {
  let cur = target;
  let rtn = cur === dom;
  while(cur !== dom && cur.parentNode && cur.parentNode.nodeType === 1) {
    cur = cur.parentNode;
    rtn = cur === dom;
  }
  return rtn;
}

// a -> b  b -> a
export function enumFactory(obj) {
  const fields = Object.keys(obj);
  const res = {};
  fields.forEach((field) => {
    res[res[field] = obj[field]] = field;
  });
  return res;
}

/**
 * 用来生成字符串变量，变量名等于字符串。
 * 1. 用来处理页面字符串变量很多时，方便使用 intelligense 语法提示，避免拼写错误
 *
 * @export
 * @param {any} obj
 * @returns
 */
export function keyMirror(obj) {
  const rtn = {};
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      rtn[i] = i;
    }
  }
  return rtn;
}
