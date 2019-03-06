 /**
 * 商品展示渠道
 */
import React, { PropTypes } from 'react';
import { Form, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const Option = Select.Option;
export default class DisplayChannels extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    field: PropTypes.string.isRequired,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: '商品展示渠道',
    rules: [],
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field } = this.props;
    const rules = [...this.props.rules];
    if (this.props.required) {
      rules.push({
        required: true, message: `请选择${this.props.label}`,
      });
    }
    return getFieldProps(field, {
      initialValue: defaultValue,
      rules,
    });
  }
  render() {
    const { label, required, labelCol, wrapperCol, extra, placeholder } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
      >
        <Select {...this.fieldProps} placeholder={placeholder} >
          <Option value="ALL">正常投放</Option>
          <Option value="ORIENTATION">定向投放</Option>
        </Select>
      </FormItem>
    );
  }
}
