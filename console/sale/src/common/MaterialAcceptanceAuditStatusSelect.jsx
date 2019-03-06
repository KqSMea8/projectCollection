import {Select} from 'antd';
import React from 'react';
const Option = Select.Option;

const MaterialAcceptanceAuditStatusSelect = React.createClass({
  getInitialState() {
    return {
      data: {
        'ALL': '全部',
        'MACHINE': '机器审核',
        'MANUAL': '人工审核',
        'MACHINE_MANUAL': '组合审核',
        'SYS_AUTO_PASS': '系统审核',
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

export default MaterialAcceptanceAuditStatusSelect;
