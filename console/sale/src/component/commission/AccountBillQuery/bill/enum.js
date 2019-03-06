export const PayStatus = {
  NONE_PAY: '01',
  PARTIAL_PAY: '02',
  FULL_PAY: '03'
};
export const PayStatusText = {
  [PayStatus.NONE_PAY]: '待结算',
  [PayStatus.PARTIAL_PAY]: '部分结算',
  [PayStatus.FULL_PAY]: '结算完成',
};
