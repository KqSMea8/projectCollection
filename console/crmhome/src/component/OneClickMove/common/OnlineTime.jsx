import React, { PropTypes } from 'react';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import Base from './BaseFormComponent';
import { pick } from 'lodash';

const FormItem = Form.Item;
const now = moment();

export default class OnlineTimeItem extends Base {
  static propTypes = {
    ...Base.propTypes,
    field: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }).isRequired,
    disabled: PropTypes.shape({
      start: PropTypes.bool,
      end: PropTypes.bool,
    }),
    span: PropTypes.shape({
      day: PropTypes.number,
      month: PropTypes.number,
    }),
    format: PropTypes.string,
  }
  static defaultProps = {
    ...Base.defaultProps,
    label: '上架时间',
    disabled: {
      start: false,
      end: false,
    },
    rules: {
      start: [],
      end: [],
    },
    span: {
      day: 0,
      month: 3,
    },
    format: 'YYYY-MM-DD HH:mm',
  }

  disabledActivityTime = (value) => {
    if (!value) {
      return false;
    }

    // 只能选未来的时间，若已上线的活动，则只能延后
    return value.getTime() < moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').valueOf() ||
      (this.isOnline && value.getTime() < this.initialValue[this.props.field.end].valueOf());
  }

  checkData = (rule, value, callback) => {
    const { start } = this.props.field;
    const { getFieldValue } = this.form;
    const startTime = getFieldValue(start);
    const diff = moment(value).diff(moment(startTime), 'y');
    if (diff >= 1) {
      return callback(new Error('活动时间最长可设置1年'));
    }
    const mStartTime = moment(startTime);
    const mEndTime = moment(value);
    if (!moment([mStartTime.year(), mStartTime.month(), mStartTime.date(), mStartTime.hour(), mStartTime.minute()])
      .isBefore(moment([mEndTime.year(), mEndTime.month(), mEndTime.date(), mEndTime.hour(), mEndTime.minute()]))) {
      return callback(new Error('上架开始时间必须小于上架结束时间'));
    }
    callback();
  }

  get initialValue() {
    const { end, start } = this.props.field;
    const { getFieldValue } = this.form;
    let startValue = getFieldValue(start);
    let endValue = getFieldValue(end);
    if (startValue) {
      startValue = moment(getFieldValue(start), 'YYYY-MM-DD HH:mm').toDate();
    } else if (startValue === null) {
      // null 不作处理
    } else if (startValue === undefined) {
      startValue = new Date(now.year(), now.month(), now.date());
    }
    if (endValue) {
      endValue = moment(getFieldValue(end), 'YYYY-MM-DD HH:mm').toDate();
    } else if (endValue === null) {
      // null 不作处理
    } else if (endValue === undefined) {
      endValue = new Date(now.year(), now.month() + (this.props.span.month || 0), now.date() + (this.props.span.day || 0), 23, 59);
    }
    return {
      [start]: startValue,
      [end]: endValue,
    };
  }

  render() {
    const { getFieldProps, getFieldError, validateFields } = this.form;
    const { start, end } = this.props.field;
    const initialValue = this.initialValue;
    const fmProps = pick(this.props, ['label', 'extra', 'required', 'labelCol', 'wrapperCol']);
    const startProps = {...getFieldProps(start, { // 上架开始时间
      getValueFromEvent: (date) => date,
      validateTrigger: 'onChange',
      initialValue: moment(initialValue[start]).format(this.props.format),
      rules: [{
        required: true, message: '请填写上架开始时间',
      }, (r, v, c) => {
        validateFields([end], { force: true });
        c();
      }, ...(this.props.rules.start || [])],
      normalize: v => {
        if (!v) return null;
        return moment(v).format(this.props.format);
      },
    }), value: initialValue[start] ? moment(initialValue[start], this.props.format).toDate() : null };

    const endProps = {...getFieldProps(end, { // 上架结束时间
      getValueFromEvent: (date) => date,
      validateTrigger: 'onChange',
      initialValue: moment(initialValue[end]).format(this.props.format),
      rules: [{
        required: true, message: '请填写上架结束时间',
      }, this.checkData, ...(this.props.rules.end || [])],
      normalize: v => {
        if (!v) return null;
        return moment(v).format(this.props.format);
      },
    }), value: initialValue[end] ? moment(initialValue[end], this.props.format).toDate() : null };

    return (
      <FormItem
        {...fmProps}
        validateStatus={getFieldError(end) ? 'error' : 'success'}
        help={this.props.help || getFieldError(end)}
      >
        <DatePicker
          disabled={this.props.disabled.start}
          style={{ width: '130px' }}
          showTime
          format="yyyy-MM-dd HH:mm"
          disabledDate={this.disabledActivityTime}
          {...startProps}
        />
        <span style={{ margin: '0 5px' }}> - </span>
        <DatePicker
          disabled={this.props.disabled.end}
          style={{ width: '130px' }}
          showTime
          format="yyyy-MM-dd HH:mm"
          disabledDate={this.disabledActivityTime}
          {...endProps}
        />
      </FormItem>
    );
  }
}
