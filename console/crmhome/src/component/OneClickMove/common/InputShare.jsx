/**
 * 包含商品数量
 */
import React, { PropTypes } from 'react';
import { Form, InputNumber } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;

export default class InputTotal extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    max: PropTypes.number,
  }
  static defaultProps = {
    label: '商品包含',
    max: 50,
  }
  get fieldProps() {
    const { getFieldProps, getFieldValue } = this.form;
    const { defaultValue, field } = this.props;
    const rules = [];
    let requiredObj = {
      required: false,
      message: '请填写发放包含多少份',
    };
    if (getFieldValue('verifyFrequency') === 'multi') {
      requiredObj = {
        required: true,
        message: '请填写发放包含多少份',
      };
      rules.push(requiredObj);
      rules.push({
        validator: (rule, value, callback) => {
          if ( value && Number(value) < 2 || Number(value) > 50) {
            callback('发放总量必须大于等于2份小于等于50份');
            return;
          }
          callback();
        },
      });
    } else {
      rules.push(requiredObj);
    }
    return getFieldProps(field, {
      initialValue: defaultValue,
      rules,
    });
  }

  render() {
    const {getFieldValue } = this.form;
    const { label, placeholder, labelCol, wrapperCol, max, extra, isInputShareDisabled } = this.props;
    const isMulti = getFieldValue('verifyFrequency') === 'multi';
    if (!isMulti) {
      return null;
    }
    return (
      <FormItem
        label={label}
        style={{display: isMulti ? 'block' : 'none'}}
        required
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={<div style={{lineHeight: '16px'}}>{extra}</div>}
      >
        <InputNumber style={{width: '200px'}}
          placeholder={placeholder}
          disabled={isInputShareDisabled}
          {...this.fieldProps}
          min={2} max={max} step={1}
        />份
      </FormItem>
    );
  }
}
