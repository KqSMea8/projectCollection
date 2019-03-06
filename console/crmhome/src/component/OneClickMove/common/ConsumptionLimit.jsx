/**
 * 最低消费/最高优惠
 */
import React, { PropTypes } from 'react';
import { Form, InputNumber, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import classnames from 'classnames';

const FormItem = Form.Item;
const Option = Select.Option;
export default class ConsumptionLimit extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    max: PropTypes.number,
    field: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
    defaultValue: PropTypes.string,
    label: PropTypes.string,
    isMinimum: PropTypes.bool,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    max: 99999999,
    min: 0,
    defaultValue: '0',
    isMinimum: true, // 最低消费/最高优惠
    label: '最低消费',
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, rules } = this.props;
    return getFieldProps(field.value, {
      rules,
    });
  }
  get amountLimitedProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field } = this.props;
    return getFieldProps(field.type, {
      initialValue: defaultValue,
    });
  }

  render() {
    const { label, placeholder, required, labelCol, wrapperCol, max, extra, field, isMinimum } = this.props;
    const { getFieldValue, getFieldError } = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
        help={getFieldValue(field.type) === '1' && getFieldError(field.value)}
        validateStatus={
          classnames({
            error: getFieldValue(field.type) === '1' && getFieldError(field.value),
          })
        }
      >
        <Select {...this.amountLimitedProps} placeholder="请选择">
          <Option value="0">不限制</Option>
          <Option value="1">指定金额</Option>
        </Select>
        {getFieldValue(field.type) === '1' && isMinimum &&
        <div style={{ marginTop: 10 }}>
        <span style={{ paddingRight: 8 }}>订单满</span>
          <InputNumber size="large" style={{ width: 100 }}
            placeholder={placeholder}
            {...this.fieldProps}
            min={this.props.min} max={max} step="0.01"
          />
          <span>元可享受优惠</span>
        </div>
        }
        {getFieldValue(field.type) === '1' && !isMinimum &&
        <div style={{ marginTop: 10 }}>
          <InputNumber size="large" style={{ width: 200 }}
            placeholder={placeholder}
            {...this.fieldProps}
            min={this.props.min} max={max} step="0.01"
          />
          <span>元</span>
        </div>
        }
      </FormItem>
    );
  }
}
