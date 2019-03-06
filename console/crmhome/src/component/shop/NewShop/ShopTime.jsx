import React, {PropTypes} from 'react';
import {Form, Checkbox, TimePicker, Icon, Select} from 'antd';
import {padding} from '../../../common/dateUtils';
import ShopTimeUtil from '../common/shopTimeUtil';

const FormItem = Form.Item;

const MAX_COUNT = 2;
const TIME_PATTERN = 'HH:mm';

export function formatTime(d) {
  return d && typeof d !== 'string' ? (padding(d.getHours()) + ':' + padding(d.getMinutes())) : d;
}

const ALL_WEAKS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
export const ShopTimeItem = React.createClass({
  propTypes: {
    time: PropTypes.string, // 格式: 1-5 08:00-22:00
    onChange: PropTypes.func, // 参数 times 同上
    style: PropTypes.any,
    onDelete: PropTypes.func,
    showDeleteIcon: PropTypes.bool,
  },
  getInitialState() {
    const time = this.props.time;
    const values = ShopTimeUtil.parseTimeString(time) || [];
    const allDayHourChecked = ShopTimeUtil.isTimeValuesAllDay(values);
    return {
      weekStart: `${values[0] || 1}`,
      weekEnd: `${values[2] || 7}`,
      timeHourStart: `${padding((!allDayHourChecked && values[3]) || 8)}`,
      timeMinStart: `${padding((!allDayHourChecked && values[4]) || 0)}`,
      timeHourEnd: `${padding((!allDayHourChecked && values[6]) || 18)}`,
      timeMinEnd: `${padding((!allDayHourChecked && values[7]) || 0)}`,
      allDayHourChecked,
    };
  },
  fireOnChange() {
    if (this.props.onChange) {
      const state = this.state;
      const hourMinPart = state.allDayHourChecked ? '00:00-23:59' : `${state.timeHourStart}:${state.timeMinStart}-${state.timeHourEnd}:${state.timeMinEnd}`;
      this.props.onChange(`${state.weekStart}-${state.weekEnd} ${hourMinPart}`);
    }
  },
  render() {
    const state = this.state;
    return (<FormItem
      style={this.props.style}
      help>
      <Select
        style={{ width: 60, verticalAlign: 'bottom' }}
        value={state.weekStart}
        onSelect={(value) => {
          const newWeekEnd = value > state.weekEnd ? value : state.weekEnd;
          this.setState({
            weekStart: value,
            weekEnd: newWeekEnd,
          }, () => {
            this.fireOnChange();
          });
        }}
      >
        {ALL_WEAKS.map((weak, index) => (<Select.Option key={weak} value={index + 1 + ''}>{weak}</Select.Option>))}
      </Select>
      <div style={{display: 'inline-block', width: 20, textAlign: 'center'}}>-</div>
      <Select
        style={{ width: 60, verticalAlign: 'bottom' }}
        value={state.weekEnd}
        onSelect={(value) => {
          const newWeekStart = value < state.weekStart ? value : state.weekStart;
          this.setState({
            weekStart: newWeekStart,
            weekEnd: value,
          }, () => {
            this.fireOnChange();
          });
        }}
      >
        {ALL_WEAKS.slice(parseInt(state.weekStart, 10) - 1).map((weak, index) => (
          <Select.Option key={weak} value={index + parseInt(state.weekStart, 10) + ''}>{weak}</Select.Option>
        ))}
      </Select>
      <div style={{display: 'inline-block', width: 10}}></div>
      <TimePicker
        value={`${state.timeHourStart}:${state.timeMinStart}`}
        disabled={state.allDayHourChecked}
        onChange={(date) => {
          this.setState({
            timeHourStart: padding(date.getHours()),
            timeMinStart: padding(date.getMinutes()),
          }, () => {
            this.fireOnChange();
          });
        }}
        format={TIME_PATTERN}
      />
      <div style={{display: 'inline-block', width: 20, textAlign: 'center'}}>
        <p className="ant-form-split">-</p>
      </div>
      <TimePicker
        value={`${state.timeHourEnd}:${state.timeMinEnd}`}
        disabled={state.allDayHourChecked}
        onChange={(date) => {
          this.setState({
            timeHourEnd: padding(date.getHours()),
            timeMinEnd: padding(date.getMinutes()),
          }, () => {
            this.fireOnChange();
          });
        }}
        format={TIME_PATTERN}
      />
      <Checkbox
        style={{marginLeft: 8}}
        checked={state.allDayHourChecked}
        onChange={(e) => {
          this.setState({
            allDayHourChecked: e.target.checked,
          }, () => {
            this.fireOnChange();
          });
        }}
      >24小时营业</Checkbox>
      {this.props.showDeleteIcon ? (<Icon
          type="cross-circle-o"
          onClick={this.props.onDelete}
          style={{marginLeft: 8, fontSize: 14, verticalAlign: 'middle', cursor: 'pointer'}}
        />) : null }
    </FormItem>);
  },
});

let keyGenerator = 1;
const ShopTime = React.createClass({
  propTypes: {
    times: PropTypes.string,
    onChange: PropTypes.func,
  },
  getInitialState() {
    const times = this.props.times && this.props.times.split(',').map((time) => ({
      key: keyGenerator++,
      time,
    }));
    return {
      times: times || [],
    };
  },
  fireOnChange(times) {
    if (this.props.onChange) {
      const timeString = times.map((time) => (time.time)).join(',');
      this.props.onChange(timeString);
    }
  },
  addTime() {
    const times = this.state.times;
    let lastTimeWeekEnd = '1';
    try {
      if (times && times.length) {
        lastTimeWeekEnd = times[times.length - 1].time[2] || '1';
        lastTimeWeekEnd = Math.min(parseInt(lastTimeWeekEnd, 10) + 1, 7);
      }
    } catch (e) {
      // console.log(e);
    }
    times.push({
      key: keyGenerator++,
      time: `${lastTimeWeekEnd}-7 08:00-18:00`,
    });
    this.setState({ times });
    this.fireOnChange(times);
  },
  removeTime(key) {
    const times = this.state.times;
    for (let i = 0, length = times.length; i < length; i++) {
      const time = times[i];
      if (time.key === key) {
        times.splice(i, 1);
        break;
      }
    }
    this.setState({ times });
    this.fireOnChange(times);
  },
  isChooseTimesCrossed() {
    return ShopTimeUtil.checkCross(...this.state.times.map((time) => (time.time)));
  },
  render() {
    const times = this.state.times;
    const canAdd = times.length < MAX_COUNT;

    return (<FormItem
      label="营业时段："
      labelCol={{span: 4}}
      wrapperCol={{span: 20}}
      help={(<div style={{ padding: '4px 0' }}>
        {this.isChooseTimesCrossed() ? <div style={{ color: '#f50' }}>多个营业时间之间不能有交叉，请检查</div> : null}
        <a style={{ marginRight: 12, color: canAdd ? undefined : '#999' }}
          onClick={() => {
            if (canAdd) {
              this.addTime();
            }
          }}>
          增加营业时间
        </a>
        支持增加至{MAX_COUNT}个营业时间段
      </div>)}
      className="__fix-ant-time-picker"
    >
      {times.map((time, index)=> (
        <ShopTimeItem
          key={time.key}
          style={{marginTop: 8}}
          time={time.time}
          onChange={(timeValue) => {
            times.splice(index, 1, {
              key: time.key,
              time: timeValue,
            });
            this.setState({ times });
            this.fireOnChange(times);
          }}
          showDeleteIcon
          onDelete={() => {
            times.splice(index, 1);
            this.setState({ times });
            this.fireOnChange(times);
          }}
        />
      ))}
    </FormItem>);
  },
});

export default ShopTime;
