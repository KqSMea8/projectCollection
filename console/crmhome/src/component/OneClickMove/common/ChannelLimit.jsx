/**
 * 支付渠道限制
 */
import React, { PropTypes } from 'react';
import { Form, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const Option = Select.Option;
export default class ChannelLimit extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    field: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    defaultValue: '1',
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
    const { label, required, labelCol, wrapperCol, extra, field } = this.props;
    const { getFieldValue } = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <Select {...this.fieldProps} placeholder="请选择">
          <Option value="1">不限制</Option>
          <Option value="2">限储值卡付款可享</Option>
          <Option value="3">储值卡付款不可享</Option>
        </Select>
        {getFieldValue(field) === '2' && <p style={{lineHeight: '16px', color: '#999', marginTop: 5}}>{extra}</p>}
      </FormItem>
    );
  }
}
