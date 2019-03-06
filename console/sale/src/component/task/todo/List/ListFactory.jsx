import React from 'react';
import PropTypes from 'prop-types';

import { TaskBizType, TaskType } from '../../common/enum';
import TaskTypeRadioButton from '../../common/TaskTypeRadioButton';
import SingleList from './SingleList';
import FlowList from './FlowList';

class ListFactory extends React.Component {
  state = {
    taskType: TaskType.SINGLE,
  };

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
        <TaskTypeRadioButton value={taskType} onChange={this.handleTaskTypeChange} />
        {taskType === TaskType.SINGLE
          ?
            <SingleList bizType={bizType} />
          :
            <FlowList bizType={bizType} />
        }
      </div>
    );
  }
}

ListFactory.propTypes = {
  bizType: PropTypes.oneOf([TaskBizType.CITY, TaskBizType.HQ, TaskBizType.TKA])
};

ListFactory.defaultProps = {
  bizType: TaskBizType.CITY
};

export default ListFactory;
