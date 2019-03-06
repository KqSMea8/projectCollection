import React, {PropTypes} from 'react';
import Table from '../../../common/Table';
import {message} from 'antd';
import ajax from 'Utility/ajax';
import ModifyDetailModal from './ModifyDetailModal';

const opTypeMap = {
  CAMPAIGN_CREATE: '活动创建',
  CAMPAIGN_OFFLINE: '活动下架',
  CAMPAIGN_MODIFIED: '活动修改',
  CAMPAIGN_AGREE: '活动创建确认',
  CAMPAIGN_REJECT: '活动创建拒绝',
  CAMPAIGN_MODIFIED_AGREE: '活动修改确认',
  CAMPAIGN_MODIFIED_REJECT: '活动修改拒绝',
  CAMPAIGN_OFFLINE_AGREE: '活动下架确认',
  CAMPAIGN_OFFLINE_REJECT: '活动下架拒绝',
};

const ActivityDetailOperation = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const columns = [
      {
        title: '日志编号',
        dataIndex: 'logId',
        key: 'logId',
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '操作类型',
        dataIndex: 'operateType',
        key: 'operateType',
        render: (t) => {
          return (<span>{opTypeMap[t]}</span>);
        },
      },
      {
        title: '操作结果',
        dataIndex: 'operateResult',
        key: 'operateResult',
      },
      {
        title: '操作时间',
        dataIndex: 'gmtModified',
        key: 'gmtModified',
      },
      {
        title: '操作来源',
        dataIndex: 'source',
        key: 'source',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render(text, record) {
          return record.operateType === 'CAMPAIGN_MODIFIED' && record.modifyFieldVOs && record.modifyFieldVOs.length > 0 ? <ModifyDetailModal ModifyData={record.modifyFieldVOs}/> : text;
        },
      },
    ];
    return {
      columns,
      data: [],
      loading: true,
      selectedIds: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
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
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/goods/koubei/promotionOplogs.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'failed' && result.status) {
          message.error(result.resultMsg);
        } else {
          const pagination = {...this.state.pagination};
          pagination.total = result.PAGE_INFO.totalSize;
          message.success(result.resultMsg);
          this.setState({
            loading: false,
            data: result.result || [],
            pagination,
          });
        }
      },
    });
  },
  render() {
    const {pagination, columns, loading, data} = this.state;
    return (
      <div style={{padding: 16}}>
        <Table columns={columns}
          rowKey={r => r.logId}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={this.onTableChange}
          bordered/>
      </div>
    );
  },
});

export default ActivityDetailOperation;
