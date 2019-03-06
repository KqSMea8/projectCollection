import {Select} from 'antd';
import React from 'react';

const Option = Select.Option;

export const statusList = [
  {key: 'ALL', value: '全部状态'},
  {key: 'OPEN', value: '营业'},
  {key: 'FREEZE', value: '冻结'},
  {key: 'PAUSED', value: '签约失效'},
  {key: 'CLOSED', value: '已下架'},
];

export const statusColorList = [
  {key: 'OPEN', value: 'green'},
  {key: 'FREEZE', value: 'yellow'},
  {key: 'PAUSED', value: ''},
  {key: 'CLOSED', value: ''},
];

export const statusMap = {};
statusList.forEach((row) => {
  statusMap[row.key] = row.value;
});

export const statusColorMap = {};
statusColorList.forEach((row) => {
  statusColorMap[row.key] = row.value;
});

const ShopStatusSelect = React.createClass({
  render() {
    const options = statusList.map((row) => {
      return <Option key={row.key}>{row.value}</Option>;
    });
    return (<Select {...this.props}>
      {options}
    </Select>);
  },
});

export default ShopStatusSelect;
