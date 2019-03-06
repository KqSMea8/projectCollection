import { enumFactory } from '../../../common/utils';

export default enumFactory({
  couponValue: '券面额',
  rate: '折扣',
  activityId: '活动 ID',
  perConsumeAmount: '每满减的每金额',
  perDiscountAmount: '每满减的减金额',
  maxDiscountAmount: '每满减的封顶金额',
  budgetAmount: '发放总量',
  startTime: '上架时间',
  endTime: '下架时间',
  useMode: '使用方式',
  actived: '领取生效',
  validTimeType: '有效期类型',
  validPeriod: '相对有效期',
  validTimeFrom: '绝对时间的起始时间',
  validTimeTo: '绝对时间的终止时间',
  dayAvailableNum: '每日发放总量',
  availableTimes: '券可用时间',
  availableTimeType: '券可用时间类型',
  forbiddenTime: '不可用日期',
  allowUseUserGroup: '领取人群限制',
  birthDateFrom: '生日开始时间',
  birthDateTo: '生日结束时间',
  receiveLimited: '领取限制',
  dayReceiveLimited: '每日领取限制',
  participateLimited: '参与限制',
  dayParticipateLimited: '每日参与限制',
  donateFlag: '是否允许转赠',
  brandName: '品牌名称',
  logoFileId: '券 logo',
  name: '备注',
  descList: '使用须知',
  deliveryChannels: '投放渠道',
  minimumAmount: '最低消费',
  payChannel: '支付渠道限制',
  renewMode: '自动续期',
  roundingMode: '抹零规则',
  shop: '适用门店',
  shopIds: '门店 ID',
  subject: '券名称',
  itemType: '券类型',
});