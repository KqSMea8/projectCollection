const STORAGE_KEY = `crmhome_ktvbooking_${window.GLOBAL_NAV_DATA.userId}`;

/**
 * 泛行业KTV预订的本地存储 获取值，如果过期则进行删除并返回undefined
 * @param {string} key
 *
 * @returns value
 */
export function getStorage(key) {
  try {
    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const { value, expired, time } = storage[key];
    if (expired === 0 || time + expired > Date.now()) { // 没有过期
      return value;
    }
    delete storage[key]; // 过期的删除
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    return undefined;
  } catch (e) {
    return undefined;
  }
}

/**
 * 泛行业KTV预订的本地存储
 * @param {string} key
 * @param {*} value
 * @param {[number]} expired 过期ms值，expired为0则永不过期，设置为-1则删除
 *
 * @returns true: 保存成功， false: 保存失败
 */
export function setStorage(key, value, expired = 0) {
  const storage = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  if (expired === -1) {
    delete storage[key]; // 过期的删除
  } else {
    storage[key] = { value, expired, time: Date.now() };
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (e) {
    return false;
  }
  return true;
}
/**
 * getQueryStrVal('a=1&b=2', 'a') // 1
 * 从query字符串中获得key对应的值
 * @param {string} queryString
 * @param {string} key
 */
export function getQueryStrVal(queryString, key) {
  const matches = (queryString || '').match(new RegExp(`[?&]${key}=([^&]+)`, 'i'));
  if (matches) {
    return matches[1];
  }
  return null;
}
