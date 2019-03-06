/**
 * 使用方式
 */
import React, { PropTypes } from 'react';
import { Form, Radio } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
export default class UsageMode extends BaseFormComponent {
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
				<RadioGroup {...this.fieldProps}>
					<Radio value="0">需要用户领取</Radio>
					<Radio value="1">无需用户领取</Radio>
				</RadioGroup>
      </FormItem>
    );
  }
}
