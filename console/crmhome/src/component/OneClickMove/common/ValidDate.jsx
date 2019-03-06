import React from 'react';
import { Form, InputNumber } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const TABLE_CELL = { display: 'table-cell' };
export default class ValidDate extends BaseFormComponent {
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field, {
      initialValue: defaultValue,
      rules,
    });
  }
  get fieldProps2() {
    const { getFieldProps } = this.form;
    const { defaultValue2, field2, rules2 } = this.props;
    return getFieldProps(field2, {
      initialValue: defaultValue2,
      rules2,
    });
  }

  render() {
    const { getFieldValue, getFieldProps } = this.form;
    const { label, extra, required, labelCol, wrapperCol, typeField } = this.props;
    if ( getFieldValue([typeField]) === 'FIXED') {
      return (
        <FormItem
          label={label}
          required={required}
          extra={extra}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          <input type="hidden" {...getFieldProps(typeField)} />
          <span>购买后</span>
          <FormItem style={{marginLeft: 10, display: 'inline-block', verticalAlign: 'top'}}>
            <InputNumber {...this.fieldProps2} min={7} max={360} step="1"/>
          </FormItem>
          <span>至</span>
          <FormItem style={{marginLeft: 10, display: 'inline-block', verticalAlign: 'top'}}>
            <InputNumber {...this.fieldProps} min={7} max={360} step="1"/>
          </FormItem>
          <span>内有效</span>
        </FormItem>
      );
    }
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <span style={TABLE_CELL}>购买后</span>
        <FormItem style={{ display: 'table-cell', verticalAlign: 'top', paddingLeft: '8px' }}>
          <InputNumber {...this.fieldProps} min={0} step="1"/>
        </FormItem>
        <span style={TABLE_CELL}>日内有效</span>
        <p style={{lineHeight: '16px', color: '#999', marginTop: 5}}>{extra}</p>
      </FormItem>
    );
  }
}
