import {Select} from 'antd';
import React from 'react';

const Option = Select.Option;

const KaSelectOptions = React.createClass({
  render() {
    return (<Select {...this.props}>
      <Option key="ALL">全部</Option>
      <Option key="TKA">TKA</Option>
      <Option key="RKA">RKA</Option>
    </Select>);
  },
});

export default KaSelectOptions;
