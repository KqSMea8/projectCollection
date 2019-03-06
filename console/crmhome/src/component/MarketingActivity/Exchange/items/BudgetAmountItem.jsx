import React from 'react';
import { Form, InputNumber, Select } from 'antd';
import classnames from 'classnames';
import FormItemBase from './FormItemBase';

const Option = Select.Option;
const FormItem = Form.Item;
const FIELD_NAME = 'budgetAmount';
const MAX = 999999999;

function amountNormalize(v, prev) {
  if (Number(v) === prev) return Number(v);
  let res = v;
  const val = Number(v);
  if (isNaN(val) || val < 1 || val > MAX) {
    const pval = Number(prev);
    if (!isNaN(pval) && pval >= 1 && pval <= MAX) {
      res = pval;
    } else if (val < 1) {
      res = 1;
    } else if (val > MAX) {
      res = MAX;
    }
  }
  return res;
}

class BudgetAmountItem extends FormItemBase {
  static displayName = 'exchange-budget-amount';
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      isLimited: Number(this.props.initialData[FIELD_NAME]) < MAX,
    };
  }
  onSelectChange = (value) => {
    if (value === '0') {
      this.setState({
        isLimited: false,
      });
      this.props.form.setFieldsValue({
        [FIELD_NAME]: MAX,
      });
    } else {
      this.setState({
        isLimited: true,
      });
      this.props.form.setFieldsValue({
        [FIELD_NAME]: MAX - 1,
      });
    }
  }
  static fieldName = FIELD_NAME;
  get initialValue() {
    return this.props.initialData && Number(this.props.initialData[FIELD_NAME]) || MAX;
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <FormItem{...this.itemLayout}
        label="总数量"
        required
        validateStatus={classnames({ error: !!getFieldError(FIELD_NAME) })}
        help={getFieldError(FIELD_NAME)}
      >
        <Select disabled={this.initialValue === MAX && this.isOnline} style={{ width: 100, marginTop: -1, marginRight: 10 }} onChange={this.onSelectChange} value={this.state.isLimited ? '1' : '0'}>
          <Option value="0">不限制</Option>
          <Option value="1">设定总数</Option>
        </Select>
        <InputNumber style={{ display: this.state.isLimited ? 'inline-block' : 'none' }} {...getFieldProps(FIELD_NAME, { // 总数量
          initialValue: this.initialValue,
          validateTrigger: 'onBlur',
          normalize: amountNormalize,
          rules: [{
            required: this.state.isLimited, message: '请填写总数量', type: 'number',
          }, (rule, value, callback) => {
            if (this.isOnline && value < this.initialValue) {
              callback(`修改券数量时不可小于原数量 ${this.initialValue}`);
            }
            callback();
          }],
        }) }
          max={MAX}
          step={1}
          min={1}
        />
      </FormItem>
    );
  }
}

export default BudgetAmountItem;
