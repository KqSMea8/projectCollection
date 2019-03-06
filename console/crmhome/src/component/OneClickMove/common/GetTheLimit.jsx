/**
 * 领取限制/每日领取限制
 */
import React, { PropTypes } from 'react';
import { Form, InputNumber, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import classnames from 'classnames';

const FormItem = Form.Item;
const Option = Select.Option;
export default class GetTheLimit extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    max: PropTypes.number,
    field: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
    defaultValue: PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.number,
    }),
    rules: PropTypes.shape({
      type: PropTypes.array,
      value: PropTypes.array,
    }),
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    max: 99999999,
    defaultValue: {
      type: '0',
      value: 1,
    },
    daily: false, // 领取限制/每日领取限制
    label: '领取限制',
    rules: {
      type: [],
      value: [],
    },
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, rules, defaultValue } = this.props;
    return getFieldProps(field.value, {
      initialValue: defaultValue.value,
      rules: rules.value || [],
    });
  }
  get amountLimitedProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field.type, {
      initialValue: defaultValue.type,
      rules: rules.type,
    });
  }

  render() {
    const { label, placeholder, required, labelCol, wrapperCol, max, extra, field, daily } = this.props;
    const { getFieldValue, getFieldError } = this.form;
    const err = getFieldError(field.type) || getFieldError(field.value) || undefined;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
        help={err}
        validateStatus={
          classnames({
            error: err,
          })
        }
      >
        <Select {...this.amountLimitedProps} placeholder="请选择">
          <Option value="0">不限制</Option>
          <Option value="1">{daily ? '设定每人每日领取张数' : '设定每人领取总张数'}</Option>
        </Select>
        {getFieldValue(field.type) === '1' && (
          <div style={{ marginTop: 10 }}>
            <InputNumber size="large" style={{ width: 200 }}
              placeholder={placeholder}
              {...this.fieldProps}
              min={0} max={max} step="1"
            />
            <span style={{ padding: '0px 8px' }}>{daily ? '张/人/日' : '张/人'}</span>
          </div>
        )}
      </FormItem>
    );
  }
}
