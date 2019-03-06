/**
 * 领取生效
 */
import React, {PropTypes} from 'react';
import { Form, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const Option = Select.Option;
export default class GetEffect extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: PropTypes.string,
    field: PropTypes.string.isRequired,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    defaultValue: '0',
    label: '使用方式',
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
        extra={extra}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
				<Select {...this.fieldProps}>
          <Option value="0">领取后即时生效</Option>
          <Option value="30">领取后30分钟生效</Option>
          <Option value="60">领取后1小时生效</Option>
          <Option value="90">领取后1.5小时生效</Option>
          <Option value="120">领取后2小时生效</Option>
        </Select>
      </FormItem>
    );
  }
}
