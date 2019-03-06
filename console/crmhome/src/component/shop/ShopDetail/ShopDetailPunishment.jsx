import React, {PropTypes} from 'react';
import {Table, message} from 'antd';
import ajax from '../../../common/ajax';
import {format, formatTime} from '../../../common/dateUtils';
import {punishmentappeal} from '../common/ShopConfig';

const columns = [
  {
    title: '事件ID',
    dataIndex: 'complaintId',
    width: 150,
  },
  {
    title: '处罚时间',
    dataIndex: 'gmtCreated',
    width: 200,
    render(text) {
      return format(new Date(text)) + ' ' + formatTime(new Date(text));
    },
  },
  {
    title: '处罚方式',
    dataIndex: 'punishTools',
    width: 300,
    render(text) {
      return text.join(',');
    },
  },
  {
    title: '申诉信息',
    dataIndex: 'appealStatus',
    width: 150,
    render(text) {
      return punishmentappeal[text];
    },
  },
  {
    title: '处罚说明',
    dataIndex: 'eventTypeDesc',
  },
];

const ShopDetailPunishment = React.createClass({
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
      type: 'SHOP',
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: 'shop/crm/logForShop.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        if (!result) {
          return;
        }
        if (result.status === 'succeed') {
          if (result.data) {
            if (result.data.pageInfo) {
              pagination.total = result.data.pageInfo.items;
            }
            if (result.data.values) {
              this.setState({
                loading: false,
                data: result.data.values,
                pagination,
              });
            } else {
              this.setState({loading: false});
              /*eslint-disable */
              if (result.errorMsg) {
                message.error(result.errorMsg, 3);
              }
              /*eslint-enable */
            }
          }
        }
      },
    });
  },

  rowKey(record) {
    return record.complaintId;
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

export default ShopDetailPunishment;
