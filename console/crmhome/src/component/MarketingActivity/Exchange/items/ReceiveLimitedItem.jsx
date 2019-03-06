import React from 'react';
import { Form, Select, InputNumber } from 'antd';
import classnames from 'classnames';
import FormItemBase from './FormItemBase';

const FormItem = Form.Item;
const Option = Select.Option;
const FIELD_NAME = 'receiveLimited';

class ReceiveLimitedItem extends FormItemBase {
  static displayName = 'exchange-receive-limited';
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      isLimited: !isNaN(this.initialValue),
    };
  }
  onChange = (v) => {
    if (v === '1') {
      this.setState({ isLimited: true });
      this.props.form.setFieldsValue({ [FIELD_NAME]: 1 });
    } else if (v === '0') {
      this.setState({ isLimited: false });
      this.props.form.setFieldsValue({ [FIELD_NAME]: undefined });
    }
  }
  static fieldName = FIELD_NAME;
  checkData = (r, v, c) => {
    const val = Number(v);
    if (isNaN(val) || val < 1 || val > 99) {
      return c('输入大于0，小于100的整数');
    }
    if (this.isOnline && !isNaN(this.initialValue) && this.initialValue > val) {
      return c(`每人领取张数必须不能小于原每人领取张数 ${this.initialValue}`);
    }
    c();
  }
  get initialValue() {
    return this.props.initialData && Number(this.props.initialData[FIELD_NAME]) || undefined;
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <FormItem {...this.itemLayout}
        label="领取限制"
        validateStatus={classnames({ error: !!getFieldError(FIELD_NAME) })}
        help={getFieldError(FIELD_NAME)}
      >
        <Select disabled={this.isOnline && this.initialValue === undefined || !isNaN(this.initialValue)} onChange={this.onChange} defaultValue={this.state.isLimited ? '1' : '0'}>
          <Option value="0">不限制</Option>
          <Option value="1">设定每人领取总张数</Option>
        </Select>
        { this.state.isLimited &&
          <div style={{ marginTop: 10 }}>
          <InputNumber {...getFieldProps(FIELD_NAME, { // 券名称
            trigger: 'onChange',
            validateTrigger: 'onBlur',
            initialValue: this.initialValue,
            rules: [this.checkData],
          }) }
            max={99}
            step={1}
            min={1}
          /> <span>张 / 人</span></div>
        }
      </FormItem>
    );
  }
}

export default ReceiveLimitedItem;
