/**
 * 发放总量
 */
import React, { PropTypes } from 'react';
import { Form, InputNumber } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;

export default class InputTotal extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    max: PropTypes.number,
  }
  static defaultProps = {
    label: '发放总量',
    max: 99999999,
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field, {
      initialValue: defaultValue,
      rules,
    });
  }

  render() {
    const { label, placeholder, required, labelCol, wrapperCol, max, extra, disabled } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
      >
        <InputNumber style={{ width: '100%' }}
          placeholder={placeholder}
          disabled={disabled}
          {...this.fieldProps}
          min={0} max={max} step="1"
        />
      </FormItem>
    );
  }
}
