export const VISIT_PURPOSE_TKA_MAP = {
  NEED_INTENT_TALK: '需求&意向沟通',
  SIGN_PLAN_TALK: '签约计划沟通',
  ACTIVITY_REPLAY: '活动复盘',
  OTHER_TKA: '其他',
};

export const VISIT_PURPOSE_ALL_MAP = {
  ...VISIT_PURPOSE_TKA_MAP,
  // 下面是老的拜访小记的目的枚举
  SIGN_CONTRACT: '签约',
  LAYING_MATERIAL: '物料铺设',
  IMPLEMENT_MAINTENANCE: '机具维护',
  SOLVE_PRODUCT_PROBLEM: '产品问题解决',
  EVENT_NEGOTIATION: '活动洽谈',
  BUSINESS_TALK: '商务洽谈',
  SHOP_VISIT: '巡店',
  TRAINING: '驻店培训',
  SHOP_NO_SALE: '门店无动销',
  SHOP_COMPETE_DISCOUNT: '真心十亿--目标优惠门店',
  OTHER: '其他',
};

export const VISIT_PURPOSE_TKA_VALUE = {
  NEED_INTENT_TALK: 'NEED_INTENT_TALK',
  SIGN_PLAN_TALK: 'SIGN_PLAN_TALK',
  ACTIVITY_REPLAY: 'ACTIVITY_REPLAY',
  OTHER_TKA: 'OTHER_TKA',
};

// 数字化分组类型
export const DigitalGroupingType = {
  OVERALLPLAN: 'OVERALLPLAN',
  CHANNEL: 'CHANNEL',
  GOODS: 'GOODS',
  VOUCHERS: 'VOUCHERS',
  SERVICE: 'SERVICE',
};
// 数字化分组名称
export const DigitalGroupingText = {
  [DigitalGroupingType.OVERALLPLAN]: '整体方案',
  [DigitalGroupingType.CHANNEL]: '渠道',
  [DigitalGroupingType.GOODS]: '商品',
  [DigitalGroupingType.VOUCHERS]: '券',
  [DigitalGroupingType.SERVICE]: '服务',
};
// 整体方案条目类型
const OverAllPlanEntryType = {
  planKbCode: 'planKbCode',
  planMachine: 'planMachine',
};
// 整体方案条目
const OverAllPlanEntryText = {
  [OverAllPlanEntryType.planKbCode]: '口碑码+插件',
  [OverAllPlanEntryType.planMachine]: '全渠道+一体机',
};
// 渠道条目类型
const ChannelEntryType = {
  channelSingle: 'channelSingle',
  channelTmall: 'channelTmall',
  channelHungry: 'channelHungry',
  channelCake: 'channelCake',
  channelBrand: 'channelBrand',
};
// 渠道条目
const ChannelEntryText = {
  [ChannelEntryType.channelSingle]: '单品打通',
  [ChannelEntryType.channelTmall]: '天猫店',
  [ChannelEntryType.channelHungry]: '饿了么',
  [ChannelEntryType.channelCake]: '自有外卖',
  [ChannelEntryType.channelBrand]: '品牌号',
};
// 商品条目类型
const GoodsEntryType = {
  goodsCrush: 'goodsCrush',
  goodsDaily: 'goodsDaily',
  goodsMeal: 'goodsMeal',
  goodsRetail: 'goodsRetail',
  goodsProduct: 'goodsProduct',
};
// 商品条目
const GoodsEntryText = {
  [GoodsEntryType.goodsCrush]: '秒杀商品',
  [GoodsEntryType.goodsDaily]: '日常商品',
  [GoodsEntryType.goodsMeal]: '套餐商品',
  [GoodsEntryType.goodsRetail]: '零售商品',
  [GoodsEntryType.goodsProduct]: '标价/半成品',
};
// 券条目类型
const VoucherEntryType = {
  voucherDiscount: 'voucherDiscount',
  voucherSingle: 'voucherSingle',
  voucherFullLost: 'voucherFullLost',
  voucherSecond: 'voucherSecond',
  voucherNewMan: 'voucherNewMan',
};
// 券条目
const VoucherEntryText = {
  [VoucherEntryType.voucherDiscount]: '折扣券',
  [VoucherEntryType.voucherSingle]: '单品券',
  [VoucherEntryType.voucherFullLost]: '满减券',
  [VoucherEntryType.voucherSecond]: '二次券',
  [VoucherEntryType.voucherNewMan]: '新人券',
};
// 服务条目类型
const ServiceEntryType = {
  serveSecPay: 'serveSecPay',
  serveOrder: 'serveOrder',
  serveCard: 'serveCard',
  serveBook: 'serveBook',
  serveLine: 'serveLine',
};
// 服务条目
const ServiceEntryText = {
  [ServiceEntryType.serveSecPay]: '秒付',
  [ServiceEntryType.serveOrder]: '点单',
  [ServiceEntryType.serveCard]: '会员卡',
  [ServiceEntryType.serveBook]: '预订',
  [ServiceEntryType.serveLine]: '排队',
};
export const DigitalFeedbackAllText = {
  ...OverAllPlanEntryText, // 整体方案条目
  ...ChannelEntryText, // 渠道条目
  ...GoodsEntryText, // 商品条目
  ...VoucherEntryText, // 券条目
  ...ServiceEntryText, // 服务条目
};

export const DigitalFeedbackTypeGrouped = {
  [DigitalGroupingType.OVERALLPLAN]: OverAllPlanEntryType, // 整体方案条目
  [DigitalGroupingType.CHANNEL]: ChannelEntryType, // 渠道条目
  [DigitalGroupingType.GOODS]: GoodsEntryType, // 商品条目
  [DigitalGroupingType.VOUCHERS]: VoucherEntryType, // 券条目
  [DigitalGroupingType.SERVICE]: ServiceEntryType, // 服务条目
};

// 状态
const DigitalFeedbackStatusType = {
  ACTIONING: 'ACTIONING',
  PLANING: 'PLANING',
  FINISHED: 'FINISHED',
  STOPPING: 'STOPPING',
  COMPETING: 'COMPETING',
  NOTHING: 'NOTHING',
};
export const DigitalFeedbackStatusText = {
  [DigitalFeedbackStatusType.ACTIONING]: '实施中',
  [DigitalFeedbackStatusType.PLANING]: '方案中',
  [DigitalFeedbackStatusType.FINISHED]: '已完成',
  [DigitalFeedbackStatusType.STOPPING]: '停滞中',
  [DigitalFeedbackStatusType.COMPETING]: '竞对中',
  [DigitalFeedbackStatusType.NOTHING]: '无',
};
