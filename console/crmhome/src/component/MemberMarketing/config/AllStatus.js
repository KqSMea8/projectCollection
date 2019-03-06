// 品牌商 活动类型
export const activityType = {
  'SINGLE_DISCOUNT': '单品折扣券',
  'SINGLE_CASH': '单品代金券',
  'REALTIME_DISCOUNT': '实时优惠-折扣券',
  'REALTIME_CASH': '实时优惠-代金券',
  // 新支付即会员类型
  'CONSUME_SEND': '消费送',
  'DIRECT_SEND': '优惠券',
  'GUESS_SEND': '口令送',
  'REAL_TIME_SEND': '买单优惠',
  'BUY_ONE_SEND_ONE': '买一送一',
  'RANDOM_REDUCE': '随机立减',
};

export const activityTypeList = [
  {key: 'SINGLE_DISCOUNT', value: '单品折扣券'},
  {key: 'SINGLE_CASH', value: '单品代金券'},
  {key: 'REALTIME_DISCOUNT', value: '实时优惠-折扣券'},
  {key: 'REALTIME_CASH', value: '实时优惠-代金券'},
  {key: 'CONSUME_SEND', value: '消费送'},
  {key: 'DIRECT_SEND', value: '优惠券'},
  {key: 'GUESS_SEND', value: '口令送'},
  {key: 'REAL_TIME_SEND', value: '买单优惠'},
  {key: 'BUY_ONE_SEND_ONE', value: '买一送一'},
];

export const activityStatusList = [
  {key: 'PLAN_GOING', value: '招商中'},
  {key: 'PLAN_ENDING', value: '招商结束'},
  {key: 'STARTED', value: '活动已生效'},
  {key: 'CLOSED', value: '活动已下架'},
  {key: 'DISABLED', value: '活动已废弃'},
];

// 品牌商 活动状态
export const activityStatus = {
  'NO_CONFIRM_YET': {
    text: '待确认',
    color: 'orange',
  },
  'NO_CONFIRM_EVER': {
    text: '无商家确认',
    color: 'orange',
  },
  'CONFIRM': {
    text: '已确认未开始',
    color: 'blue',
  },
  'PREPARE': {
    text: '已确认,系统准备中',
    color: 'blue',
  },
  'READY_TO_ONLINE': {
    text: '已上架未开始',
    color: 'blue',
  },
  'ONLINE': {
    text: '已上架已开始',
    color: 'blue',
  },
  'END': {
    text: '已结束',
    color: 'gray',
  },
  'OFFLINE': {
    text: '未开始已下架',
    color: 'gray',
  },
  'ONLINE_TO_OFFLINE': {
    text: '商品已下架',
    color: 'gray',
  },
};

// 零售商 视角看品牌商创建的 活动状态
export const merchantActivityStatus = {
  'NO_CONFIRM_YET': {
    text: '待确认',
    color: 'orange',
  },
  'NO_CONFIRM_EVER': {
    text: '无商家确认',
    color: 'orange',
  },
  'CONFIRM': {
    text: '已确认未开始',
    color: 'blue',
  },
  'PREPARE': {
    text: '已确认,系统准备中',
    color: 'blue',
  },
  'OVERDUE': {
    text: '已过期',
    color: 'gray',
  },
  'READY_TO_ONLINE': {
    text: '已上架未开始',
    color: 'blue',
  },
  'READY_TO_DEADLINE': {
    text: '已上架未开始',
    color: 'blue',
  },
  'ONLINE': {
    text: '已上架已开始',
    color: 'blue',
  },
  'END': {
    text: '已结束',
    color: 'gray',
  },
  'OFFLINE': {
    text: '已取消',
    color: 'gray',
  },
  'ONLINE_TO_OFFLINE': {
    text: '商品已下架',
    color: 'gray',
  },
  'CANCEL_PLAN': {
    text: '活动被取消',
    color: 'gray',
  },
  'STARTING': {
    text: '活动已生效',
    color: 'gray',
  },
};

// 零售商 活动方式
export const retailersActivityStatus = {
  'CAMP_GOING': {
    text: '已发布已开始',
    color: 'blue',
  },
  'CAMP_TIME_YET': {
    text: '已发布未开始',
    color: 'blue',
  },
  'CAMP_EXPIRED': {
    text: '已结束',
    color: 'gray',
  },
  'CAMP_PAUSED': {
    text: '已暂停',
    color: 'gray',
  },
  'CAMP_ENDED': {
    text: '已结束',
    color: 'gray',
  },
  'CAMP_AUDIT_FAIL': {
    text: '审核失败',
    color: 'gray',
  },
  'CAMP_AUDITING': {
    text: '审核中',
    color: 'orange',
  },
  'CAMP_CREATED': {
    text: '处理中',
    color: 'orange',
  },
  'CAMP_CONFIRM': {
    text: '待商家确认',
    color: 'orange',
  },
  'CAMP_REJECTED': {
    text: '已驳回',
    color: 'gray',
  },
  'CAMP_MODIFYING': {
    text: '修改中',
    color: 'orange',
  },
  'CAMP_CLOSING': {
    text: '下架中',
    color: 'orange',
  },
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
  'AUDIT': {
    text: '待商家确认',
    color: 'orange',
  },
};


export const retailersInviteStatus = {
  'INIT': {
    text: '未确认',
    color: 'orange',
  },
  'DOING': {
    text: '处理中',
    color: 'orange',
  },
  'SUCCESS': {
    text: '已确认',
    color: 'blue',
  },
  'FAIL': {
    text: '已拒绝',
    color: 'gray',
  },
  'AUDIT': {
    text: '待商家确认',
    color: 'orange',
  },
};


// 零售商 活动种类
export const retailersActivityType = {
  'MONEY': '代金券',
  'RATE': '折扣券',
  'REDUCETO': '换购券',
  'EXCHANGE': '兑换券',
};

export const voucherTypeEnum = {
  EXCHANGE: '兑换券',
  MONEY: '代金券',
  RATE: '折扣券',
  REDUCETO: '立减到券',
};

export const promoTypeEnum = {
  ALL_ITEM: '全场优惠',
  SINGLE_ITEM: '单品优惠',
};

export const retailersDeliveryChannels = {
  'PAYMENT_RESULT': {
    'label': '支付成功页',
    'img': 'https://zos.alipayobjects.com/rmsportal/WWKjEdpgkFwFxRo.png@w500',
  },
  'SHOP_DETAIL': {
    'label': '店铺详情页',
    'img': 'https://zos.alipayobjects.com/rmsportal/iYAngRiQMzedKHo.png',
  },
  'QR_CODE': {
    'label': '二维码投放',
    'img': '',
  },
  'SHORT_LINK': {
    'label': '短链接投放',
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
  'SEARCH_LIST': {
    'label': '搜索列表页',
    'img': '',
  },
  'EXTERNAL_MEDIA': {
    'label': '外部媒体',
    'img': '',
  },
};


// 第三方活动方式
export const retailersExternalActivityStatus = {
  'STARTING': {
    text: '活动生效处理中',
    color: 'blue',
  },
  'STARTED': {
    text: '活动已生效',
    color: 'blue',
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
    color: 'gray',
  },
  'DISABLED': {
    text: '活动已废弃',
    color: 'gray',
  },
};

export const retailersExternalDeliveryChannels = [
  {
    'label': '门店详情页',
    'img': 'https://zos.alipayobjects.com/rmsportal/YRVKIhxDquKqqcr.png@w500',
  },
  {
    'label': '购物中心首页',
    'img': 'https://zos.alipayobjects.com/rmsportal/QkWofmsBrDWfzMD.png@w500',
  },
];

// 券叠加类型

export const USE_MODE = {
  'NO_MULTI': '不可叠加',
  'MULTI_USE_WITH_SINGLE': '可与单品券叠加',
  'MULTI_USE_WITH_OTHERS': '可与任意券叠加',
};

