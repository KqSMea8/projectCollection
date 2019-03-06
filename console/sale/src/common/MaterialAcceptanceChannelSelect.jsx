import {Select} from 'antd';
import React from 'react';
const Option = Select.Option;

const MaterialAcceptanceChannelSelect = React.createClass({
  getInitialState() {
    return {
      data: {
        'ALL': '全部',
        'PC': '销售中台',
        'MERCHANT_APP': '口碑掌柜app',
        'DINGDING': '集团钉钉客户端',
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

export default MaterialAcceptanceChannelSelect;
