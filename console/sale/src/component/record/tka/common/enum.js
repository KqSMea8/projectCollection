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
