import React from 'react';
import { Select } from 'antd';

export default class CategoryType extends React.Component {
  static propTypes = {
    disabled: React.PropTypes.bool,
    defaultValue: React.PropTypes.string,
    onChange: React.PropTypes.func,
    style: React.PropTypes.any,
  };

  static getCategoryTypeName(value) {
    if (!value) return '全行业';
    return CategoryType.Values[value];
  }

  static Values = {
    CATERING: '餐饮行业',
    FMCG: '快消行业',
    PANINDUSTRY: '泛行业',
  };

  render() {
    const { defaultValue, onChange, disabled, style } = this.props;
    return (<Select defaultValue={defaultValue} onChange={onChange} disabled={disabled} style={style} placeholder="请选择">
      <Select.Option value="">全行业</Select.Option>
      <Select.Option value="CATERING">餐饮行业</Select.Option>
      <Select.Option value="FMCG">快消行业</Select.Option>
      <Select.Option value="PANINDUSTRY">泛行业</Select.Option>
    </Select>);
  }
}
