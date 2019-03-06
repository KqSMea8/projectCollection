import {Select} from 'antd';
import React from 'react';
const Option = Select.Option;

const MaterialLogisticsapplySelect = React.createClass({
  getInitialState() {
    return {
      data: {
        'ALL': '全部',
        'NORMAL': '有效',
        'INVALID': '作废',
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

export default MaterialLogisticsapplySelect;
