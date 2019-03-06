/*
* 自动续期
*/
import React from 'react';
import { Form, Checkbox } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;

export default class CheckboxRenewal extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string,
    field: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
  }
  static defaultProps = {
    defaultValue: '1',
    label: '自动续期',
  }
  get fieldProps() {
    const { getFieldProps, getFieldValue } = this.form;
    const { field, defaultValue } = this.props;
    return {...getFieldProps(field, {
      valuePropName: 'checked',
      initialValue: defaultValue,
      normalize(v) {
        if (typeof v === 'boolean') {
          return v ? '1' : '0';
        }
        return v;
      },
    }), checked: getFieldValue(this.props.field) === '1'};
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        extra={extra}
        wrapperCol={wrapperCol}
      >
        <Checkbox
        {...this.fieldProps}
        >
					自动延长上架时间
        </Checkbox>
      </FormItem>
    );
  }
}
