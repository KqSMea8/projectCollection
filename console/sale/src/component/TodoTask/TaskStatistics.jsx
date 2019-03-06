import React, {PropTypes} from 'react';
import { Table } from 'antd';
import MoreActions from './common/MoreActions';
import ajax from '@alipay/kb-framework/framework/ajax';
import TableActions from './common/TableActions';

const TaskStatistics = React.createClass({
  propTypes: {
    groupId: PropTypes.string,
    showModal: PropTypes.func,
  },

  mixins: [TableActions],

  getInitialState() {
    const { showModal } = this.props;
    this.columns = [{
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100,
    }, {
      title: '任务总数',
      dataIndex: 'totalCount',
      key: 'totalCount',
      width: 100,
    }, {
      title: '已完成任务数',
      dataIndex: 'finishCount',
      key: 'finishCount',
      width: 100,
    }, {
      title: '未完成任务数',
      dataIndex: 'waitCount',
      key: 'waitCount',
      width: 100,
    }, {
      title: '超时未完成任务数',
      dataIndex: 'timeOutCount',
      key: 'timeOutCount',
      width: 100,
    }, {
      title: '状态',
      width: 100,
      key: 'status',
      render: (_, r) => {
        const todoTaskStatusMap = {
          'INIT': (<span style={{ color: 'rgb(245, 106, 0)'}}>生成中</span>),
          'FAIL': '生成失败',
          'PROCESS': '执行中',
          'FINISH': '已截止',
          'END': '已终止',
          'PARTFAIL': '执行中（部分失败）',
        };
        return todoTaskStatusMap[r.status];
      },
    }, {
      title: '操作',
      width: 120,
      key: 'operation',
      render: (_, r) => {
        let actions = []; // 状态：生成中
        if (r.status === 'FAIL') { // 状态：生成失败
          actions = ['MODIFY', 'DOWNLOAD_FAIL_REASON', 'DELETE']; // 对应操作： 修改、下载失败原因、删除
        } else if (r.status === 'PROCESS') { // 状态：执行中
          actions = ['MODIFY', 'DOWNLOAD_TASK_CONDITION', 'END_TASK']; // 对应操作： 修改、下载任务情况、终止任务
        } else if (r.status === 'FINISH') { // 状态：已截止
          actions = ['DOWNLOAD_TASK_CONDITION']; // 对应操作：下载任务情况
        } else if (r.status === 'END') { // 状态：已终止
          actions = ['DOWNLOAD_TASK_CONDITION', 'DELETE']; // 对应操作： 下载任务情况、删除
        } else if (r.status === 'PARTFAIL') { // 状态：部分失败
          actions = ['MODIFY', 'DOWNLOAD_FAIL_REASON', 'DOWNLOAD_TASK_CONDITION', 'END_TASK']; // 对应操作： 修改、下载失败原因、下载任务情况、终止任务
        }
        return <MoreActions isCountryTask row={r} actions={actions} onRefresh={this.fetch} showModal={showModal}/>;
      },
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: false,
        showQuickJumper: false,
        pageSize: 10,
        current: 1,
      },
    };
  },

  componentDidMount() {
    const {current, pageSize} = {...this.state.pagination};
    this.onTableChange({
      current,
      pageSize,
    });
  },

  fetch(pageParams = {}, isOnRefresh) {
    const { groupId } = this.props;
    this.setState({ loading: true });

    // 刷新列表时重置分页为第一页
    const pager = { ...this.state.pagination };
    if (isOnRefresh) {
      pager.current = 1;
      this.setState({pagination: pager});
    }

    ajax({
      url: window.APP.kbsalesUrl + '/shop/queryBusinessTaskListByGroupId.json',
      method: 'GET',
      data: {
        ...pageParams,
        groupId: groupId
      },
      type: 'json',
      success: (res) => {
        if (res && res.status === 'succeed') {
          const pagination = { ...this.state.pagination };
          pagination.total = res.data.totalCount;
          this.setState({
            loading: false,
            data: res.data.businessTaskList,
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
    const {data, loading, pagination} = this.state;

    return (<div>
      <Table
        className="task-management-statistics"
        size="small"
        columns={this.columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={this.onTableChange}
        rowKey={r => r.taskId}
      />
    </div>);
  },
});

export default TaskStatistics;
