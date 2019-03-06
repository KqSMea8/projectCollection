import React from 'react';
import PropTypes from 'prop-types';
import { Radio, DatePicker, InputNumber, Popover, Icon } from 'antd';
import moment from 'moment';

export default class DeadlineTimeField extends React.Component {

  static propTypes = {
    value: PropTypes.object, // {timeType: 'relative|absolute', days: 2, absoluteTime: '2018-04-11'}
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onValidate: PropTypes.func, // 调用后触发 rc-form 的校验
  };

  static defaultProps = {
    value: {},
  };

  componentDidMount() {
    if (!this.props.value || !this.props.value.timeType) {
      this.props.onChange({ timeType: 'absolute' });
    }
  }

  componentWillReceiveProps(next) {
    if (!next.value || !next.value.timeType) {
      this.props.onChange({ timeType: 'absolute' });
    }
  }

  absolutePopover = (
    <Popover content="任务中的所有门店/商户到达选择日期后，全部停止处理">
      <Icon type="question-circle-o" />
    </Popover>
  );

  relativePopover = (
    <Popover content="任务中追加的门店/商户到达“创建任务当天+处理天数”日期后，停止处理">
      <Icon type="question-circle-o" />
    </Popover>
  );

  static validate(rule, value, callback) {
    if (!value) {
      callback('请选择截止时间');
      return;
    }
    if (value.timeType === 'relative' && !value.days) {
      callback('请输入处理天数');
      return;
    }
    if (value.timeType === 'absolute' && !value.absoluteTime) {
      callback('请选择截止时间');
      return;
    }
    callback();
  }

  static deadlineTimeDisabledDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0);
    return date.getTime() < (today.getTime() + 24 * 60 * 60 * 1000);
  }

  handleRadioChange = e => {
    this.props.onChange({
      ...this.props.value,
      timeType: e.target.value,
    });
  };

  handleDaysChange = value => {
    const newValue = {
      ...this.props.value,
      days: value,
    };
    this.props.onChange();
    if (this.props.onValidate) this.props.onValidate(newValue);
  };

  handleAbsoluteDateChange = value => {
    const newValue = {
      ...this.props.value,
      absoluteTime: value && moment(value).format('YYYY-MM-DD'),
    };
    this.props.onChange(newValue);
    if (this.props.onValidate) this.props.onValidate(newValue);
  };

  render() {
    const { disabled, value } = this.props;
    const { timeType, days, absoluteTime } = (value || {});

    return (<div>
      <Radio.Group disabled={disabled} value={timeType} onChange={this.handleRadioChange}>
        <Radio value="absolute" key="absolute">绝对截止时间 {this.absolutePopover}</Radio>
        <Radio value="relative" key="relative">相对处理时间 {this.relativePopover}</Radio>
      </Radio.Group>
      {timeType === 'absolute' && (<div>
        <DatePicker
          value={absoluteTime}
          disabledDate={DeadlineTimeField.deadlineTimeDisabledDate}
          disabled={disabled}
          onChange={this.handleAbsoluteDateChange}
        />
        <span> 截止到当天的23:59:59</span>
      </div>)}
      {timeType === 'relative' && (<div>
        <InputNumber
          placeholder="请输入处理天数"
          value={days}
          disabled={disabled}
          onChange={this.handleDaysChange}
          style={{width: 160}}
        />
        <span>天，截止到当天的23:59:59</span>
      </div>)}
    </div>);
  }
}
