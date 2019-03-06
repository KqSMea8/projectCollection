/**
 * 适用范围
 */
import React, { PropTypes } from 'react';
import { Form, Input, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import classnames from 'classnames';

const FormItem = Form.Item;
const Option = Select.Option;
export default class ScopeOfApplication extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    field: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
    defaultValue: PropTypes.string,
    label: PropTypes.string,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    defaultValue: '0',
    label: '适用范围',
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, rules } = this.props;
    return getFieldProps(field.value, {
      rules,
    });
  }
  get fieldSelectProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field } = this.props;
    return getFieldProps(field.type, {
      initialValue: defaultValue,
    });
  }

  render() {
    const { label, placeholder, required, labelCol, wrapperCol, extra, field } = this.props;
    const { getFieldValue, getFieldError } = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
        help={getFieldValue(field.type) === '4' && getFieldError(field.value)}
        validateStatus={
          classnames({
            error: getFieldValue(field.type) === '4' && getFieldError(field.value),
          })
        }
      >
        <Select {...this.fieldSelectProps} placeholder="请选择">
          <Option value="0">全场通用</Option>
          <Option value="1">特价菜不享受打折</Option>
          <Option value="2">酒水不享受打折</Option>
          <Option value="3">特价菜及酒水不享受打折</Option>
          <Option value="4">自定义</Option>
        </Select>
        {getFieldValue(field.type) === '4' &&
        <div style={{ marginTop: 10 }}>
          <Input size="large"
            placeholder={placeholder}
            {...this.fieldProps}
          />
        </div>
        }
      </FormItem>
    );
  }
}
