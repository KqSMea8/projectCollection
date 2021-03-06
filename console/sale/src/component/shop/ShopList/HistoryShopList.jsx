import React from 'react';
import ajax from 'Utility/ajax';
import { Table } from 'antd';
import {format} from '../../../common/dateUtils';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import {openProgressStatusMap} from '../common/ShopConfig';
import AgainCreateShop from './AgainCreateShop';


const HistoryShopList = React.createClass({

  getInitialState() {
    const columns = [
      {
        title: '门店名称',
        dataIndex: 'shopName',
        width: 100,
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        width: 110,
        render(text) {
          return text ? format(new Date(text)) : '';
        },
      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        width: 150,
      },
      {
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 230,
        render(text, record) {
          const address = [record.provinceName, record.cityName, record.districtName].filter(r => r).join('-') + ' ' + text;
          return (
            <div>
              <div>{address}</div>
              <div>{record.mobile ? 'Tel：' + record.mobile : ''}</div>
            </div>
          );
        },
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        width: 130,
      },
      {
        title: '审核状态',
        dataIndex: 'openProgressCode',
        width: 100,
        render(text) {
          return openProgressStatusMap[text] || text;
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 100,
        render: (text, record) => {
          let result = false;
          if ( /RISK_REJECT/.test(record.openProgressCode) || /MERCHANT_REJECT/.test(record.openProgressCode) || /FAILED/.test(record.openProgressCode) || /RISK_CANCEL/.test(record.openProgressCode) ) {
            result = true;
          }
          return (
            <span>
              <a href={window.APP.liteUrl + '#/approval-flow/' + record.orderId + '/HISTORY_SHOP' + '/shop-create'} target="_blank">查看</a>
              {result === true ? <span className="ant-divider"></span> : ''}
              {result === true ? <AgainCreateShop id={record.orderId} /> : ''}
            </span>
          );
        },
      },
    ];
    return {
      columns,
      data: [],
      loading: true,
      selectedIds: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
    };
  },

  componentWillMount() {
    this.refresh();
  },
  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    this.fetch(params);
  },
  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/historyShops.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalItems;
        this.setState({
          loading: false,
          data: result.data.data || [],
          pagination,
        });
      },
    });
  },

  rowKey(record) {
    return record.orderId;
  },

  render() {
    const {loading, data, pagination, columns} = this.state;
    if (!permission('SHOP_HISTORY_SHOP_LIST')) {
      return <ErrorPage type="permission"/>;
    }
    return (
      <div>
        <Table columns={columns}
          rowKey={this.rowKey}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          bordered
          onChange={this.onTableChange} />
      </div>
    );
  },
});

export default HistoryShopList;
