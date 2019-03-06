import { Table, message } from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import {format, formatTime} from '../../../common/dateUtils';
import { logResultMap } from '../../../common/OperationLogMap';

function rowKey(record) {
  return record.id;  // 比如你的数据主键是 uid
}

const OperationLog = React.createClass({
  propTypes: {
    goodsId: PropTypes.string,
  },
  getInitialState() {
    const columns = [{
      title: '日志编号',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    }, {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 150,
      render(text, record) {
        if (!text) {
          return '';
        }
        return text + (record.opNickName ? '(' + record.opNickName + ')' : '');
      },
    }, {
      title: '操作类型',
      dataIndex: 'opType',
      key: 'opType',
      width: 100,
      filters: [{
        text: '商品下架',
        value: '商品下架',
      }, {
        text: '商品修改',
        value: '商品修改',
      }, {
        text: '商品创建',
        value: '商品创建',
      }, {
        text: '其他',
        value: '其他',
      }],
      onFilter(value, record) {
        return record.opType.indexOf(value) === 0;
      },
    }, {
      title: '操作结果',
      dataIndex: 'opResult',
      key: 'opResult',
      width: 100,
      render(text) {
        return logResultMap[text] || text;
      },
    }, {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render(text) {
        return format(new Date(text)) + ' ' + formatTime(new Date(text));
      },
    }, {
      title: '操作来源',
      dataIndex: 'opSrc',
      key: 'opSrc',
      width: 100,
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 240,
    }, {
      title: '操作',
      width: 100,
      render(text, record) {
        if ( record.opType === '商品修改' || record.opType === '商品创建') {
          return (<a href={'#/goods/StreamStoredValueCardInfo/' + record.itemId + '/' + record.id } target = "_blank" >查看详情</a>);
        }
      },
    }];
    return {
      columns: columns,
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
      url: window.APP.crmhomeUrl + '/goods/koubei/cardTempOpLog.json',
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
          this.power = this.props.goodsId;
          this.setState({
            loading: false,
            data: data.data,
            pagination,
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg || '系统繁忙', 3);
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
          <Table columns={this.state.columns}
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
