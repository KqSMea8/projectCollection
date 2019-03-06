// 品牌商 活动类型
export const activityType = {
  'BUY_ONE_SEND_ONE': '买一送一',
  'SINGLE_DISCOUNT': '单品折扣券',
  'SINGLE_CASH': '单品代金券',
  'REALTIME_DISCOUNT': '实时优惠-折扣券',
  'REALTIME_CASH': '实时优惠-代金券',
  // 新支付即会员类型
  'CONSUME_SEND': '消费送',
  'DIRECT_SEND': '优惠券',
  'GUESS_SEND': '口令送',
  'REAL_TIME_SEND': '买单优惠',
  'RANDOM_REDUCE': '随机立减',
};

// 新支付即会员活动状态
export const retailersActStatusNEW = {
  'STARTED': {
    text: '活动开始',
    color: 'blue',
  },
  'PREPARE': {
    text: '系统准备',
    color: 'orange',
  },
  'PLAN_GOING': {
    text: '招商中',
    color: 'orange',
  },
  'PLAN_ENDING': {
    text: '招商结束,等待活动开始',
    color: 'orange',
  },
  'MODIFYING': {
    text: '活动修改处理中',
    color: 'orange',
  },
  'CLOSED': {
    text: '活动已下架',
    color: 'gray',
  },
  'CLOSING': {
    text: '活动下架处理中',
    color: 'orange',
  },
  'DISABLED': {
    text: '活动已废弃',
    color: 'gray',
  },
  'AUDITING': {
    text: '待品牌商确认',
    color: 'orange',
  },
};

// 零售商 活动种类
export const retailersActivityType = {
  'MONEY': '代金券立减',
  'RATE': '折扣券',
  'REDUCETO': '代金券减至',
};

export const retailersDeliveryChannels = {
  'PAYMENT_RESULT': {
    'label': '支付成功页',
    'img': 'https://zos.alipayobjects.com/rmsportal/WWKjEdpgkFwFxRo.png@w500',
  },
  'SHOP_DETAIL': {
    'label': '店铺详情页',
    'img': '',
  },
  'QR_CODE': {
    'label': '二维码投放',
    'img': '',
  },
  'SHORT_LINK': {
    'label': '短连接投放',
    'img': '',
  },
  'SPECIAL_LIST': {
    'label': '专属优惠',
    'img': 'https://zos.alipayobjects.com/rmsportal/eJyarGFluZAMppL.png@w500',
  },
  'MERCHANT_CROWD': {
    'label': '口令送',
    'img': '',
  },
  'BIG_BRAND_BUY': {
    'label': '大牌快抢频道活动',
    'img': 'https://zos.alipayobjects.com/rmsportal/WWhsFMomlJmniNK.png',
  },
};
