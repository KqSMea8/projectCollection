import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { TaskBizType, TaskType } from '../../common/enum';
import TaskTypeRadioButton from '../../common/TaskTypeRadioButton';
import SingleList from './SingleList';
import FlowList from './FlowList';

class ListFactory extends React.Component {
  constructor(props) {
    super();
    this.state = {
      taskType: props.taskType || TaskType.SINGLE
    };
  }

  handleTaskTypeChange = (value) => {
    this.setState({
      taskType: value,
    });
  };
  render() {
    const { taskType } = this.state;
    const { bizType } = this.props;
    return (
      <div>
        <Alert message={bizType === TaskBizType.CITY ? '创建任务后，电脑端T+1天、移动端实时做展示' : '创建任务后，电脑端、移动端实时做展示'} type="info" showIcon />
        <TaskTypeRadioButton value={taskType} onChange={this.handleTaskTypeChange} />
        {taskType === TaskType.SINGLE && <SingleList bizType={bizType} taskType={taskType} />}
        {taskType === TaskType.FLOW && <FlowList bizType={bizType} taskType={taskType} />}
      </div>
    );
  }
}

ListFactory.propTypes = {
  bizType: PropTypes.oneOf([
    TaskBizType.CITY, TaskBizType.HQ, TaskBizType.TKA
  ])
};

ListFactory.defaultProps = {
  bizType: TaskBizType.CITY
};

export default ListFactory;
