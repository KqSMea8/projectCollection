// 添加人群 参数转换
export const itemKeyMap = {
  memberType: 'member_type',
  gender: 'gender',
  age: 'age',
  birthdayMonth: 'birthday_mm',
  constellation: 'constellation',
  haveBaby: 'have_baby',
  occupation: 'occupation',
  consumeLevel: 'consume_level',
  firstLinkDate: 'first_link_date',
  cate: 'cate1',
  residentPlace: 'city_code',
  nativePlace: 'hometown_code',
  tradeCycle: 'trade_cycle',
  tradeAmount: 'trade_amt',
  tradeCount: 'trade_cnt',
  tradePerPrice: 'consume_pct_amt',
  activityTime: 'activity_time',
  activityLbs: 'code',
  activityScope: 'dist',
  memberGrade: 'member_grade',
  applyVoucher: 'apply_voucher_cnt',
  verifyVoucher: 'verify_voucher_cnt',
  userIdVoucher: 'brand_pid',
};

// 查看人群 参数转换
export const itemKeyMap2 = {
  birthday_mm: 'birthdayMonth',
  constellation: 'constellation',
  have_baby: 'haveBaby',
  consume_level: 'consumeLevel',
  first_link_date: 'firstLinkDate',
  cate1: 'cate',
  city_code: 'residentPlace',
  hometown_code: 'nativePlace',
  trade_cycle: 'tradeCycle',
  trade_amt: 'tradeAmount',
  trade_cnt: 'tradeCount',
  consume_pct_amt: 'tradePerPrice',
  range_shop_activity_time: 'activityTime',
  range_shop_code: 'activityLbs',
  range_shop_dist: 'activityScope',
  range_city_activity_time: 'activityTime',
  range_city_code: 'activityLbs',
  range_city_dist: 'activityScope',
  member_grade: 'memberGrade',
  apply_voucher_cnt: 'applyVoucher',
  verify_voucher_cnt: 'verifyVoucher',
};

// 操作参数转换
export const itemOpMap = {
  memberType: 'IN',
  gender: 'EQ',
  age: 'IN',
  birthdayMonth: 'IN',
  constellation: 'IN',
  haveBaby: 'EQ',
  occupation: 'IN',
  consumeLevel: 'EQ',
  firstLinkDate: 'LT',
  cate: 'IN',
  residentPlace: 'IN',
  nativePlace: 'IN',
  tradeCycle: 'EQ',
  tradeAmount: 'BETWEEN',
  tradeCount: 'BETWEEN',
  tradePerPrice: 'BETWEEN',
  activityTime: 'IN',
  activityLbs: 'IN',
  activityScope: 'LT',
  memberGrade: 'IN',
  applyVoucher: 'GT',
  verifyVoucher: 'GT',
};

export const ageRangeMap = {
  13: [0],
  18: [1],
  20: [2],
  25: [3],
  30: [4],
  35: [5],
  40: [6],
  50: [7, 8],
  60: [9, 10],
  65: [11],
};

export const ageRangeMap2 = {
  1: [1, 17],
  2: [18, 20],
  3: [21, 25],
  4: [26, 30],
  5: [31, 35],
  6: [36, 40],
  7: [41, 45],
  8: [46, 50],
  9: [51, 55],
  10: [56, 60],
  11: [60, 100],
};

export const activityTimeMap = {
  白天: 'day',
  晚上: 'night',
  工作日: 'workday',
  休息日: 'restday',
};

export const activityTimeMap2 = {
  day: '白天',
  night: '晚上',
  workday: '工作日',
  restday: '休息日',
};

export const itemLabelMap = {
  gender: '性别',
  age: '年龄',
  birthdayMonth: '生日',
  constellation: '星座',
  haveBaby: '是否有小孩',
  occupation: '职业',
  consumeLevel: '年消费能力',
  firstLinkDate: '首次关联日期',
  residentPlace: '常住地',
  nativePlace: '籍贯',
  tradeCycle: '消费时段',
  tradeAmount: '消费金额',
  tradeCount: '消费频次',
  tradePerPrice: '消费客单价',
  activityTime: '出现时段',
  activityLbs: '适用门店',
  activityScope: '活动范围',
  applyVoucher: '人群行为',
};

export const mbmberTypeMap = {
  member_pay: '支付会员',
  member_card: '会员卡会员',
  member_fwc: '服务窗粉丝',
};
