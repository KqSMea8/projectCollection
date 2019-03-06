import React, {PropTypes} from 'react';
import { message, Modal} from 'antd';
import ajax from '@alipay/kb-framework/framework/ajax';
import MoreActionMixin from '../../../common/MoreActionMixin';
const confirm = Modal.confirm;

/**
 * 推广活动 - 更多操作
 */
const MoreActions = React.createClass({
  propTypes: {
    isCountryTask: PropTypes.bool,
    row: PropTypes.object,
    actions: PropTypes.array,
    onRefresh: PropTypes.func,
    showModal: PropTypes.func,
  },

  mixins: [MoreActionMixin],

  getInitialState() {
    const row = this.props.row;
    this.actionMap = {
      'MODIFY': {
        text: '修改',
        onClick: () => {
          this.props.showModal('EDIT', row);
        },
      },
      'DOWNLOAD_FAIL_REASON': {
        text: '下载失败原因',
        render: () => {
          return (<a href={`${window.APP.kbsalesUrl}/batch/downloadBatchResult.htm?batchNo=${row.batchNo}`}>下载失败原因</a>);
        },
      },
      'DOWNLOAD_TASK_CONDITION': {
        text: '下载任务情况',
        render: () => {
          return (<a href={`/wireless/exportTaskShop.json?categoryCode=${row.taskId}`}>下载任务情况</a>);
        },
      },
      'END_TASK': {
        text: '终止任务',
        render: () => {
          return (<a onClick={() => this.showConfirm('确认终止此任务', row.taskId, 'END_TASK')}>终止任务</a>);
        },
      },
      'DELETE': {
        text: '删除',
        render: () => {
          return (<a onClick={() => this.showConfirm('删除任务', row.taskId, 'OPERATOR_UNDERCARRIAGE')}>删除</a>);
        },
      },
    };
    return {};
  },

  showConfirm(text, taskId, code) {
    const { isCountryTask } = this.props;
    let content = '删除后将无法恢复';
    let url = isCountryTask ? `${window.APP.kbsalesUrl}/shop/delBusinessTaskGroup.json` : `${window.APP.kbsalesUrl}/shop/delBusinessTask.json`;
    if (code === 'END_TASK') {
      content = '终止后，任务将在城市所有小二的待办中隐藏。';
      url = isCountryTask ? `${window.APP.kbsalesUrl}/shop/stopBusinessTaskGroup.json` : `${window.APP.kbsalesUrl}/shop/stopBusinessTask.json`;
    }
    confirm({
      title: `确定要${text}？`,
      content,
      onOk: () => {
        ajax({
          url,
          method: 'get',
          type: 'json',
          data: {taskId},
          success: (res) => {
            if (res && res.status === 'succeed') {
              message.success('操作成功');
              this.props.onRefresh({pageNum: 1, pageSize: 10}, true);
            }
          },
          error: (result) => {
            const res = result && result.result;
            message.error(res.msg || `${text}失败`);
          },
        });
      },
      onCancel: () => {},
    });
  },

  render() {
    const { actions } = this.props;
    return this.renderActions(actions, this.actionMap);
  },
});

export default MoreActions;
