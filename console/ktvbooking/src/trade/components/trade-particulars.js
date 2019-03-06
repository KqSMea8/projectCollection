import React, { PureComponent } from 'react';
import { func, array, string, object } from 'prop-types';
import { Table } from 'antd';

import Block from '../../common/components/block';

import './trade-particulars.less';

export default class TradeParticulars extends PureComponent {
  static propTypes = {
    dispatch: func,
    shopId: string,
    startDate: string,
    endDate: string,
    pageInfo: object,
    expenseAndRefundInfos: array,
  }

  columns = [{
    title: '交易时间',
    dataIndex: 'tradeDate',
    width: '70px',
  }, {
    title: '交易金额',
    dataIndex: 'tradeMoney',
    width: '80px',
    render: (money) => {
      if (money.indexOf('-') === -1) {
        return <span style={{ color: 'red' }}>{money}</span>;
      }
      return <span style={{ color: 'green' }}>{money}</span>;
    },
  }, {
    title: '订单号',
    dataIndex: 'orderNumber',
  }, {
    title: '门店',
    dataIndex: 'shopName',
  }, {
    title: '手机号',
    width: '100px',
    dataIndex: 'mobileNumber',
  }, {
    title: '预订信息',
    dataIndex: 'reservationInfo',
  }, {
    title: '房号/备注',
    width: '80px',
    dataIndex: 'describe',
  }, {
    title: '交易方式',
    dataIndex: 'tradeManner',
  }];

  onTableChange = (pagination) => {
    const { dispatch, pageInfo } = this.props;
    const { current, pageSize } = pagination;
    dispatch({ type: 'queryExpenseAndRefundInfoDetail', payload: {
      pageInfo: {
        ...pageInfo,
        pageNo: current,
        pageSize,
      },
    } });
  }

  render() {
    const { pageInfo, expenseAndRefundInfos, shopId, startDate, endDate } = this.props;

    const subtitle = (
      <div className="subtitle">
        {expenseAndRefundInfos.length === 0 ?
          <a href=" javascript:;" style={{ color: 'gray', cursor: 'not-allowed' }}>导出订单明细到Excel</a> :
          <a href={`${window.APP.kbservindustryprodUrl}/home/reservedTradeDataDownload.resource?shopId=${shopId}&startDate=${startDate}&endDate=${endDate}`}>导出订单明细到Excel</a>}
      </div>
    );
    const { pageNo, pageSize, totalCount } = pageInfo;
    const pagination = {
      current: pageNo,
      pageSize,
      total: totalCount,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <Block className="particulars" title="详情" subtitle={subtitle}>
        <Table columns={this.columns} dataSource={expenseAndRefundInfos}
          pagination={pagination} onChange={this.onTableChange} />
      </Block>
    );
  }
}
