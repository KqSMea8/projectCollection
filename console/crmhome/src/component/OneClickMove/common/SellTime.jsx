/**
 * 商品售卖时间
 */
import React, { PropTypes } from 'react';
import { Form, DatePicker } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import moment from 'moment';

const FormItem = Form.Item;

export default class SellTime extends BaseFormComponent {
  static propTypes = {
    defaultValue: PropTypes.shape({
      salesPeriodStart: PropTypes.any,
    }),
  }

  disabledStartTime = (value) => {
    if (!value) {
      return false;
    }
    // 只能选未来的时间，若已上线的活动，则只能延后
    return value.getTime() < moment(moment().add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').valueOf();
  }
  disabledEndTime = (value) =>{
    return value.getTime() < moment(this.form.getFieldValue('salesPeriodStart')).valueOf();
  }

  get validSalesPeriodStart() {
    const { getFieldProps } = this.form;
    const { field, defaultValue, validTime } = this.props;
    const newRules = [{
      required: true,
      message: '此处必填',
    }];
    if (validTime && validTime.length) {
      newRules.push(
        (rule, value, callback) => {
          if (validTime && validTime[0] && validTime[1]) {
            if (value && moment(value).valueOf() < moment(validTime[0]).valueOf()) {
              callback('售卖开始时间必须大于有效期开始时间');
              return;
            }
          }
        }
      );
    }
    return {...getFieldProps(field.salesPeriodStart, {
      initialValue: defaultValue.salesPeriodStart,
      rules: newRules,
    })};
  }

  get validSalesPeriodEnd() {
    const { getFieldProps } = this.form;
    const { field, defaultValue, validTime } = this.props;
    const newRules = [{
      required: true,
      message: '此处必填',
    }];
    if (validTime && validTime.length) {
      newRules.push(
        (rule, value, callback) => {
          if (validTime && validTime[0] && validTime[1]) {
            if (value && moment(value).valueOf() < moment(validTime[1]).valueOf()) {
              callback('售卖结束时间必须大于有效期结束时间');
              return;
            }
          }
        }
      );
    }
    return {...getFieldProps(field.salesPeriodEnd, {
      initialValue: defaultValue.salesPeriodEnd,
      rules: newRules,
    })};
  }

  render() {
    const { label, required, labelCol, wrapperCol, extra, pickerFormat} = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={<p>{extra}</p>}
      >
      <DatePicker
        showTime
        format={pickerFormat}
        disabledDate={this.disabledStartTime}
        {...this.validSalesPeriodStart}
        />
        <span style={{display: 'inline-block', margin: '0 2px'}}> ~ </span>
        <DatePicker
          showTime
          format={pickerFormat}
          disabledDate={this.disabledEndTime}
          {...this.validSalesPeriodEnd}
        />
      </FormItem>
    );
  }
}
