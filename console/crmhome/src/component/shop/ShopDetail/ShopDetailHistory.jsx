import React, {PropTypes} from 'react';
import {Table, message} from 'antd';
import ajax from '../../../common/ajax';
import {format, formatTime} from '../../../common/dateUtils';
import {logSourceMap, logChannelMap, logShopActionMap, logResultMap, logShopFilterList} from '../../../common/OperationLogMap';


const columns = [
  {
    title: '日志编号',
    dataIndex: 'orderId',
    width: 210,
  },
  {
    title: '操作人',
    dataIndex: 'opName',
    width: 150,
    render(text, record) {
      if (!text) {
        return '';
      }
      return text + (record.opNickName ? '(' + record.opNickName + ')' : '');
    },
  },
  {
    title: '操作类型',
    dataIndex: 'action',
    width: 100,
    render(text) {
      return logShopActionMap[text] || text;
    },
    filters: logShopFilterList,
  },
  {
    title: '操作结果',
    dataIndex: 'status',
    width: 100,
    render(text) {
      return logResultMap[text] || text;
    },
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 150,
    render(text) {
      return format(new Date(text)) + ' ' + formatTime(new Date(text));
    },
  },
  {
    title: '操作来源',
    dataIndex: 'channel',
    width: 100,
    render(text, record) {
      return (logSourceMap[record.source] || record.source) + '-' + (logChannelMap[text] || text);
    },
  },
  {
    title: '备注',
    dataIndex: 'memo',
  },
  {
    title: '操作',
    dataIndex: '',
    width: 80,
    render(text, record) {
      const actionCode = record.action;
      if (actionCode === 'CREATE_SHOP' || actionCode === 'MODIFY_SHOP') {
        return <a href={'#/shop/diary/' + record.orderId + '/CREATE_SHOP'} target="_blank">查看详情</a>;
      }
      return null;
    },
  },
];

const ShopDetailHistory = React.createClass({
  propTypes: {
    id: PropTypes.string,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
    };
  },

  componentDidMount() {
    this.refresh();
  },

  onTableChange(pagination, filters) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });

    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      actions: filters.action,
    };
    this.fetch(params);
  },
  showTotal(total) {
    return `共 ${total} 条`;
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
      shopId: this.props.id,
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: '/shop/crm/shopLog.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          pagination.total = result.data.totalItems;
          this.setState({
            loading: false,
            data: result.data.data,
            pagination,
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  rowKey(record) {
    return record.orderId;
  },

  render() {
    return (
      <div>
        <Table columns={columns}
          rowKey={this.rowKey}
          dataSource={this.state.data}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.onTableChange} />
      </div>
    );
  },
});

export default ShopDetailHistory;
