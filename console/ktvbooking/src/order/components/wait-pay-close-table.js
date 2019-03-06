import React, { PureComponent } from 'react';
import { object, array, func, bool } from 'prop-types';
import { Table } from 'antd';

import { orderStatus } from '../constants';

export default class WaitPayCloseTable extends PureComponent {
  static propTypes = {
    dispatch: func,
    onTableChange: func,
    loading: bool,
    list: array,
    page: object,
  }

  getColumns() {
    return [{
      title: '订单号',
      width: 124,
      dataIndex: 'orderId',
      key: 'orderId',
    }, {
      title: '门店',
      width: 84,
      dataIndex: 'shopName',
      key: 'shopName',
    }, {
      title: '手机号',
      width: 90,
      dataIndex: 'telphone',
      key: 'telphone',
    }, {
      title: '预订信息',
      width: 136,
      dataIndex: 'reservedInfo',
      key: 'reservedInfo',
    }, {
      title: '价格（元）',
      width: 80,
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '状态',
      width: 80,
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (text) => (orderStatus[text]),
    }];
  }

  render() {
    const { list, loading, page: { currentPage, pageSize, totalCount },
      onTableChange } = this.props;
    const pagination = {
      current: currentPage,
      pageSize,
      total: totalCount,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <Table loading={loading} columns={this.getColumns()}
        onChange={onTableChange}
        pagination={pagination}
        locale={{ emptyText: '没有相应订单' }}
        dataSource={list} />
    );
  }
}
