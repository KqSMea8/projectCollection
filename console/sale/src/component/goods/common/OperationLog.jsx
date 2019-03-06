import { Table, message } from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import {format, formatTime} from '../../../common/dateUtils';
import {logSourceMap, logGoodsActionMap, logResultMap, logGoodsFilterList, logChannelMap} from '../../../common/OperationLogMap';

function rowKey(record) {
  return record.orderId;  // 比如你的数据主键是 uid
}

const OperationLog = React.createClass({
  propTypes: {
    goodsId: PropTypes.string,
  },
  getInitialState() {
    this.columns = [{
      title: '日志编号',
      dataIndex: 'orderId',
      width: 210,
    }, {
      title: '操作人',
      dataIndex: 'opName',
      width: 150,
      render(text, record) {
        if (!text) {
          return '';
        }
        return text + (record.opNickName ? '(' + record.opNickName + ')' : '');
      },
    }, {
      title: '操作类型',
      dataIndex: 'action',
      width: 100,
      render(text) {
        return logGoodsActionMap[text] || text;
      },
      filters: logGoodsFilterList,
    }, {
      title: '操作结果',
      dataIndex: 'status',
      width: 100,
      render(text) {
        return logResultMap[text] || text;
      },
    }, {
      title: '操作时间',
      dataIndex: 'createTime',
      width: 150,
      render(text) {
        return format(new Date(text)) + ' ' + formatTime(new Date(text));
      },
    }, {
      title: '操作来源',
      dataIndex: 'channel',
      width: 100,
      render(text, record) {
        return (logSourceMap[record.source] || record.source) + '-' + (logChannelMap[text] || text);
      },
    }, {
      title: '备注',
      dataIndex: 'memo',
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        current: 1,
      },
      loading: false,
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
  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      'itemId': this.props.goodsId,
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.crmhomeUrl + '/goods/koubei/itemLog.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          const pagination = {...this.state.pagination};
          const {data} = result;
          pagination.total = data.totalItems;
          this.setState({
            loading: false,
            data: data.data,
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
  render() {
    const { data, pagination, loading } = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
                 dataSource={data}
                 pagination={pagination}
                 loading={loading}
                 onChange={this.onTableChange}
                 rowKey={rowKey}/>
        </div>
      </div>
    );
  },
});

export default OperationLog;
