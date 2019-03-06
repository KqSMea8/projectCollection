import {Select} from 'antd';
import React from 'react';

const Option = Select.Option;

export const tagList = [
  {key: 'ALL', value: '全部'},
  {key: 'isNoTrade', value: '交易清零标'},
  {key: 'isNoItem', value: '折扣消无标'},
];

export const tagMap = {};
tagList.forEach((row) => {
  tagMap[row.key] = row.value;
});

const ShopTagSelect = React.createClass({
  render() {
    const options = tagList.map((row) => {
      return <Option key={row.key}>{row.value}</Option>;
    });
    return (<Select {...this.props}>
      {options}
    </Select>);
  },
});

export default ShopTagSelect;
