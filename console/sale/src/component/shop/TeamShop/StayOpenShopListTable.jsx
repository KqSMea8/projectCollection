import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import Table from '../../../common/Table';
import {format} from '../../../common/dateUtils';
import {logGoodsShopTypeMap, logGoodsShopTypeList} from '../../../common/OperationLogMap';


const openProgressStatusMap = {
  IN_PROGRESS: '开店处理中',
  FAILED: '开店失败',
};

const StayOpenShopListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const columns = [
      {
        title: '门店名称',
        dataIndex: 'shopName',
        width: 90,
      },
      {
        title: '类型',
        dataIndex: 'shopType',
        width: 80,
        render(text) {
          return logGoodsShopTypeMap[text] || text;
        },
        filters: logGoodsShopTypeList,
      },
      {
        title: '创建人/创建时间',
        dataIndex: '',
        width: 90,
        render(text, record) {
          return (<div>
            <div> {record.creatorName} </div>
            <div> {format(new Date(record.createTime)) }</div>
          </div>);
        },
      },
      {
        title: '商户名称/商户PID',
        dataIndex: '',
        width: 120,
        render(text, record) {
          return (<div>
            <div> {record.merchantName} </div>
            <div> {record.merchantPid} </div>
          </div>);
        },
      },
      {
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 100,
        render(text, record) {
          const address = [record.provinceName, record.cityName, record.districtName].filter(r => r).join('-') + ' ' + text;
          const list = [address];
          list.push('Tel：' + record.mobile);
          return list;
        },
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        width: 90,
      },
      {
        title: '开店进度',
        dataIndex: 'openProgressCode',
        width: 80,
        render(text) {
          return openProgressStatusMap[text] || text;
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 100,
        render: (text, record) => {
          let isMall = '';
          if (record.shopType === 'MALL') {
            isMall = record.shopType;
          }
          return (<span>
            {isMall !== 'MALL' && <a href={'#/shop/diary/' + record.orderId + '/CREATE_SHOP'} target="_blank">查看</a>}
            {isMall === 'MALL' && <a href={'#/approval-flow/complex/' + record.orderId + '/CREATE_SHOP'} target="_blank">查看</a>}
          </span>);
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

  componentDidMount() {
    this.refresh();
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onTableChange(pagination, filters = {}) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      shopType: filters.shopType,
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
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/toBeOpenedTeamShops.json',
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
    return record.shopId;
  },

  render() {
    const {columns, loading, data, pagination} = this.state;
    return (
      <div>
        <Table columns={columns}
          rowKey={this.rowKey}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
      </div>
    );
  },
});

export default StayOpenShopListTable;
