/**
 * 券面额
 */
import React, { PropTypes } from 'react';
import { InputNumber, Form } from 'antd';
import { pick } from 'lodash';
import Base from './BaseFormComponent';

const FormItem = Form.Item;

export default class CouponValue extends Base {
  static propTypes = {
    ...Base.propTypes,
    max: PropTypes.number,
  }

  static defaultProps = {
    ...Base.defaultProps,
    label: '券面额',
    rules: [],
  }

  get fieldProps() {
    const rules = [];
    if (this.props.required) {
      rules.push({
        required: true, message: '请填写',
      });
    }
    return this.form.getFieldProps(this.props.field, {
      rules: rules.concat(this.props.rules),
      normalize: (v = '') => v.toString(),
    });
  }

  render() {
    const fmProps = pick(this.props, ['label', 'placeholder', 'required', 'labelCol', 'wrapperCol', 'extra']);
    return (
      <FormItem
        {...fmProps}
      >
        <InputNumber step={0.1} max={this.props.max} {...this.fieldProps} /> 元
      </FormItem>
    );
  }
}
