export const MaterialPropertiesList = [
	{key: 'BASIC', value: '基础物料'},
	{key: 'ACTIVITY', value: '活动物料'},
	{key: 'ACTUAL', value: '实物物料'},
	{key: 'OTHER', value: '其它物料'},
];
export const MaterialPropertiesObj = {
  BASIC: '基础物料',
  ACTIVITY: '活动物料',
  ACTUAL: '实物物料',
  OTHER: '其它物料',
};

export const DepotType = [
	{key: 'CITY', value: '城市'},
	{key: 'KA', value: 'KA'},
	{key: 'YUNZONG', value: '云纵'},
];

export const MaterialPropertiesMap = {};
MaterialPropertiesList.forEach((row) => {
  MaterialPropertiesMap[row.key] = row.value;
});

export const applyRecordStatusList = [
  {key: '100', value: '待报价'},
  {key: '101', value: '已报价待审批'},
  {key: '102', value: '已驳回'},
  {key: '103', value: '结束入库'},
  {key: '200', value: '审批通过'},
  {key: '201', value: '采购入库中'},
  {key: '502', value: '申请中'},
  {key: '503', value: '审核中'},
  {key: '504', value: '发货中'},
  {key: '501', value: '发货完毕'},
  {key: '500', value: '已驳回'},
  {key: '800', value: '待审核'},
  {key: '801', value: '审核不通过'},
  {key: '802', value: '审核通过'},
  {key: '803', value: '采购发货中'},
  {key: '804', value: '发货完成'},
  {key: '805', value: '收货完成'},
];
export const ApplyRecordStatusMap = {};
applyRecordStatusList.forEach((row) => {
  ApplyRecordStatusMap[row.key] = row.value;
});
// 格式化金额
function outPutDollars(number) {
  if (number.length <= 3) {
    return (number === '' ? '0' : number);
  }
  if (number.length > 3) {
    const mod = number.length % 3;
    let output = (mod === 0 ? '' : (number.substring(0, mod)));
    for (let i = 0; i < Math.floor(number.length / 3); i++) {
      if ((mod === 0) && (i === 0)) {
        output += number.substring(mod + 3 * i, mod + 3 * i + 3);
      } else {
        output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
      }
    }
    return (output);
  }
}
function outPutCents(amount) {
  const newAmount = Math.round(((amount) - Math.floor(amount)) * 100);
  return (newAmount < 10 ? '.0' + newAmount : '.' + newAmount);
}
// 有小数位时 金额每隔三位用逗号隔开，且第一位不出现逗号。且精确到.00
export function cutStr(number) {
  let newNum = number.replace(/\,/g, '');
  if (isNaN(newNum) || newNum === '') return '';
  newNum = Math.round(newNum * 100) / 100;
  if (newNum < 0) {
    return '-' + outPutDollars(Math.floor(Math.abs(newNum) - 0) + '') + outPutCents(Math.abs(newNum) - 0);
  }
  if ( newNum >= 0 ) {
    return outPutDollars(Math.floor(newNum - 0) + '') + outPutCents(newNum - 0);
  }
}

// 无小数位时 数字每隔三位用逗号隔开，且第一位不出现逗号。
export function cutNum(str) {
  const newStr = new Array(str.length + parseInt(str.length / 3, 10));
  const strArray = str.split('');
  newStr[newStr.length - 1] = strArray[strArray.length - 1];
  let currentIndex = strArray.length - 1;
  for (let i = newStr.length - 1; i >= 0; i--) {
    if ((newStr.length - i ) % 4 === 0) {
      newStr[i] = ',';
    } else {
      newStr[i] = strArray[currentIndex--];
    }
    if (newStr.indexOf(',') === 0) {
      newStr.splice(0, 1);
    }
  }
  return newStr.join('');
}


