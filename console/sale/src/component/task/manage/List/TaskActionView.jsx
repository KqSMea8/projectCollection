import React from 'react';
import PropTypes from 'prop-types';
import {EasyTable} from '@alipay/kb-framework-components/lib/frame';

const Actions = EasyTable.Actions;

import { TaskBizType, TaskStatus } from '../../common/enum';

class TaskActionView extends React.PureComponent {
  static propTypes = {
    taskData: PropTypes.object.isRequired,
    bizType: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onDownloadFailureReason: PropTypes.func.isRequired,
    onDownloadExecutionSummary: PropTypes.func.isRequired
  };
  render() {
    const {
      taskData, onDelete, onUpdate, onStop, onDownloadExecutionSummary, onDownloadFailureReason
    } = this.props;
    const { id, status } = taskData;
    const updateAction = {
      title: '修改',
      onClick() {
        onUpdate(id);
      }
    };
    const downloadFailureReasonAction = {
      title: '下载失败原因',
      onClick() {
        onDownloadFailureReason(id);
      }
    };
    const downloadExecutionSummaryAction = {
      title: '下载执行情况',
      onClick() {
        onDownloadExecutionSummary(id);
      }
    };
    const deleteAction = {
      title: '删除',
      onClick() {
        onDelete(id);
      }
    };
    const stopAction = {
      title: '终止',
      onClick() {
        onStop(id);
      }
    };
    let actions = [];
    switch (status) {
    default:
    case TaskStatus.INIT:
      actions = [];
      break;
    case TaskStatus.INIT_FAIL:
      actions = [updateAction, downloadFailureReasonAction, deleteAction];
      break;
    case TaskStatus.PROCESSING:
      actions = [updateAction, downloadExecutionSummaryAction, stopAction];
      break;
    case TaskStatus.PROCESSING_PART_FAIL:
      actions = [updateAction, downloadExecutionSummaryAction, downloadFailureReasonAction, stopAction];
      break;
    case TaskStatus.DEADLINE:
      actions = [downloadExecutionSummaryAction, deleteAction];
      break;
    case TaskStatus.STOP:
      actions = [downloadExecutionSummaryAction, deleteAction];
      break;
    }
    if (this.props.bizType === TaskBizType.CITY && taskData.bizType === TaskBizType.HQ) {
      // 城市端对总部的任务流或者任务是没有修改、终止、删除的权限
      if (actions.indexOf(updateAction) !== -1) actions.splice(actions.indexOf(updateAction), 1);
      if (actions.indexOf(stopAction) !== -1) actions.splice(actions.indexOf(stopAction), 1);
      if (actions.indexOf(deleteAction) !== -1) actions.splice(actions.indexOf(deleteAction), 1);
    }
    return <Actions items={actions} />;
  }
}

export default TaskActionView;
