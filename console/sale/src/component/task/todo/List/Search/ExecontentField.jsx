import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from 'antd';
import noop from 'lodash/noop';

import { TaskExeContent, TaskExeContentText } from '../../../common/enum';

const ValueProps = {
  exeContent: PropTypes.oneOf([TaskExeContent.SHOP, TaskExeContent.LEADS, TaskExeContent.MERCHANT]),
  bizName: PropTypes.string,
};

class ExecontentField extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.shape(ValueProps),
    value: PropTypes.shape(ValueProps),
    onChange: PropTypes.func,
  };
  static defaultProps = {
    defaultValue: {
      exeContent: TaskExeContent.SHOP,
      bizName: ''
    },
    onChange: noop,
  };
  handleExecontentChange = (exeContent) => {
    this.props.onChange({
      ...this.props.value,
      exeContent,
    });
  };
  handleBizNameChange = (e) => {
    const bizName = e.target.value;
    this.props.onChange({
      ...this.props.value,
      bizName,
    });
  };
  render() {
    const value = this.props.value || this.props.defaultValue;
    const { exeContent, bizName } = value;
    return (
      <div>
        <Select style={{width: 80}} value={exeContent} onChange={this.handleExecontentChange}>
          {Object.keys(TaskExeContent).map(k => (
            <Select.Option key={TaskExeContent[k]} value={TaskExeContent[k]}>{TaskExeContentText[TaskExeContent[k]]}</Select.Option>
          ))}
        </Select>
        <Input style={{width: 160, marginLeft: 8}} value={bizName} placeholder={`请输入${TaskExeContentText[exeContent]}名称`} onChange={this.handleBizNameChange} />
      </div>
    );
  }
}

export default ExecontentField;
