import React, { PropTypes } from 'react';
import { Table, message } from 'antd';
import ajax from '../../../../common/ajax';

import ExternalActivityAction from './ExternalActivityAction';
// import { merchantActivityStatus } from '../../config/AllStatus';
import TableActions from '../../../../common/TableActions';


function rowKey(record) {
  return record.activityId;
}

const ExternalActivityTable = React.createClass({
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
      dataIndex: 'activityName',
      width: 220,
      /* render: (text, record) => {
        return record.planOutBizType === 'BIZTYPE_MEMBER_PLAN' ?
          (<p>{text}<span style={{color: 'red'}}>[会员]</span></p>) : text;
      }, */
    }, {
      title: '活动时间',
      dataIndex: 'activityStartTime',
      render: (text, record) => {
        return record.activityStartTime + ' - ' + record.activityEndTime;
      },
    }, {
      title: '邀约方',
      width: 150,
      dataIndex: 'inviterName',
    }, {
      title: '状态',
      width: 100,
      dataIndex: 'activityStatusDesc',
      /* render: (text) => {
        return ''//merchantActivityStatus[text].text;
      }, */
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      render: (text, record, index) => {
        return (<ExternalActivityAction
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
      url: '/promo/activity/activityListQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status) {
          const pagination = {...this.state.pagination};
          pagination.total = res.page.totalSize;
          this.setState({
            loading: false,
            data: res.data,
            isKbserv: res.isKbservLogin,
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
        <Table bordered
          columns={this.columns}
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

export default ExternalActivityTable;
