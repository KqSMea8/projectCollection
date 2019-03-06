import React from 'react';
import PropTypes from 'prop-types';
import {Table, Modal} from 'antd';
import find from 'lodash/find';
import {OSSUtil} from '@alipay/kb-framework-components/lib/biz';

import {getTaskList, deleteTask, stopTask, updateTask, getTaskListByFlowId} from '../../common/api';
import {TaskStatusText} from '../../common/enum';
import TaskActionView from './TaskActionView';
import EditTaskModal from '../Form/EditTaskModal';
import FormDataProcessor from '../Form/FormDataProcessor';
import TaskSummaryPopover from './TaskSummaryPopover';

const DownLoadLink = {
  EXE_FAIL_REASON: '/taskDef/dwonloadTaskDefFailResult?taskId=',
  TASK_EXE_SUMMARY: '/taskDef/dwonloadOneTaskDefOnGingResult?taskId=',
};

const confirm = Modal.confirm;

export const Mode = {
  FLOW: 'FLOW', // 适用于任务流嵌套任务列表
  SINGLE: 'SINGLE' // 适用于单任务列表
};

class SingleListTable extends React.Component {
  static propTypes = {
    /* eslint react/forbid-prop-types:0 */
    taskFlowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    search: PropTypes.object,
    list: PropTypes.array,
    mode: PropTypes.oneOf([Mode.FLOW, Mode.SINGLE]),
    syncTaskFlowStatus: PropTypes.func,
    bizType: PropTypes.string,
  };
  static defaultProps = {
    taskFlowId: '',
    search: {},
    list: [],
    mode: Mode.SINGLE,
  };

  constructor(props) {
    super();
    this.state = {
      pagination: {...this.initialPagination},
      search: props.search,
      list: [],
      loading: false
    };
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === Mode.FLOW) {
      this.loadListByFlowId();
    }
  }

  componentWillReceiveProps(next) {
    this.setState({search: next.search}, () => this.loadList(1));
  }

  initialPagination = {
    current: 1,
    total: 0,
    pageSize: 10,
    showTotal: total => `共${total}个记录`,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: next => this.loadList(next),
    onShowSizeChange: (current, pageSize) => {
      this.setState({ pagination: { ...this.state.pagination, pageSize, current: 1 } }, this.loadList);
    }
  };
  columns = [
    {title: '任务名称', dataIndex: 'name', render: (t, r) => <TaskSummaryPopover data={r}/>},
    {title: '任务描述', dataIndex: 'description'},
    {
      title: '任务状态', dataIndex: 'status', render(t) {
        return TaskStatusText[t];
      }
    },
    {
      title: '任务攻略',
      dataIndex: 'extInfo.tipsFileUrl',
      render: (t) => {
        if (!t) {
          return null;
        }
        return <a href={OSSUtil.getImageUrl(t, window.APP.kbsalesUrl)} target="_blank">查看攻略</a>;
      }
    },
    {
      title: '起止时间',
      dataIndex: 'beginTime',
      render: (t, r) => (
        <div className="kb-table-cell-nl-wrapper">
          {r.deadlineTimeTypeDTO && r.deadlineTimeTypeDTO.timeType === 'relative'
            ? <span>--</span>
            : <span>
              {r.beginTime}-<br/>
              {r.deadlineTime || (r.deadlineTimeTypeDTO && `${r.deadlineTimeTypeDTO.absoluteTime} 23:59:59`)}
              </span>
          }
        </div>
      )
    },
    {title: '创建人', dataIndex: 'createrName'},
    {
      title: '操作',
      width: 150,
      dataIndex: '-',
      render: (t, r) => (
        <TaskActionView
          taskData={r}
          bizType={this.props.bizType}
          onUpdate={this.handleUpdate}
          onReCreate={this.handleReCreate}
          onDelete={this.handleDelete}
          onStop={this.handleStop}
          onDownloadFailureReason={this.handleDownloadFailureReason}
          onDownloadExecutionSummary={this.handleDownloadExecutionSummary}
        />
      )
    }
  ];
  editTaskModal = null;
  handleDelete = (id) => {
    const doDelete = () => {
      deleteTask({id})
        .then(this.refresh);
    };
    confirm({
      title: '你是否删除任务？',
      content: '删除后将无法恢复',
      onOk() {
        doDelete();
      }
    });
  };
  handleReCreate = (id) => {
    this.editTaskModal.open({id});
  };
  handleUpdate = (id) => {
    const {list} = this.state;
    /* eslint prefer-destructuring:0 */
    const taskData = find(list, i => i.id === id);
    this.editTaskModal.open(FormDataProcessor.composeTaskFormData(taskData), id);
  };
  handleSubmitUpdate = (data, id) => {
    const { bizType, taskFlowId } = this.props;
    updateTask({
      id,
      taskFlowId,
      status: data.status,
      ...FormDataProcessor.composeTaskCreateRequest({bizType, ...data})
    })
      .then(() => {
        this.editTaskModal.close();
        this.refresh();
      });
  };
  handleStop = (id) => {
    const doStop = () => {
      stopTask({id})
        .then(this.refresh);
    };
    confirm({
      title: '你是否确认终止此任务？',
      content: '终止后，任务将在城市所有小二的待办中隐藏。',
      onOk() {
        doStop();
      }
    });
  };
  handleDownloadFailureReason = (id) => {
    window.open(`${window.APP.kbsalesUrl}${DownLoadLink.EXE_FAIL_REASON}${id}`);
  };
  handleDownloadExecutionSummary = (id) => {
    window.open(`${window.APP.kbsalesUrl}${DownLoadLink.TASK_EXE_SUMMARY}${id}`);
  };
  handlePageChange = (next) => {
    const {mode} = this.props;
    /* eslint prefer-destructuring:0 */
    if (mode === Mode.FLOW) {
      this.setState({
        pagination: {
          ...this.state.pagination,
          current: next
        }
      });
    } else {
      this.loadList(next);
    }
  };
  refresh = () => {
    const {mode, syncTaskFlowStatus} = this.props;
    if (mode === Mode.FLOW) {
      this.loadListByFlowId();
      syncTaskFlowStatus();
    } else {
      this.loadList();
    }
  };
  loadList = (next) => {
    const {bizType, mode} = this.props;
    const {search, pagination} = this.state;
    if (mode === Mode.FLOW) {
      return;
    }
    getTaskList({
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
      .catch(() => {
        this.setState({loading: false});
      });
  };

  loadListByFlowId = () => {
    const { taskFlowId } = this.props;
    this.setState({loading: true});
    getTaskListByFlowId({taskFlowId})
      .then(resp => {
        this.setState({
          list: resp.data,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };

  render() {
    let pagination;
    const {loading, list} = this.state;
    const {mode} = this.props;
    /* eslint prefer-destructuring:0 */
    if (mode === Mode.FLOW) {
      pagination = false;
    } else {
      pagination = {...this.state.pagination, onChange: this.handlePageChange};
    }
    return (
      <div>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={list}
          pagination={pagination}
        />
        <EditTaskModal ref={c => this.editTaskModal = c} onSubmit={this.handleSubmitUpdate}/>
      </div>
    );
  }
}

export default SingleListTable;
