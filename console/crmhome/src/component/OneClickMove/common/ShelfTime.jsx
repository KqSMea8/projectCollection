/**
 * 上架时间
 */
import React from 'react';
import { Form, DatePicker } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import moment from 'moment';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

function disabledTime(value) {
  if (!value) {
    return false;
  }
  return value.getTime() < moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').toDate();
}
export default class ShelfTime extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string,
    field: React.PropTypes.string.isRequired,
    cycle: React.PropTypes.number.isRequired,
    rules: React.PropTypes.array,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    cycle: 90,
    defaultValue: moment(moment().format('YYYY-MM-DD') + ' 00:00', 'YYYY-MM-DD HH:mm').toDate(),
    label: '上架时间',
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, defaultValue, cycle, rules } = this.props;
    return getFieldProps(field, {
      initialValue: [defaultValue, moment(moment().add(cycle, 'days').format('YYYY-MM-DD') + ' 23:59', 'YYYY-MM-DD HH:mm').toDate()],
      rules,
    });
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        extra={extra}
        wrapperCol={wrapperCol}
      >
        <RangePicker
          disabledDate={disabledTime}
          format="yyyy-MM-dd HH:mm"
          showTime
          {...this.fieldProps}
        />
      </FormItem>
    );
  }
}
