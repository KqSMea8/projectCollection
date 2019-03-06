import React, {Component} from 'react';
import { Icon, Table } from 'antd';
import { keyMirror } from '../../../../../common/TypeUtils';
import { BATCH_CODE_DOWNLOAD, DOWNLOAD_WINDOW_READY } from '../../common/constants';
import {appendOwnerUrlIfDev} from '../../../../../common/utils';
import ajax from 'Utility/ajax';
import noop from 'lodash/noop';
import './index.less';

const TASK_STATUS = keyMirror({
  INIT: null,
  RUNNING: null,
  DONE: null,
  ERROR: null,
});

const TASK_STATUS_TEXT = {
  [TASK_STATUS.INIT]: '初始化',
  [TASK_STATUS.RUNNING]: '正在生成数据，请稍候再操作',
  [TASK_STATUS.DONE]: '数据处理完毕，请下载',
  [TASK_STATUS.ERROR]: '数据生成失败',
};

const POLLING_INTERVAL = 5; // 轮询间隔，单位s

class BatchCodeDownload extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    taskMap: {},
  };

  componentWillMount() {
    window.addEventListener('message', this.handleReceiveMessage, false);
    window.addEventListener('beforeunload', this.handleBeforeUnload, false);
  }

  componentDidMount() {
    window.opener.postMessage({type: DOWNLOAD_WINDOW_READY}, location.origin);
  }

  getFileUrl = batchId => {
    const task = this.state.taskMap[batchId];
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: {
        mappingValue: 'kbasset.unbindAsyncDownloadQuery',
        itemFlowId: task.itemFlowId,
      },
      type: 'json',
      error: noop, // 阻止系统报错
    }).then(res => {
      clearInterval(task.pollingId);
      this.setState({
        taskMap: {
          ...this.state.taskMap,
          [batchId]: {
            ...task,
            status: TASK_STATUS.DONE,
            fileUrl: res.data,
          },
        },
      });
    });
  };

  submitApplyDownload = batchId => {
    return ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: {
        mappingValue: 'kbasset.unbindAsyncDownload',
        batchId
      },
      type: 'json',
    });
  };

  createPolling = batchId => {
    const task = this.state.taskMap[batchId];
    const pollingId = setInterval(() => {
      if (task.status === TASK_STATUS.RUNNING) {
        this.getFileUrl(batchId);
      }
    }, POLLING_INTERVAL * 1000);
    this.setState({
      taskMap: {
        ...this.state.taskMap,
        [batchId]: {
          ...task,
          pollingId
        }
      }
    });
  };

  handleReceiveMessage = e => {
    const data = e.data;
    const { taskMap } = this.state;
    const { batchId, type } = data;
    if (type && type === BATCH_CODE_DOWNLOAD) {
      if (!(batchId in taskMap)) {
        const task = this.createTask(batchId);
        this.setState({
          taskMap: {
            ...taskMap,
            [batchId]: task,
          }
        });
      }
    }
  };

  handleBeforeUnload = e => {
    e.preventDefault();
  };

  createTask(batchId) {
    this.submitApplyDownload(batchId)
    .then(res => {
      const task = this.state.taskMap[batchId];
      this.setState({
        taskMap: {
          ...this.state.taskMap,
          [batchId]: {
            ...task,
            status: TASK_STATUS.RUNNING,
            itemFlowId: res.data,
          }
        }
      });
      this.createPolling(batchId);
    })
    .catch(() => {
      const task = this.state.taskMap[batchId];
      this.setState({
        taskMap: {
          ...this.state.taskMap,
          [batchId]: {
            ...task,
            status: TASK_STATUS.ERROR,
          }
        }
      });
    });
    return {
      pollingId: null,
      batchId,
      itemFlowId: '',
      status: TASK_STATUS.INIT,
      fileUrl: '',
    };
  }

  componentWillUnMount() {
    window.removeEventListener('message', this.handleReceiveMessage, false);
    window.removeEventListener('beforeunload', this.handleBeforeUnload, false);
  }

  columns = [
    {
      title: '批次号',
      dataIndex: 'batchId',
    },
    {
      title: '生成状态',
      dataIndex: 'status',
      render: value => TASK_STATUS_TEXT[value],
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: (value, record) => {
        return (
          <span>{record.status === TASK_STATUS.DONE
          ? <a target="_blank" href={record.fileUrl}>下载<Icon type="download"/></a>
          : null}
          </span>
        );
      }
    },
  ];

  render() {
    const { taskMap } = this.state;
    const taskList = Object.keys(taskMap).map(id => taskMap[id]);
    return (
      <div>
        <div className="app-detail-header">打包下载码</div>
        <div className="app-detail-content-padding">
          <Table dataSource={taskList} columns={this.columns}/>
        </div>
      </div>
    );
  }
}
export default BatchCodeDownload;
