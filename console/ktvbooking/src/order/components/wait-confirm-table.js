import React, { PureComponent } from 'react';
import { object, array, func, bool } from 'prop-types';
import { Table, Modal } from 'antd';
import moment from 'moment';

import { orderStatus } from '../constants';

const confirm = Modal.confirm;

export default class WaitConfirmTable extends PureComponent {
  static propTypes = {
    dispatch: func,
    refresh: func,
    onTableChange: func,
    loading: bool,
    list: array,
    page: object,
  }

  timer = null; // 定时器

  state = {
    mills: 0, // 毫秒秒计数器
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
        this.setState({ mills: 0 });
      }
      const nextList = nextProps.list;
      nextList.forEach(order => {
        const { orderStatus: oStatus, currentTime, expiryTime } = order;
        if (oStatus === 'WAIT_CONFIRM' && currentTime && expiryTime) { // 设置时间段=expiryTime-currentTime
          const duration = moment(expiryTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(currentTime, 'YYYY-MM-DD HH:mm:ss'));
          Object.assign(order, { duration });
        }
      });
      if (nextList && nextList.length > 0) {
        this.timer = window.setInterval(() => {
          this.setState(({ mills }) => {
            const nextMills = mills + 1000;
            if (nextList.some(order => order.duration
              && order.duration - nextMills < 0) // 存在到期的则重新刷新
              && nextProps.refresh) {
              window.clearInterval(this.timer);
              nextProps.refresh();
            }
            return { mills: nextMills };
          });
        }, 1000);
      }
    }
  }

  getColumns() {
    const { mills } = this.state;
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
      render: (text, record) => {
        if (text === 'WAIT_CONFIRM' && record.duration) {
          const diff = record.duration - mills;
          let timeStr = '';
          if (diff > 0) {
            const duration = moment.duration(diff);
            timeStr = `${String(duration.hours()).padStart(2, 0)}:${String(duration.minutes()).padStart(2, 0)}:${String(duration.seconds()).padStart(2, 0)}`;
          }
          return (
            <div>
              <span>{orderStatus[text]}</span>
              {timeStr && <div style={{ color: '#CC0000' }}>{timeStr}<span style={{ marginLeft: 5 }}>后过期</span></div>}
            </div>
          );
        }
        return null;
      },
    }, {
      title: '操作',
      width: 60,
      key: 'operation',
      render: (text, record) => (
        <div>
          <a onClick={this.showConfirm(record.orderId)}>确认接单</a>
          <span className="ant-divider" />
          <a onClick={this.showReject(record.orderId)}>拒绝</a>
        </div>
      ),
    }];
  }

  showConfirm = (orderId) => () => {
    const { dispatch, refresh } = this.props;
    confirm({
      title: '确认接单',
      onOk() {
        dispatch({ type: 'confirmOrder', payload: { orderId } }).then(() => {
          refresh();
        });
      },
    });
  }

  showReject = (orderId) => () => {
    const { dispatch, refresh } = this.props;
    confirm({
      title: '拒绝一次后，该房源变为满房状态',
      onOk() {
        dispatch({ type: 'rejectOrder', payload: { orderId } }).then(() => {
          refresh();
        });
      },
    });
  }

  render() {
    const { list, loading, onTableChange, page: {
      currentPage, pageSize, totalCount } } = this.props;
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
