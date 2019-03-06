import React from 'react';
import { Form, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const Option = Select.Option;

export default class SelectComponent extends BaseFormComponent {
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field, {
      initialValue: defaultValue,
      rules,
    });
  }

  renderOptions(options) {
    const optionsVDom = options.map((item) => {
      return <Option value={item.key}>{item.name}</Option>;
    });
    return optionsVDom;
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol, disabled, options } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
      >
        <FormItem style={{display: 'inline-block', width: '100%'}}>
          <Select
            {...this.fieldProps}
            disabled={disabled}>
            {this.renderOptions(options)}
          </Select>
        </FormItem>
      </FormItem>
    );
  }
}
