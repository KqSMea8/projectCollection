/**
 * 折扣力度
 */
import React from 'react';
import { Form, Input } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;

export default class ExternalAppId extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    field: React.PropTypes.string,
    rules: React.PropTypes.array,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: 'AppId',
    labelCol: {
      span: 4,
      offset: 2,
    },
    field: 'externalAppId',
    required: true,
    rules: [{ required: true, message: '请填写 AppId' }],
  }

  render() {
    const {
      labelCol, wrapperCol, disabled,
      required, extra, label, field,
      rules,
    } = this.props;
    const form = this.form;
    return (
      <FormItem
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
        label={label}
      >
        <Input
          disabled={disabled}
          {...form.getFieldProps(field, {
            rules,
          })}
        />
      </FormItem>
    );
  }
}
