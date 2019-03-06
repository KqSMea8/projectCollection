import React from 'react';
import { Form, DatePicker } from 'antd';
import classnames from 'classnames';
import FormItemBase from '../../Exchange/items/FormItemBase';
import moment from 'moment';

const FormItem = Form.Item;
const START_TIME = 'startTime';
const END_TIME = 'endTime';
const now = moment();

class OnlineTimeItem extends FormItemBase {
  static displayName = 'exchange-online-time';
  constructor(props, ctx) {
    super(props, ctx);
  }
  static fieldName = {
    START_TIME, END_TIME,
  };
  disabledActivityTime = (value) => {
    if (!value) {
      return false;
    }
    // 只能选未来的时间，若已上线的活动，则只能延后
    return value.getTime() < moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').valueOf() ||
      (this.isOnline && value.getTime() < this.initialValue[END_TIME].valueOf());
  }

  checkData = (rule, value, callback) => {
    const {getFieldValue, validateFields} = this.props.form;
    const startTime = getFieldValue(START_TIME);
    const diff = moment(value).diff(moment(startTime), 'y');
    if (diff >= 10) {
      return callback(new Error('活动时间跨度必须小于 10 年'));
    }
    const mStartTime = moment(startTime);
    const mEndTime = moment(value);
    if (!moment([mStartTime.year(), mStartTime.month(), mStartTime.date(), mStartTime.hour(), mStartTime.minute()])
      .isBefore(moment([mEndTime.year(), mEndTime.month(), mEndTime.date(), mEndTime.hour(), mEndTime.minute()]))) {
      return callback(new Error('上架开始时间必须小于上架结束时间'));
    }
    validateFields(['validTimeType'], { force: true });
    callback();
  }

  get initialValue() {
    const initialData = this.props.initialData || {};
    const endMonth = this.props.end || 1;
    return {
      [START_TIME]: initialData[START_TIME] ? moment(initialData[START_TIME], 'YYYY-MM-DD HH:mm').toDate() :
        new Date(now.year(), now.month(), now.date(), 0, 0),
      [END_TIME]: initialData[END_TIME] ? moment(initialData[END_TIME], 'YYYY-MM-DD HH:mm').toDate() :
        new Date(now.year(), now.month() + endMonth, now.date(), 23, 59),
    };
  }

  render() {
    const { getFieldProps, getFieldError, validateFields } = this.props.form;
    const { initData } = this.props;
    return (
      <FormItem {...this.itemLayout}
        label="上架时间："
        required
        validateStatus={
          classnames({
            error: !!getFieldError(END_TIME),
          })}
        help={getFieldError(END_TIME)}
      >
        <DatePicker
          disabled={this.isOnline}
          style={{ width: '130px' }}
          showTime
          format="yyyy-MM-dd HH:mm"
          disabledDate={this.disabledActivityTime}
          {...getFieldProps(START_TIME, { // 上架开始时间
            getValueFromEvent: (date) => date,
            validateTrigger: 'onChange',
            initialValue: initData.bsnParams ? new Date(initData.bsnParams.startTime) : this.initialValue[START_TIME],
            rules: [{
              required: true, type: 'date', message: '请填写上架开始时间',
            }, (r, v, c) => {
              validateFields([END_TIME], { force: true });
              c();
            }],
          }) } />
        <span style={{ margin: '0 5px' }}> - </span>
        <DatePicker
          style={{ width: '130px' }}
          showTime
          format="yyyy-MM-dd HH:mm"
          disabledDate={this.disabledActivityTime}
          {...getFieldProps(END_TIME, { // 上架结束时间
            getValueFromEvent: (date) => date,
            validateTrigger: 'onChange',
            initialValue: initData.bsnParams ? new Date(initData.bsnParams.endTime) : this.initialValue[END_TIME],
            rules: [{
              required: true, type: 'date', message: '请填写上架结束时间',
            }, this.checkData],
          }) } />
      </FormItem>
    );
  }
}

export default OnlineTimeItem;
