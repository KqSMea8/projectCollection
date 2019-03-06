import { message } from 'antd';

const validate = values => {
  const { location, activityTime, activityLbs, activityScope, tradeAmountMin, tradeAmountMax,
    tradeCountMin, tradeCountMax, tradePerPriceMin, tradePerPriceMax, trade } = values;
  if (trade) {
    if (tradeAmountMin === undefined && tradeAmountMax !== undefined) {
      message.error('请填写消费金额最小值');
      return false;
    }
    if (tradeAmountMin !== undefined && tradeAmountMax === undefined) {
      message.error('请填写消费金额最大值');
      return false;
    }
    if (tradeCountMin === undefined && tradeCountMax !== undefined) {
      message.error('请填写消费频次最小值');
      return false;
    }
    if (tradeCountMin !== undefined && tradeCountMax === undefined) {
      message.error('请填写消费频次最大值');
      return false;
    }
    if (tradePerPriceMin === undefined && tradePerPriceMax !== undefined) {
      message.error('请填写消费客单价最小值');
      return false;
    }
    if (tradePerPriceMin !== undefined && tradePerPriceMax === undefined) {
      message.error('请填写消费客单价最大值');
      return false;
    }
    if (tradeAmountMin !== undefined && tradeAmountMax !== undefined &&
      tradeAmountMin > tradeAmountMax) {
      message.error('消费金额最小值不能大于最大值');
      return false;
    }
    if (tradeCountMin !== undefined && tradeCountMax !== undefined &&
      tradeCountMin > tradeCountMax) {
      message.error('消费频次最小值不能大于最大值');
      return false;
    }
    if (tradePerPriceMin !== undefined && tradePerPriceMax !== undefined &&
      tradePerPriceMin > tradePerPriceMax) {
      message.error('消费客单价最小值不能大于最大值');
      return false;
    }
  }
  if (location && !(activityTime && activityLbs && activityScope)) {
    message.error('请完善地理位置信息');
    return false;
  }
  return true;
};

export default validate;
