export const typeList = [
  {key: 'RATE', value: '全场折扣', hash: 'goods/discount/'},
  {key: 'SINGLE_DISCOUNT', value: '单品折扣', hash: 'goods/singlediscount/'},
  {key: 'CASH', value: '单品代金券', hash: 'goods/singlevouchers/'},
  {key: 'EXCHANGE', value: '兑换券', hash: 'goods/exchangediscount/'},
  {key: 'CONTRACTED', value: '包销券', hash: 'goods/exclusivesalescoupon/'},
  {key: 'SUBSIDY', value: '补贴券', hash: 'goods/subsidycoupon/'},
  {key: 'PRE_PAID', value: '储值卡', hash: 'goods/storedvaluecarddetail/'},
  {key: 'CASH_ALL', value: '全场代金券', hash: 'goods/normalvouchersdetail/'},
];

export const typeMap = {};
export const type2HashMap = {};
typeList.forEach((row) => {
  typeMap[row.key] = row.value;
  type2HashMap[row.key] = row.hash;
});

export const statusList = [
  {key: 'INIT', value: '待生效', color: 'yellow'},
  {key: 'ONLINE', value: '已上架已开始', color: 'green'},
  {key: 'READY_TO_ONLINE', value: '已上架未开始', color: 'green'},
  {key: 'PAUSE', value: '暂停', color: ''},
  {key: 'INVALID', value: '已下架', color: ''},
];

export const statusMap = {};
export const statusColorMap = {};
statusList.forEach((row) => {
  statusMap[row.key] = row.value;
  statusColorMap[row.key] = row.color;
});

export const autoWipingZeroList = [
  {key: '0', value: '不自动抹零'},
  {key: '1', value: '自动抹零到元'},
  {key: '2', value: '自动抹零到角'},
  {key: '3', value: '四舍五入到元'},
  {key: '4', value: '四舍五入到角'},
];

export const autoWipingZeroMap = {};
autoWipingZeroList.forEach((row) => {
  autoWipingZeroMap[row.key] = row.value;
});

export const activedList = [
  {key: '0', value: '领取后即时生效'},
  {key: '30', value: '领取后30分钟生效'},
  {key: '60', value: '领取后1小时生效'},
  {key: '90', value: '领取后1.5小时生效'},
  {key: '120', value: '领取后2小时生效'},
];

export const activedMap = {};
activedList.forEach((row) => {
  activedMap[row.key] = row.value;
});

