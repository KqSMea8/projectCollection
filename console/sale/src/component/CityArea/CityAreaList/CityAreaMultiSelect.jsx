import React from 'react';
import { Select } from 'antd';

export default class CityAreaMultiSelect extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    value: React.PropTypes.array,
    data: React.PropTypes.array,
    loading: React.PropTypes.bool,
  };
  state = {};
  onChange(ids) {
    if (this.props.onChange) this.props.onChange(ids);
  }
  render() {
    const { loading, data, value } = this.props;
    return (<Select
      style={{minWidth: 220, maxWidth: 400}}
      disabled={loading}
      multiple
      optionFilterProp="children"
      placeholder={loading ? '正在加载...' : ''}
      value={value}
      onChange={(values) => this.onChange(values)}
    >
      {data && data.map((item, index) => (
        <Select.Option key={index} value={item.territoryId}>{item.territoryName}</Select.Option>
      ))}
    </Select>);
  }
}
