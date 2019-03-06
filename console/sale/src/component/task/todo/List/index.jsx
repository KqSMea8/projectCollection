import React from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import { Page, PageNoAuth } from '@alipay/kb-framework-components';

import TaskTypeRadioButton from '../../common/TaskTypeRadioButton';
import { TaskType } from '../../common/enum';
import './style.less';

import SingleList from './SingleList';
import FlowList from './FlowList';

class List extends React.Component {
  state = {
    taskType: TaskType.SINGLE
  };
  handleTypeChange = (taskType) => {
    this.setState({ taskType });
  };
  render() {
    if (!permission('TODO_TASK_QUERY')) {
      return <PageNoAuth authCodes={['TODO_TASK_QUERY']}/>;
    }
    const { taskType } = this.state;
    return (
      <Page title="待办任务">
        <TaskTypeRadioButton value={taskType} onChange={this.handleTypeChange} />
        {
          taskType === TaskType.SINGLE
            ?
              <SingleList />
            :
              <FlowList />
        }
      </Page>
    );
  }
}

export default List;
