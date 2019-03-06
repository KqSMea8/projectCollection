import {Select} from 'antd';
import React from 'react';
const Option = Select.Option;

const MaterialAcceptanceCheckStatusSelect = React.createClass({
  getInitialState() {
    return {
      data: {
        'ALL': '全部',
        'ONLINE_CHECK': '待线上审核',
        'PASS': '审核通过',
        'NOT_PASS': '审核不通过',
        'CANCEL_CHECK': '撤销审核'
        // 'OFFLINE_CHECK': '待上门检查',
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

export default MaterialAcceptanceCheckStatusSelect;
