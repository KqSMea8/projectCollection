import React from 'react';
import {Table} from 'antd';
import ajax from 'Utility/ajax';

const columns = [
  {
    title: '活动ID',
    dataIndex: 'id',
  },
  {
    title: '活动名称',
    dataIndex: 'title',
  },
  {
    title: '活动开始时间',
    dataIndex: 'startTime',
  },
  {
    title: '活动结束时间',
    dataIndex: 'endTime',
  },
];

const ShopDetailPromotion = React.createClass({

  getInitialState() {
    return {
      data: [],
      loading: true,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        pageNum: 1,
      },
    };
  },

  componentDidMount() {
    this.refresh();
  },

  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.pageNum = pagination.pageNum;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.pageNum,
    };
    this.fetch(params);
  },

  refresh() {
    const {pageSize, pageNum} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: '/shop/promotion.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.totalCount;
        this.setState({
          loading: false,
          data: result.data,
          pagination,
        });
      },
    });
  },

  rowKey(record) {
    return record.id;
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

export default ShopDetailPromotion;
