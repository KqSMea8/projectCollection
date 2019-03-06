/**
 * @file TodoListTable.jsx
 * @desc 待办任务 待办列表
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Table, message, Modal} from 'antd';

import {getTodoList} from '../../common/api';
import ListUtil from './ListUtil';
import {TodoTaskStatusText, TaskExeStrategy, TodoTaskStatus, TaskExeContentText} from '../../common/enum';
import TodoDealModal from './TodoDealModal';
import TodoDealResultModal from './TodoDealModal/ResultModal';

class TodoListTable extends React.Component {
  static propTypes = {
    /* eslint react/forbid-prop-types:0 */
    search: PropTypes.object,
  };
  static defaultProps = {
    search: {},
  };

  state = {
    pagination: {
      current: 1,
      total: 0,
      pageSize: 10,
      showTotal: total => `共${total}个记录`,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: next => this.loadList({ next }),
      onShowSizeChange: (current, pageSize) => {
        this.setState({ pagination: { ...this.state.pagination, pageSize, current: 1 } }, this.loadList);
      }
    },
    list: [],
    loading: false
  };

  componentDidMount() {
    this.loadList();
  }

  componentWillReceiveProps(next) {
    this.loadList({search: next.search, next: 1});
  }

  columns = [
    {title: '类型', dataIndex: 'exeContent', render: t => TaskExeContentText[t]},
    {
      title: '主体名称/ID',
      dataIndex: 'bizId',
      render: (t, r) => <div className="kb-table-cell-nl-wrapper"><span>{r.bizName}</span><span>{r.bizId}</span></div>
    },
    {
      title: '执行人',
      dataIndex: 'executors',
      render: (t) => {
        if (t.length > 3) {
          t.splice(3);
          t.push('...');
        }
        return <div className="kb-table-cell-nl-wrapper">{t.map(e => <span key={e}>{e}</span>)}</div>;
      }
    },
    {title: '截止时间', dataIndex: 'deadlineTime', render: value => value && value.replace(/-/g, '/')},
    {
      title: '辅助执行字段',
      width: 250,
      dataIndex: 'property',
      render: (t) => (<div className="kb-table-cell-nl-wrapper">{t && t.map((p, i) => <span key={i}>{p.key}: {p.value}</span>)}</div>)
    },
    {title: '处理人', dataIndex: 'operatorName'},
    {title: '处理时间', dataIndex: 'finishTime'},
    {title: '状态', dataIndex: 'status', render: (t) => TodoTaskStatusText[t]},
    {
      title: '操作',
      dataIndex: '',
      render: (t, r) => {
        const { status, taskExeStrategy, taskPcUrl, bizId, bizName, todoTaskId, pid } = r;
        if (status === TodoTaskStatus.WAITING && taskExeStrategy === TaskExeStrategy.USER_DEF && taskPcUrl) {
          const url = taskPcUrl
            .replace(/{bizId}/g, bizId)
            .replace(/{bizName}/g, encodeURIComponent(bizName))
            .replace(/{todoTaskId}/g, todoTaskId)
            .replace(/{pid}/g, pid);
          return <a href={url} target="_blank">立即处理</a>;
        }
        return (
          <div>
            {r.status === TodoTaskStatus.WAITING && <span className="kb-action-link" onClick={this.handleDealTodo.bind(this, r)}>立即处理</span>}
            {r.status === TodoTaskStatus.COMPLETED && r.feedback && <span className="kb-action-link" onClick={this.viewDealtResult.bind(this, r)}>查看处理结果</span>}
          </div>
        );
      }},
  ];
  loadList = ({next, search} = {}) => {
    const {pagination} = this.state;
    const searchParams = {
      ...ListUtil.composeSearchParams(search || this.props.search),
      pageSize: pagination.pageSize,
      pageNo: next || pagination.current
    };
    this.setState({loading: true});
    getTodoList(searchParams)
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

  handleDealTodo = (data) => {
    const { todoTaskId, taskExeStrategy, taskPcUrl } = data;
    if (taskExeStrategy === TaskExeStrategy.DEFAULT) {
      this.todoDealModal.open(todoTaskId);
    } else {
      if (!taskPcUrl) {
        Modal.info({
          title: '请到钉钉中台处理任务',
          content: '此任务并未配置pc版本的执行流程',
        });
      }
    }
  };

  viewDealtResult = (data) => {
    this.todoDealResultModal.open(data);
  };

  handleSubmitDealOk = () => {
    message.success('处理成功');
    this.loadList();
    this.todoDealModal.close();
  };

  todoDealModal = null;
  todoDealResultModal = null;

  render() {
    const {pagination, list, loading} = this.state;
    return (
      <div>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={list}
          rowKey={r => r.todoTaskId}
          pagination={(list.length >= pagination.total) ? false : pagination}
        />
        <TodoDealModal ref={c => this.todoDealModal = c} onSubmitOk={this.handleSubmitDealOk}/>
        <TodoDealResultModal ref={c => this.todoDealResultModal = c}/>
      </div>
    );
  }
}

export default TodoListTable;
