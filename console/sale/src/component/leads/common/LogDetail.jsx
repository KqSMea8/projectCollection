import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import {format, formatTime} from '../../../common/dateUtils';
import {logSourceMap, logChannelMap, logResultMap} from '../../../common/OperationLogMap';
import React, {PropTypes} from 'react';

const LogDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const logOperateMap = {
      'CREATE_LEADS': '创建leads',
      'MODIFY_LEADS': '修改leads',
      'CLAIM_LEADS': '认领leads',
      'RELEASE_LEADS': '释放leads',
      'ALLOCATE_LEADS': '分配leads',
    };

    this.columns = [{
      title: '日志编号',
      dataIndex: 'orderId',
    },
      {
        title: '操作人',
        dataIndex: 'opName',
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
          return logOperateMap[text] || text;
        },
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
        width: 100,
        render(text) {
          return format(new Date(text)) + ' ' + formatTime(new Date(text));
        },
      },
      {
        title: '业务来源－渠道',
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
          return <a href={`#leads/waited/detail/${record.orderId}/diary`} target="_blank">查看详情</a>;
        },
      }];

    return {
      data: [],
      loading: true,
      pagination: {
        showQuickJumper: true,
        showTotal: this.showTotal,
        showSizeChanger: true,
        pageSize: 10,
        current: 1,
      },
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
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});
    ajax({
      url: '/sale/leads/leadsEditOrder.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalItems;
        this.setState({
          loading: false,
          data: result.data.data,
          pagination,
        });
      },
    });
  },

  render() {
    const {data, pagination, loading} = this.state;
    return (
      <div className="app-detail-content-padding" style={{marginTop: 15}}>
          <Table columns={this.columns}
             rowKey={r=>r.orderId}
             rowSelection={this.rowSelection}
             dataSource={data}
             firstShow={!this.props.params}
             pagination={pagination}
             loading={loading}
             locale={{ emptyText: '暂无数据' }}
             onChange={this.onTableChange}/>
      </div>
    );
  },
});

LogDetail.isLog = 1;
export default LogDetail;
