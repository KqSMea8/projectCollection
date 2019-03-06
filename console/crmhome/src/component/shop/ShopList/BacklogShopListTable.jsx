import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import Table from '../../../common/Table';
import {dateFormat} from '../../../common/dateUtils';
import {remoteLog} from '../common/utils';
import {checkIsCancelShop} from '../common/CancelShop';

const openProgressStatusMap = {
  IN_PROGRESS: '开店处理中',
  FAILED: '开店失败',
  WAIT_MERCHANT_CONFIRM: '待确认',
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
      },
      {
        title: '提交时间',
        dataIndex: 'createTime',
        width: 110,
        render(text) {
          return text ? dateFormat(new Date(text)) : '';
        },
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
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 230,
        render(text, record) {
          const address = [record.provinceName, record.cityName, record.districtName].filter(r => r).join('-') + ' ' + text;
          const tel = 'Tel：' + record.mobile;
          return (<div>
            <div>{address}</div>
            {tel}
          </div>);
        },
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        width: 130,
      },
      {
        title: '操作',
        dataIndex: '',
        width: 100,
        render: (text, record) => {
          const actionPermission = record.openProgressCode === 'WAIT_MERCHANT_CONFIRM' && !this.props.isService;
          const cancelPermission = record.openProgressCode === 'IN_PROGRESS';
          // 综合体
          if (record.shopType === 'MALL') {
            return (<span>
              {actionPermission ? <a href={'#/mall/flow-detail/' + record.orderId + '/CREATE_SHOP'} target="_blank">查看并处理</a> :
                <a href={'#/mall/flow-detail/' + record.orderId + '/CREATE_SHOP'} target="_blank">查看</a>}
            </span>);
          }
          // 普通门店
          const modifyPermission = record.openProgressCode === 'FAILED' && record.canReOpen && !this.props.isService;
          return (<span>
            <a href={'#/shop/diary/' + record.orderId + '/CREATE_SHOP'} target="_blank">查看{actionPermission && '并处理'}</a>
            {modifyPermission && <span className="ant-divider"></span>}
            {modifyPermission && <a onClick={this.gotoEdit.bind(this, record.orderId)}>重新开店</a>}
            {cancelPermission && <span className="ant-divider"></span>}
            {cancelPermission && <a onClick={checkIsCancelShop.bind(this, record.orderId, 'order', undefined, this.refresh)}>撤销开店</a>}
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

  gotoEdit(orderId) {
    remoteLog('SHOP_BACKLOG_EDIT');
    // window.open('#/shop/edit/?id=' + orderId);
    window.open(`?mode=create#/shop/create/${orderId}`);
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
      url: (this.props.isService ? '/shop/crm/toBeOpenedShops4CustomerService.json' : '/shop/crm/toBeOpenedShops.json'),
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
          dataSource={data}
          loading={loading}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
      </div>
    );
  },
});

export default BacklogShopListTable;
