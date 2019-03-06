import React, { PureComponent } from 'react';
import { array, func, bool } from 'prop-types';
import { Table, Modal } from 'antd';

const confirm = Modal.confirm;

export default class RefundTable extends PureComponent {
  static propTypes = {
    dispatch: func,
    loading: bool,
    list: array,
  }

  affirmRefund = () => {
    const { dispatch } = this.props;
    confirm({
      title: '确认退款',
      onOk() {
        return dispatch({ type: 'refundBookingOrder', payload: {} });
      },
      onCancel() {},
    });
  }

  columns = [{
    title: '订单号',
    dataIndex: 'orderId',
  }, {
    title: '门店',
    dataIndex: 'shopName',
  }, {
    title: '手机号',
    dataIndex: 'telphone',
  }, {
    title: '预订信息',
    dataIndex: 'reservedInfo',
  }, {
    title: '金额（元）',
    dataIndex: 'price',
  }, {
    title: '状态',
    dataIndex: 'orderStatus',
    render: (orderStatus) => {
      const status = {
        WAIT_CONFIRM: '待接单',
        WAIT_CONSUME: '未消费',
        CONSUMED: '已消费',
        WAIT_PAY_CLOSE: '已退订',
        REFUND: '已退款',
      };
      return status[orderStatus];
    },
  }, {
    title: '操作',
    render: (t, data) => {
      if (data.orderStatus === 'WAIT_CONSUME' || data.orderStatus === 'CONSUMED') {
        return <a href=" javascript:;" onClick={this.affirmRefund}>确认退款</a>;
      }
      return '';
    },
  }];

  render() {
    const { loading, list } = this.props;
    return (
      <Table columns={this.columns} loading={loading}
        dataSource={list} pagination={false} locale={{ emptyText: '未搜索到符合条件的订单' }} />
    );
  }
}
