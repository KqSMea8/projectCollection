import React, { PropTypes } from 'react';
import { Table, message } from 'antd';
import ajax from '../../../../common/ajax';

import ActivityAction from './ActivityAction';
import TableActions from '../../../../common/TableActions';


function rowKey(record) {
  return record.campId;
}

const ActivityTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  mixins: [TableActions],

  getDefaultProps() {
    return ({
      templateType: 'ALL',
      templateStatus: 'ALL',
    });
  },

  getInitialState() {
    this.columns = [{
      title: '活动名称',
      dataIndex: 'name',
      width: 200,
    }, {
      title: '活动时间',
      width: 200,
      render: (text, record) => {
        return (
          <span>
            {record.beginTime}
            <br/>{record.endTime}
          </span>
        );
      },
    }, {
      title: '活动类型',
      dataIndex: 'campType',
    }, {
      title: '状态',
      dataIndex: 'displayStatus',
    }, {
      title: '发布平台',
      dataIndex: 'sourceChannel',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      className: 'ft-center',
      render: (text, record, index) => {
        return (<ActivityAction
            item={record}
            index={index}
            refresh={this.refresh} />);
      },
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      loading: true,
    };
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };

    this.setState({loading: true});

    ajax({
      url: '/promo/merchant/listView.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          const pagination = {...this.state.pagination};
          pagination.total = res.page.totalSize;
          this.setState({
            loading: false,
            data: res.data,
            pagination,
          });
        } else {
          message.error(res.errorMsg);
        }
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
    const locale = {};

    if (this.props.params) {
      locale.emptyText = '搜不到结果，换下其他搜索条件吧~';
    } else {
      locale.emptyText = '暂无数据，请输入查询条件搜索';
    }
    return (
      <div>
        <Table columns={this.columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          locale={locale}
          onChange={this.onTableChange}
          rowKey={rowKey}
          />
      </div>

    );
  },
});

export default ActivityTable;
