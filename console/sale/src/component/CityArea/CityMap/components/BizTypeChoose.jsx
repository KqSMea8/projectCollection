import React from 'react';
import { Select } from 'antd';

const ShopTypeValuePre = 'ShopType-';
const CodeBizTypeValuePre = 'CodeBizType-';
const ShopTypeValues = {
  ShopLeads: ShopTypeValuePre + 'SHOP,LEADS',
  Shop: ShopTypeValuePre + 'SHOP',
  Leads: ShopTypeValuePre + 'LEADS',
};
const CodeBizTypeValues = {
  HasCode: CodeBizTypeValuePre + '1',
  Valid: CodeBizTypeValuePre + '2',
  NoCode: CodeBizTypeValuePre + '0',
};
const BizTypeKeyValueMap = {
  [ShopTypeValues.ShopLeads]: '总门店leads',
  [ShopTypeValues.Leads]: 'leads',
  [ShopTypeValues.Shop]: '已开门店',
  [CodeBizTypeValues.HasCode]: '已铺码门店',
  [CodeBizTypeValues.Valid]: '有效铺码门店',
  [CodeBizTypeValues.NoCode]: '未铺码门店',
};

export default class BizTypeChoose extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    defaultValue: React.PropTypes.string,
    disabled: React.PropTypes.bool,
  };

  static ShopTypeValues = ShopTypeValues;
  static CodeBizTypeValues = CodeBizTypeValues;
  static BizTypeKeyValueMap = BizTypeKeyValueMap;

  static parseShopTypeFromBizTypeValue(bizType) {
    if (bizType && bizType.indexOf(ShopTypeValuePre) === 0) {
      return bizType.substring(ShopTypeValuePre.length);
    }
    if (bizType && bizType.indexOf(CodeBizTypeValuePre) === 0) { // 码业务 shopType 是 门店
      return 'SHOP';
    }
  }

  static parseCodeBizTypeFromBizTypeValue(bizType) {
    if (bizType && bizType.indexOf(CodeBizTypeValuePre) === 0) {
      return bizType.substring(CodeBizTypeValuePre.length);
    }
  }

  render() {
    const { defaultValue, onChange, disabled } = this.props;
    const spanStyle = {padding: '0 10px'};
    return (<Select defaultValue={defaultValue} onChange={onChange} disabled={disabled} style={{width: 120}}>
      <Select.Option value="总业务" disabled>总业务</Select.Option>
      <Select.Option value={ShopTypeValues.ShopLeads}><span style={spanStyle}>总门店leads</span></Select.Option>
      <Select.Option value={ShopTypeValues.Leads}><span style={spanStyle}>leads</span></Select.Option>
      <Select.Option value={ShopTypeValues.Shop}><span style={spanStyle}>已开门店</span></Select.Option>
      <Select.Option value="码业务" disabled>码业务</Select.Option>
      <Select.Option value={CodeBizTypeValues.HasCode}><span style={spanStyle}>已铺码门店</span></Select.Option>
      <Select.Option value={CodeBizTypeValues.Valid}><span style={spanStyle}>有效铺码门店</span></Select.Option>
      <Select.Option value={CodeBizTypeValues.NoCode}><span style={spanStyle}>未铺码门店</span></Select.Option>
    </Select>);
  }
}
