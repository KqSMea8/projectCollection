import React from 'react';
import PropTypes from 'prop-types';
import { Table, Modal } from 'antd';
import find from 'lodash/find';

import { getTaskFlowList, deleteTaskFlow, stopTaskFlow } from '../../common/api';
import { TaskFlowStatusText } from '../../common/enum';
import SingleListTable, { Mode } from './SingleListTable';
import TaskFlowActionView from './TaskFlowActionView';
import EditTaskFlowModal from './EditTaskFlowModal/EditTaskFlowModal';

const { confirm } = Modal;

const DownLoadLink = {
  FLOW_EXE_SUMMARY: '/taskDef/dwonloadManyTaskDefOnGingResult?taskFlowId=',
};

class FlowListTable extends React.Component {
  static propTypes = {
    /* eslint react/forbid-prop-types:0 */
    search: PropTypes.object,
    bizType: PropTypes.string,
  };
  static defaultProps = {
    search: {}
  };
  constructor(props) {
    super();
    this.state = {
      pagination: { ...this.initialPagination },
      search: props.search || {},
      list: [],
      loading: false,
    };
  }
  // componentDidMount() {
  // }
  componentWillReceiveProps(next) {
    this.setState({ search: next.search }, () => this.loadList(1));
  }
  static getRowKey(record) {
    return record.id;
  }
  initialPagination = {
    current: 1,
    total: 0,
    pageSize: 10,
    showTotal: total => `共${total}条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: next => this.loadList(next),
    onShowSizeChange: (current, pageSize) => {
      this.setState({ pagination: { ...this.state.pagination, pageSize, current: 1 } }, this.loadList);
    }
  };
  handleUpdate = (id) => {
    const { list } = this.state;
    const taskFlowData = find(list, i => i.id === id);
    this.editFlowModal.open(taskFlowData, id);
  };
  handleSubmitUpdateOk = () => {
    this.editFlowModal.close();
    this.loadList();
  };
  handleDelete = (id) => {
    const doDelete = () => {
      deleteTaskFlow({ id })
        .then(() => this.loadList());
    };
    confirm({
      title: '你是否删除任务流？',
      content: '删除后将无法恢复',
      onOk() {
        doDelete();
      }
    });
  };
  handleStop = (id) => {
    const doStop = () => {
      stopTaskFlow({ id })
        .then(() => this.loadList());
    };
    confirm({
      title: '你是否终止任务流？',
      content: '删除后将无法恢复',
      onOk() {
        doStop();
      }
    });
  };
  handleDownloadExecutionSummary = (id) => {
    window.open(`${window.APP.kbsalesUrl}${DownLoadLink.FLOW_EXE_SUMMARY}${id}`);
  };
  columns = [
    { title: '任务流名称', dataIndex: 'name' },
    { title: '任务流描述', dataIndex: 'description' },
    { title: '任务流状态', dataIndex: 'status', render(t) { return TaskFlowStatusText[t]; } },
    { title: '创建人', dataIndex: 'createrName' },
    {
      title: '操作',
      width: 150,
      dataIndex: '-',
      render: (t, r) => (
        <TaskFlowActionView
          bizType={this.props.bizType}
          taskData={r}
          onUpdate={this.handleUpdate}
          onDelete={this.handleDelete}
          onStop={this.handleStop}
          onDownloadExecutionSummary={this.handleDownloadExecutionSummary}
        />
      )
    }
  ];
  editFlowModal = null;
  loadList = (next) => {
    const { bizType } = this.props;
    const { search, pagination } = this.state;
    getTaskFlowList({
      ...search,
      bizType,
      pageNo: next || pagination.current,
      pageSize: pagination.pageSize,
    })
      .then((resp) => {
        this.setState({
          list: resp.data.data,
          pagination: {
            ...pagination,
            current: next || pagination.current,
            total: resp.data.totalItems,
          },
          loading: false
        });
      })
      .catch(() => {});
  };
  syncTaskFlowStatus = (taskFlowId) => {
    const { bizType } = this.props;
    const { search, pagination } = this.state;
    getTaskFlowList({
      ...search,
      ...pagination,
      bizType,
      pageNo: pagination.current,
      taskFlowId
    })
      .then(resp => {
        const remote = resp.data.data[0];
        const { list } = this.state;
        if (remote) {
          const clonedList = [...list];
          const local = find(clonedList, f => f.id === taskFlowId);
          local.status = remote.status;
          this.setState({
            list: clonedList
          });
        }
      });
  };
  renderExpandedRow = (record) => {
    const { id } = record;
    const { bizType } = this.props;
    return (
      <SingleListTable bizType={bizType} mode={Mode.FLOW} taskFlowId={id} syncTaskFlowStatus={() => this.syncTaskFlowStatus(id)} />
    );
  };
  render() {
    const { pagination, list, loading } = this.state;
    return (
      <div>
      <Table
        rowKey={FlowListTable.getRowKey}
        loading={loading}
        columns={this.columns}
        expandedRowRender={this.renderExpandedRow}
        dataSource={list}
        pagination={pagination}
      />
        <EditTaskFlowModal ref={c => this.editFlowModal = c} onSubmitOk={this.handleSubmitUpdateOk}/>
      </div>
    );
  }
}

export default FlowListTable;
