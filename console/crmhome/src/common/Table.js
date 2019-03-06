import { Table } from 'antd';
import React from 'react';

const MyTable = React.createClass({
  propTypes: {
    firstShow: React.PropTypes.bool,
  },

  render() {
    return (<Table locale={{emptyText: this.props.firstShow ? '暂无数据，请输入查询条件搜索' : '搜不到结果，换下其他搜索条件吧~'}}
      {...this.props}/>);
  },
});

export default MyTable;
