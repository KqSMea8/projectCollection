import React from 'react';
import { Select } from 'antd';
import BizTypeChoose from './BizTypeChoose';

export default class PointChoose extends React.Component {

  static propTypes = {
    onChange: React.PropTypes.func,
    value: React.PropTypes.array,
    disabled: React.PropTypes.bool,
  };

  static defaultProps = {
    value: [],
  };

  static getNamesFromValue(value) {
    if (!value) return '';
    const names = [];
    for (const item of value) {
      if (PointChoose.ValuesMap[item]) {
        names.push(PointChoose.ValuesMap[item]);
      }
    }
    return names.join('-');
  }

  static isDisabled(bizTypeValue) {
    return bizTypeValue === BizTypeChoose.ShopTypeValues.Leads || bizTypeValue === BizTypeChoose.ShopTypeValues.ShopLeads;
  }

  static parseRequestParamFromValue(value) { // eslint-disable-line
    const param = {};
    if (!value) return param;
    if (value.indexOf('tradeNumCode_Month1') !== -1) param.tradeNumCodeMonth = 1;
    if (value.indexOf('tradeNumCode_Month0') !== -1) param.tradeNumCodeMonth = 0;
    if (value.indexOf('tradeNumCode_Week1') !== -1) param.tradeNumCodeWeek = 1;
    if (value.indexOf('tradeNumCode_Week0') !== -1) param.tradeNumCodeWeek = 0;
    if (value.indexOf('tradeNumShop_Month1') !== -1) param.tradeNumShopMonth = 1;
    if (value.indexOf('tradeNumShop_Month0') !== -1) param.tradeNumShopMonth = 0;
    if (value.indexOf('tradeNumShop_Week1') !== -1) param.tradeNumShopWeek = 1;
    if (value.indexOf('tradeNumShop_Week0') !== -1) param.tradeNumShopWeek = 0;
    if (value.indexOf('tradeNumDiscount_Week1') !== -1) param.tradeNumDiscountWeek = 1;
    if (value.indexOf('tradeNumDiscount_Week0') !== -1) param.tradeNumDiscountWeek = 0;
    if (value.indexOf('tradeNumDiscount_Month1') !== -1) param.tradeNumDiscountMonth = 1;
    if (value.indexOf('tradeNumDiscount_Month0') !== -1) param.tradeNumDiscountMonth = 0;
    if (value.indexOf('orderSubscribe_1') !== -1) param.orderSubscribe = 1;
    if (value.indexOf('orderSubscribe_0') !== -1) param.orderSubscribe = 0;
    if (value.indexOf('secondPaySubscribe_1') !== -1) param.secondPaySubscribe = 1;
    if (value.indexOf('secondPaySubscribe_0') !== -1) param.secondPaySubscribe = 0;
    return param;
  }

  static ValuesKey = {
    tradeNumCode_Month1: 'tradeNumCode_Month1',
    tradeNumCode_Month0: 'tradeNumCode_Month0',
    tradeNumCode_Week1: 'tradeNumCode_Week1',
    tradeNumCode_Week0: 'tradeNumCode_Week0',
    tradeNumShop_Month1: 'tradeNumShop_Month1',
    tradeNumShop_Month0: 'tradeNumShop_Month0',
    tradeNumShop_Week1: 'tradeNumShop_Week1',
    tradeNumShop_Week0: 'tradeNumShop_Week0',
    tradeNumDiscount_Month1: 'tradeNumDiscount_Month1',
    tradeNumDiscount_Month0: 'tradeNumDiscount_Month0',
    tradeNumDiscount_Week1: 'tradeNumDiscount_Week1',
    tradeNumDiscount_Week0: 'tradeNumDiscount_Week0',
    orderSubscribe_1: 'orderSubscribe_1',
    orderSubscribe_0: 'orderSubscribe_0',
    secondPaySubscribe_1: 'secondPaySubscribe_1',
    secondPaySubscribe_0: 'secondPaySubscribe_0',
  };

  static ValuesMap = {
    // key 格式说明： group_value 同 group 只能选中一个，Month & Week 互斥
    tradeNumCode_Month1: '近30天码上有交易门店',
    tradeNumCode_Month0: '近30天码上无交易门店',
    tradeNumCode_Week1: '近7天码上有交易门店',
    tradeNumCode_Week0: '近7天码上无交易门店',
    tradeNumShop_Month1: '近30天门店有交易',
    tradeNumShop_Month0: '近30天门店无交易',
    tradeNumShop_Week1: '近7天门店有交易',
    tradeNumShop_Week0: '近7天门店无交易',
    tradeNumDiscount_Month1: '近30天有商家出资优惠门店',
    tradeNumDiscount_Month0: '近30天无商家出资优惠门店',
    tradeNumDiscount_Week1: '近7天有商家出资优惠门店',
    tradeNumDiscount_Week0: '近7天无商家出资优惠门店',
    orderSubscribe_1: '已订购点餐门店',
    orderSubscribe_0: '未订购点餐门店',
    secondPaySubscribe_1: '已订购秒付门店',
    secondPaySubscribe_0: '未订购秒付门店',
  };

  isDisable(optionValue) {
    const group = optionValue.split('_')[0];
    const isMonth = optionValue.indexOf('Month') !== -1;
    const isWeek = optionValue.indexOf('Week') !== -1;
    for (const item of this.props.value) {
      if (item === optionValue) return false;
      if (item.indexOf('Month') !== -1 && isWeek) return true;
      if (item.indexOf('Week') !== -1 && isMonth) return true;
      if (item.split('_')[0] === group) return true;
    }
  }

  render() {
    const { value, onChange, disabled } = this.props;

    return (<Select value={value} onChange={onChange} multiple style={{width: '360px', flex: '1'}}
      disabled={disabled} optionFilterProp="children">
      {
        Object.keys(PointChoose.ValuesMap).map((key) =>
          <Select.Option key={key} value={key} disabled={this.isDisable(key)}>{PointChoose.ValuesMap[key]}</Select.Option>
        )
      }
    </Select>);
  }
}
