/**
 * 发放总量
 */
import React, { PropTypes } from 'react';
import { Form, InputNumber, Select } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const Option = Select.Option;
const SUB_FORM_ITEM_STYLE = { display: 'table-cell', verticalAlign: 'top', paddingRight: '8px' };
export default class InputTotal2 extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    max: PropTypes.number,
    field: PropTypes.shape({
      inventory: PropTypes.string.isRequired,
      inventoryType: PropTypes.string.isRequired,
    }),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    max: 99999999,
    defaultValue: {
      inventoryType: '0',
      inventory: undefined,
    },
    label: '发放总量',
  }

  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, rules, defaultValue } = this.props;
    return getFieldProps(field.inventory, {
      rules,
      initialValue: defaultValue.inventory,
    });
  }

  get sendAmountLimitedProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field } = this.props;
    return getFieldProps(field.inventoryType, {
      onChange: (v) => {
        if (v === '1') {
          this.form.setFieldsValue({
            [field.inventory]: this.props.max,
            [field.inventoryType]: v,
          });
        } else {
          this.form.setFieldsValue({
            [field.inventoryType]: v,
          });
        }
      },
      initialValue: defaultValue.inventoryType,
    });
  }

  render() {
    const { label, placeholder, required, labelCol, wrapperCol, max, extra, field } = this.props;
    const { getFieldValue } = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
      >
        <FormItem style={SUB_FORM_ITEM_STYLE}>
          <Select {...this.sendAmountLimitedProps} style={{ width: 100 }} placeholder="请选择">
            <Option value="0">不限制</Option>
            <Option value="1">设定总数</Option>
          </Select>
        </FormItem>
        {getFieldValue(field.inventoryType) === '1' &&
          <FormItem style={SUB_FORM_ITEM_STYLE}>
            <InputNumber style={{ width: 200 }}
              placeholder={placeholder}
              {...this.fieldProps}
              min={0} max={max} step="1"
            />
          </FormItem>}
      </FormItem>
    );
  }
}
