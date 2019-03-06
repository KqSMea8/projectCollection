import React from 'react';
import { Form, Input } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;

export default class InputComponent extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string.isRequired,
  }
  static defaultProps = {
    defaultValue: '',
    rules: [],
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field } = this.props;
    const rules = [...this.props.rules];
    if (this.props.required) {
      rules.push({
        required: true, message: `请填写${this.props.label}`,
      });
    }
    return getFieldProps(field, {
      initialValue: defaultValue,
      rules,
    });
  }

  render() {
    const { label, placeholder, extra, required, labelCol, wrapperCol, disabled, type, secondCardExtra } = this.props;
    const {getFieldValue} = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <FormItem style={{display: 'inline-block', width: '100%'}}>
          <Input
            placeholder={placeholder}
            type={type}
            {...this.fieldProps}
            disabled={disabled}
          />
        </FormItem>
        {secondCardExtra && getFieldValue('verifyFrequency') === 'multi' ? <div style={{color: '#f50'}}>{secondCardExtra}</div> : ''}
        <p style={{lineHeight: '16px', color: '#999'}}>{extra}</p>
      </FormItem>
    );
  }
}
