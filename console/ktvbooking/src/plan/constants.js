/**
 * 时段
 * ['CURRENT_DAY-00:00', 'CURRENT_DAY-00:30', ..., 'NEXT_DAY-23:00', 'NEXT_DAY-23:30']
 */
export const TIMES = new Array(96).fill(null)
  .map((n, i) =>
    `${i < 48 ? 'CURRENT_DAY' : 'NEXT_DAY'}-${String(Math.floor((i % 48) / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);

/**
 * 预订时间模式
 */
export const TIME_MODELS = {
  PACKAGE_MODE: '包段',
  ENTRY_MODE: '进场',
};

/**
 * 时间类型,当日CURRENT_DAY、次日NEXT_DAY
 */
export const TIME_TYPES = {
  CURRENT_DAY: '', // 当日
  NEXT_DAY: '次日',
};

/**
 * 套餐类型
 */
export const PACKAGE_TYPES = {
  PURE_SING: '纯欢唱',
  PACKAGE: '含套餐',
  BUFFET: '含自助餐',
};

/**
 * 星期
 */
export const WEEKS = {
  MONDAY: '周一',
  TUESDAY: '周二',
  WEDNESDAY: '周三',
  THURSDAY: '周四',
  FRIDAY: '周五',
  SATURDAY: '周六',
  SUNDAY: '周日',
};

/**
 * 计价模式
 */
export const PRICE_MODELS = {
  YUAN_PER_ROOM: '元/间',
  YUAN_PER_PERSON: '元/人',
};


/**
 * RESERVATIONPLAN_EXIST("RESERVATIONPLAN_EXIST", "预订方案存在"),
 * RESERVATIONPLAN_ISNOT_EXIST("RESERVATIONPLAN_ISNOT_EXIST", "预订方案不存在"),
 */

/**
  * 用户类型
  * ("MERCHANT", "商户")
  * ("MERCHANT_STAFF", "商户操作员/商户主账号")
  * ("PROVIDER", "服务商")
  * ("PROVIDER_STAFF", "服务商员工")
  * ("INNER", "内部小二");
  */
