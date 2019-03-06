export function padding(v) {
  let value = v + '';
  if (value.length < 2) {
    value = '0' + value;
  }
  return value;
}

export function trimZero(value) {
  return parseInt(String(value).replace(/^0+/, ''), 10);
}

export function format(d) {
  return !!d ? d.getFullYear() + '-' + padding(d.getMonth() + 1) + '-' + padding(d.getDate()) : undefined;
}

export function formatTime(d) {
  return d && typeof d !== 'string' ? padding(d.getHours()) + ':' + padding(d.getMinutes()) + ':' + padding(d.getSeconds()) : d;
}

export function toDate(value) {
  const list = value.split('-');
  return new Date(trimZero(list[0]), trimZero(list[1]) - 1, trimZero(list[2]));
}

export function yyyyMMddToDate(string) {
  if (typeof string === 'string') {
    const segments = /^(\d{4})[\-年]?(\d{1,2})[\-月]?(\d{1,2})日?$/.exec(string.trim());
    if (segments) {
      return new Date(trimZero(segments[1]), trimZero(segments[2]) - 1, trimZero(segments[3]));
    }
  }
  return null;
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
export function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm') {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds(),
  };

  let str = fmt;
  if (/(y+)/.test(fmt)) {
    str = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(str)) {
      str = str.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return str;
}

/*
  设置rangePicker的可选时间晚于当前时间（当天可选）
*/
export function dateLaterThanToday(current) {
  // 时间必须晚于当前时间
  return current && current.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
}

/*
  服务端返回的字符串转化成date对象，兼容chrome和safari
*/
export function serverStringToDate(str) {
  let dateObj = null;

  const arr = str.split(' ');
  if (arr && arr.length) {
    const dateArr = arr[0].split('-');
    const timeArr = arr[1].split(':');
    if (dateArr && dateArr.length && timeArr && timeArr.length) {
      dateObj = new Date(Number.parseInt(dateArr[0], 10), Number.parseInt(dateArr[1], 10) - 1, Number.parseInt(dateArr[2], 10), Number.parseInt(timeArr[0], 10), Number.parseInt(timeArr[1], 10) );
    }
  }

  return dateObj;
}
