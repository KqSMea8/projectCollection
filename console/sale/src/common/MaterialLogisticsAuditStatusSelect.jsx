import {Select} from 'antd';
import React from 'react';
const Option = Select.Option;

const MaterialLogisticsAuditStatusSelect = React.createClass({
  getInitialState() {
    return {
      data: {
        'ALL': '全部',
        'RECEIVE_SUCCESS': '揽件成功',
        'DELIVER': '派送中',
        'RECEIVE_SIGN': '已签收',
      },
    };
  },

  componentDidMount() {
  },

  render() {
    const {data} = this.state;
    const options = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        options.push(<Option key={key}>{data[key]}</Option>);
      }
    }
    return (<Select {...this.props}>
      {options}
    </Select>);
  },
});

export default MaterialLogisticsAuditStatusSelect;
