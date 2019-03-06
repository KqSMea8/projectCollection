import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import noop from 'lodash/noop';

import { TaskType, TaskTypeText } from './enum';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const TaskTypeRadioButton = (props) => {
  function handleChange(e) {
    props.onChange(e.target.value);
  }
  return (
    <RadioGroup onChange={handleChange} value={props.value}>
      <RadioButton value={TaskType.SINGLE}>{TaskTypeText[TaskType.SINGLE]}</RadioButton>
      <RadioButton value={TaskType.FLOW}>{TaskTypeText[TaskType.FLOW]}</RadioButton>
    </RadioGroup>
  );
};

TaskTypeRadioButton.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf([TaskType.SINGLE, TaskType.FLOW])
};

TaskTypeRadioButton.defaultProps = {
  onChange: noop,
  value: TaskType.SINGLE
};

export default TaskTypeRadioButton;
