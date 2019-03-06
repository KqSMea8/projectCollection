import React from 'react';
import { Form, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
export default class TagesSelect extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string.isRequired,
  }
  static defaultProps = {
    rules: [],
  }
  handleChange = value => {
    const { setFieldsValue, validateFields } = this.form;
    const { field } = this.props;
    setFieldsValue({
      [field]: value,
    });
    validateFields([field], { force: true, scroll: true });
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, rules } = this.props;
    return getFieldProps(field, {
      rules,
    });
  }

  render() {
    const { label, placeholder, extra, required, labelCol, wrapperCol, field } = this.props;
    const { getFieldValue } = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <FormItem>
        <Select
          tags
          defaultValue={getFieldValue(field)}
          style={{ width: '100%' }}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
        <input type="hidden" {...this.fieldProps}/>
        </FormItem>
        <p style={{lineHeight: '16px', color: '#999', marginTop: 33}}>{extra}</p>
      </FormItem>
    );
  }
}
