import React from 'react';
import { Form, Input } from 'antd';
import classnames from 'classnames';
import FormItemBase from './FormItemBase';

const FormItem = Form.Item;
const FIELD_NAME = 'couponGoods';

class CouponNameItem extends FormItemBase {
  static displayName = 'exchange-coupon-name';
  static fieldName = FIELD_NAME;
  get initialValue() {
    return this.props.initialData && this.props.initialData[FIELD_NAME] || '';
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <FormItem {...this.itemLayout}
        label="券名称"
        required
        validateStatus={classnames({ error: !!getFieldError(FIELD_NAME) })}
        help={getFieldError(FIELD_NAME)}
      >
        <Input {...getFieldProps(FIELD_NAME, { // 券名称
          initialValue: this.initialValue,
          validateTrigger: 'onBlur',
          rules: [{
            required: true, type: 'string', message: '请填写券名称',
          }],
        }) } />
      </FormItem>
    );
  }
}

export default CouponNameItem;
