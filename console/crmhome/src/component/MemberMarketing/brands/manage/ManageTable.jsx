import React, { PropTypes } from 'react';
import { Table } from 'antd';
import ajax from '../../../../common/ajax';
import MoreAction from './MoreAction';
import {activityType, activityStatus} from '../../config/AllStatus';
import TableActions from '../../../../common/TableActions';

function rowKey(record) {
  return record.planId;  // 数据主键是 templateId
}

const TemplatesTable = React.createClass({
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
      dataIndex: 'subject',
      width: 300,
      render: (text, record) => {
        return record.planOutBizType === 'BIZTYPE_MEMBER_PLAN' ?
          (<p>{text}<span style={{color: 'red'}}>[精准营销]</span></p>) : text;
      },
    }, {
      title: '活动时间',
      dataIndex: 'activityTime',
    }, {
      title: '活动类型',
      dataIndex: 'activityType',
      width: 100,
      render: (text) => {
        return activityType[text];
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (text) => {
        return activityStatus[text].text;
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      render: (text, record, index) => {
        return (<MoreAction
            item={record}
            key={index}
            refresh={this.refresh}/>
        );
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
      url: '/goods/itempromo/brandVendorItems.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.result) {
          const pagination = {...this.state.pagination};
          pagination.total = res.page.totalSize;
          this.setState({
            loading: false,
            data: res.data,
            pagination,
          });
        } else {
          this.setState({
            loading: false,
            data: [],
          });
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

export default TemplatesTable;
