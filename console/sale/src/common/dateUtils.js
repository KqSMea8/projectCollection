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
  return !!d && typeof d !== 'string' ? (d.getFullYear() + '-' + padding(d.getMonth() + 1) + '-' + padding(d.getDate())) : d;
}

export function formatMonth(d) {
  return !!d && typeof d !== 'string' ? (d.getFullYear() + '-' + padding(d.getMonth() + 1)) : d;
}

export function formatYYYYMMDD(d) {
  return !!d && typeof d !== 'string' ? (d.getFullYear() + padding(d.getMonth() + 1) + padding(d.getDate())) : d;
}

export function formatTime(d) {
  return d && typeof d !== 'string' ? (padding(d.getHours()) + ':' + padding(d.getMinutes()) + ':' + padding(d.getSeconds())) : d;
}

export function formatTimeHm(d) {
  return d && typeof d !== 'string' ? (padding(d.getHours()) + ':' + padding(d.getMinutes())) : d;
}

export function toDate(value) {
  if (!value) {
    return undefined;
  }
  const list = value.split('-');
  return new Date(trimZero(list[0]), trimZero(list[1]) - 1, trimZero(list[2]));
}

export function transFormData(value = '') {
  const yer = value.substr(0, 4);
  const mou = value.substr(4, 2);
  const day = value.substr(6, 2);
  const date = yer + '-' + mou + '-' + day;
  return date;
}
// 截取月日格式07-18
export function transMMddData(value = '') {
  const mou = value.substr(4, 2);
  const day = value.substr(6, 2);
  const date = mou + '-' + day;
  return date;
}

export function transData(value) {
  const yer = value.substr(0, 4);
  const mou = value.substr(4, 2);
  const day = value.substr(6, 2);
  const date = yer + '/' + mou + '/' + day;
  return date;
}
export function number2DateTime(value, fmt = 'yyyy-MM-dd HH:mm:ss') {
  if (isNaN(value)) return '';
  const date = new Date(Number(value));
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return fmt.replace('yyyy', year.toString())
    .replace('yy', padding(year % 100))
    .replace('MM', padding(month))
    .replace('dd', padding(day))
    .replace('HH', padding(hour))
    .replace('mm', padding(minute))
    .replace('ss', padding(second));
}
