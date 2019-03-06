export function isNil(obj) {
  return obj === null || typeof obj === 'undefined';
}

export function isEmptyArray(arr) {
  return isNil(arr) || arr.length === 0;
}

/**
 * 简单校验 输入的是否是合法手机/座机
 */
export function validateTelWeak(input) {
  return /^(\d+(-\d+){2}|\d+(-\d+){1}|\d+)$/.test(input);
}
/**
 * 校验 输入的是否是合法手机/座机 (同门店的电话校验一致)
 * @param input 输入
 * @returns {boolean} 是否合法
 */
export function validateTel(input) {
  if (!/^(\d+(-\d+){2}|\d+(-\d+){1}|\d+)$/.test(input)) {
    return false;
  }
  const count = (input.match(/-/g) || []).length;
  if ((count === 0 && input.length === 11 && !/^[01]/.test(input)) || // 11位手机号
    (count === 0 && (input.length < 7 || input.length > 12)) ||
    (count === 1 && (input.length < 10 || input.length > 15)) ||
    (count === 2 && (input.length < 13 || input.length > 20))) {
    return false;
  }
  return true;
}

export function padStart(text, maxLength, fillString = ' ') {
  if (text.length >= maxLength) return text;

  const fillLen = maxLength - text.length;
  let repeatStr = '';
  while (repeatStr.length < fillLen) {
    repeatStr += (fillString || ' ');
  }
  return repeatStr.slice(0, fillLen) + text;
}

/**
 * 格式化日期规则
 * 本年：   月/日  08/25，并标注出今天、昨天
 * 非本年： 年/月/日  2015/08/25
 * @param {number} timestamp 毫秒时间戳
 * @return {string} 格式友好的日期展示，如：12/11 今日，12/10 昨日，2015/08/25
 */
export function formatDayFriendly(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));

  const showMonth = padStart(d.getMonth() + 1, 2, '0');
  const showDate = padStart(d.getDate(), 2, '0');
  if (now.getYear() !== d.getYear()) {
    return `${d.getFullYear()}/${showMonth}/${showDate}`;
  }
  if (d.getMonth() === now.getMonth() && d.getDate() === now.getDate()) {
    return `${showMonth}/${showDate} 今日`;
  }
  if (d.getMonth() === yesterday.getMonth() && d.getDate() === yesterday.getDate()) {
    return `${showMonth}/${showDate} 昨日`;
  }
  return `${showMonth}/${showDate}`;
}

// 以 YYYY-MM-DD 格式化日期
export function formatTimeEndDD(timestamp) {
  const d = new Date(timestamp);
  const month = padStart(d.getMonth() + 1, 2, '0');
  const date = padStart(d.getDate(), 2, '0');
  return `${d.getFullYear()}-${month}-${date}`;
}

// 以 YYYY-MM-DD HH:mm 格式化日期
export function formatTimeEndmm(timestamp) {
  const d = new Date(timestamp);
  const month = padStart(d.getMonth() + 1, 2, '0');
  const date = padStart(d.getDate(), 2, '0');
  const hour = padStart(d.getHours(), 2, '0');
  const minutes = padStart(d.getMinutes(), 2, '0');
  return `${d.getFullYear()}-${month}-${date} ${hour}:${minutes}`;
}

export function toAbsoluteUrl(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.href;
}
