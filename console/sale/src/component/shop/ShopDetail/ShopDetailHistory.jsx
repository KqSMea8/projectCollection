import React, {PropTypes} from 'react';
import {Table, message} from 'antd';
import ajax from 'Utility/ajax';
import {format, formatTime} from '../../../common/dateUtils';
import {logSourceMap, logChannelMap, logResultMap} from '../../../common/OperationLogMap';
import permission from '@alipay/kb-framework/framework/permission';

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
      url: window.APP.crmhomeUrl + '/shop/koubei/shopLog.json',
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
    let logShopActionList = [];
    if (permission('SHOP_QUERY_AUTH')) {
      logShopActionList = [];
      logShopActionList.push(
      {key: 'CREATE_SHOP', value: '创建门店'},
      {key: 'MODIFY_SHOP', value: '修改门店'},
      {key: 'CREATE_SHOP_ALLOCATION', value: '系统分配'},
      {key: 'ADJUST_SHOP_ALLOCATION', value: '手动分配'},
      {key: 'CREATE_SHOP_JUDGE_RECOVER', value: '店铺创建判单恢复'},
      {key: 'CLOSE_SHOP', value: '关闭门店'},
      {key: 'FREEZE_SHOP', value: '冻结门店'},
      {key: 'UNFREEZE_SHOP', value: '解冻门店'},
      {key: 'SURROUND_SHOP', value: '圈店'},
      {key: 'REMOVE_SHOP', value: '移店'},
      {key: 'CREATE_SHOP_RATE', value: '创建门店费率'},
      {key: 'INVALID_SHOP_RATE', value: '失效门店费率'});
    } else {
      logShopActionList = [];
      logShopActionList.push(
      {key: 'CREATE_SHOP', value: '创建门店'},
      {key: 'MODIFY_SHOP', value: '修改门店'},
      {key: 'CREATE_SHOP_ALLOCATION', value: '系统分配'},
      {key: 'ADJUST_SHOP_ALLOCATION', value: '手动分配'},
      {key: 'GRANT_SHOP_AUTHORIZATION', value: '门店授权'},
      {key: 'CANCEL_SHOP_AUTHORIZATION', value: '停止授权'},
      {key: 'CREATE_SHOP_JUDGE_RECOVER', value: '店铺创建判单恢复'},
      {key: 'CLOSE_SHOP', value: '关闭门店'},
      {key: 'FREEZE_SHOP', value: '冻结门店'},
      {key: 'UNFREEZE_SHOP', value: '解冻门店'},
      {key: 'SURROUND_SHOP', value: '圈店'},
      {key: 'REMOVE_SHOP', value: '移店'},
      {key: 'CREATE_SHOP_RATE', value: '创建门店费率'},
      {key: 'INVALID_SHOP_RATE', value: '失效门店费率'}
      );
    }
    if (permission('SHOP_PROBLEM_LABEL_REMOVE')) {
      logShopActionList.push({
        key: 'REMOVE_PROBLEM_LABEL_FROM_SHOP', value: '问题去标',
      });
    }
    const logShopActionMap = {};
    logShopActionList.forEach((row) => {
      logShopActionMap[row.key] = row.value;
    });
    const logShopFilterList = [];
    logShopActionList.forEach((row) => {
      logShopFilterList.push({text: row.value, value: row.key});
    });
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

          if (actionCode === 'CREATE_SHOP_ALLOCATION'
            || actionCode === 'ADJUST_SHOP_ALLOCATION'
              || actionCode === 'GRANT_SHOP_AUTHORIZATION'
                || actionCode === 'CLOSE_SHOP'
                  || actionCode === 'FREEZE_SHOP'
                    || actionCode === 'UNFREEZE_SHOP') {
            return <a href={window.APP.liteUrl + '#/approval-flow/' + record.orderId + '/' + actionCode + '/shop-alloc'} target="_blank">查看详情</a>;
          }
        },
      },
    ];
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
