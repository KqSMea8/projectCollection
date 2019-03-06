import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import Table from '../../../common/Table';
import {format} from '../../../common/dateUtils';
import {remoteLog} from '../../../common/utils';
import {checkIsCancelShop} from '../common/CancelShop';
import {logGoodsShopTypeMap, logGoodsShopTypeList} from '../../../common/OperationLogMap';


const openProgressStatusMap = {
  IN_PROGRESS: '开店处理中',
  WAIT_MERCHANT_CONFIRM: '待商户确认',
  FAILED: '开店失败',
};

const BacklogShopListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    isService: PropTypes.bool, // true: 门店查询，客服小二使用；false：待开门店
  },

  getInitialState() {
    const columns = [
      {
        title: '门店名称',
        dataIndex: 'shopName',
        width: 100,
        render(text, record) {
          return (<span>
            {text}<br/>
          <span style={{color: '#FF6600'}}>{record.mallName ? <span>[{record.mallName}]</span> : null}</span>
          </span>);
        },
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
          const list = [address];
          list.push('Tel：' + record.mobile);
          return list;
        },
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        width: 130,
      },
      {
        title: '开店进度',
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
          let isMall = '';
          if (record.shopType === 'MALL') {
            isMall = record.shopType;
          }
          const modifyPermission = permission('SHOP_MODIFY') && record.openProgressCode === 'FAILED' && !this.props.isService;
          return (<span>
            {(permission('SHOP_DETAIL') && (isMall !== 'MALL')) && <a href={'#/shop/diary/' + record.orderId + '/CREATE_SHOP?svr=' + !!this.props.isService} target="_blank">查看</a>}
            {(permission('SHOP_DETAIL') && (isMall === 'MALL')) && <a href={'#/approval-flow/complex/' + record.orderId + '/CREATE_SHOP?svr=' + !!this.props.isService} target="_blank">查看</a>}
            {(permission('SHOP_DETAIL') && modifyPermission) && <span className="ant-divider"></span>}
            {modifyPermission && <a href="#" onClick={this.gotoEdit.bind(this, record.orderId, record.shopType)}>重新开店</a>}
            {(record.canCancel && permission('SHOP_DETAIL')) && <span className="ant-divider"></span>}
            {record.canCancel && <a onClick={checkIsCancelShop.bind(this, record.orderId, 'order', undefined, this.refresh)}>撤销开店</a>}
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

  componentWillMount() {
    if (this.props.isService) {
      this.setState({
        loading: false,
      });
    } else {
      this.refresh();
    }
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

  gotoDetail(orderId, e) {
    e.preventDefault();
    remoteLog('SHOP_BACKLOG_DETAIL');
    window.open(window.APP.liteUrl + '#/approval-flow/' + orderId + '/CREATE_SHOP' + '/shop-create');
  },

  gotoEdit(orderId, shopType, e) {
    e.preventDefault();
    const type = shopType === 'MALL' ? 'mall' : 'shop';
    if (shopType !== 'MALL') {
      remoteLog('SHOP_BACKLOG_EDIT');
    }
    if (type === 'shop') {
      window.open(`?mode=create#/${type}/create/${orderId}`);
    } else {
      window.open(`#/${type}/create/${orderId}`);
    }
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
      url: window.APP.crmhomeUrl + (this.props.isService ? '/shop/koubei/toBeOpenedShops4CustomerService.json' : '/shop/koubei/toBeOpenedShops.json'),
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

    return (
      <div>
        <Table columns={columns}
          rowKey={this.rowKey}
           loading={loading}
          dataSource={data}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
      </div>
    );
  },
});

export default BacklogShopListTable;
