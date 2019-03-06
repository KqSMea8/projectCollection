import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import {dateFormat} from '../../../common/dateUtils';
import Table from '../../../common/Table';

const ConfirmMallListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    shopStatus: PropTypes.any,
    mallId: PropTypes.any,
  },

  getInitialState() {
    return {
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

  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedIds: selectedRowKeys,
    });
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
    params.mallId = this.props.mallId;
    this.setState({
      loading: true,
    });
    const url = '/shop/queryToBeConfirmShops.json';
    params.mallId = this.props.mallId;
    ajax({
      url,
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
  render() {
    const columns = [
      {
        title: '门店名称',
        dataIndex: 'shopName',
        width: 180,
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        width: 130,
        render(text) {
          return dateFormat(new Date(text));
        },
      },
      {
        title: '操作类型',
        dataIndex: 'action',
        width: 130,
        render: (action) => {
          const obj = {
            SURROUND_SHOP: '添加',
            REMOVE_SHOP: '移除',
          };
          return (obj[action]);
        },
      },
      {
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 230,
        render: (text, record) => {
          return [
            text,
            <br key={1}/>,
            record.mobile ? 'Tel：' + record.mobile : '',
          ];
        },
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: '',
        width: 130,
        render: (text, record) => {
          return (<a href={'#/mall/flow-detail/' + record.orderId + '/' + record.action} target="_blank">查看并处理</a>);
        },
      },
    ];
    const {loading, data, pagination, selectedIds} = this.state;
    this.rowSelection = {
      selectedRowKeys: selectedIds,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <Table columns={columns}
          loading={loading}
          rowKey={r => r.orderId}
          dataSource={data}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
      </div>
    );
  },
});

export default ConfirmMallListTable;
