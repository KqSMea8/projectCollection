/**
 * 人群限制
 */
import React, { PropTypes } from 'react';
import { Form, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const Option = Select.Option;
export default class PeopleLimit extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    field: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    defaultValue: '0',
    label: '人群限制',
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, defaultValue } = this.props;
    return getFieldProps(field, {
      initialValue: defaultValue,
    });
  }
  render() {
    const { label, required, labelCol, wrapperCol, extra } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
      >
        <Select {...this.fieldProps} placeholder="请选择">
          <Option value="0">全部用户</Option>
          <Option value="1">学生用户</Option>
        </Select>
      </FormItem>
    );
  }
}
