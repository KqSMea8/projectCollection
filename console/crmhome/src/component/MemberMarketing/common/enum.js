export const voucherType = {
  CASH_VOUCHER: '全场代金券',
  PER_FULL_CUT: '每满减券',
};

export const payChannelsEnum = {
  USE_NO_LIMIT: '不限制',
  USE_ON_CURRENT_PAY_CHANNEL: '优惠券仅限储值卡渠道可用',
  NOT_ALLOWED_USE: '优惠券的使用与储值卡互斥',
};
export const crowdRestrictionEnum = {
  STUDENT: '学生人群',
  MEMBER: '会员人群',
  NEWCOMER: '新人人群',
  BIRTHDAY: '生日人群',
  REALCERT: '实名制',
  GENDER: '性别特征人群',
  OFFLINE: '离线人群',
  CUSTOM: '自定义人群规则',
  MOBILE_BINDING: '手机绑定',
  QUICK_CARD_BINDING: '快捷绑卡',
  REAL_AUTH: '实名认证',
  NEW_MEMBER_PROMO: '新客人群',
  CONSTELLATION: '星座人群',
};
export const statusEnum = {
  ENABLING: '生效中',
  ONLINE_WAIT_CONFIRM: '上架待确认',
  ENABLED: '已发布',
  REJECTED: '已驳回',
  OFFLINE_WAIT_CONFIRM: '下架待确认',
  OFFLINE: '已下架',
  FINISHED: '已结束',
  UPGRADE_WAIT_CONFIRM: '升级待确认',
  PUBLISHED: '已发布未开始',
  CLOSED: '已下架',
  DISABLED: '已失效',
  CLOSING: '下架中',
  MODIFYING: '修改中',
  MODIFY_WAIT_CONFIRM: '修改待确认',
};

export const PublishChannelTypeEnum = {
  QR_CODE: '二维码投放',
  SHORT_LINK: '短连接投放',
  SHOP_DETAIL: '店铺页投放',
  PAYMENT_RESULT: '支付成功页',
  SPECIAL_LIST: '专享优惠列表',
  MERCHANT_CROWD: '口令送',
  URL_WITH_TOKEN: '带token的链接投放',
  BIG_BRAND_BUY: '大牌抢购',
  EXTERNAL: '不占用任何内部投放资源',
  ENTERPRISE_BENIFIT: '企业福利',
  ISV_ENTERPRISE_BENIFIT: 'ISV企业福利',
};

export const VoucherMultiUseTypeEnum = {
  NO_MULTI: '不可叠加',
  MULTI_USE_WITH_SINGLE: '可跟单品券叠加',
  MULTI_USE_WITH_OTHERS: '超级代金券，可跟一切其他券叠加',
};

export const PersonPeriodAvailableTypeText = {
  0: '每天',
  1: '每天',
  2: '每周',
  3: '每月',
};
