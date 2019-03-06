import React, {PropTypes} from 'react';
import { Table } from 'antd';
import ajax from 'Utility/ajax';

const MerchantLog = React.createClass({
  propTypes: {
    pid: PropTypes.any,
  },

  getInitialState() {
    this.columns = [{
      title: '序号',
      dataIndex: 'id',
    }, {
      title: '操作人',
      dataIndex: 'operatorName',
    }, {
      title: '操作类型',
      dataIndex: 'operateType',
    }, {
      title: '操作时间',
      dataIndex: 'gmtOperate',
    }, {
      title: '操作信息',
      dataIndex: 'message',
      width: 500,
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        current: 1,
      },
      loading: true,
    };
  },

  componentDidMount() {
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
      partnerId: this.props.pid,
    };

    ajax({
      url: '/sale/merchant/merchantLogsList.json',
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
      error: () => {
        this.setState({
          loading: false,
          data: [],
        });
      },
    });
  },

  render() {
    const {data, pagination, loading} = this.state;
    return (<div>
      <Table columns={this.columns}
             dataSource={data}
             pagination={pagination}
             loading={loading}
             onChange={this.onTableChange}/>
    </div>);
  },
});

export default MerchantLog;
