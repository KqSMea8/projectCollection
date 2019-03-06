import React, {PropTypes} from 'react';
import {Form, Select, InputNumber} from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const BudgetAmountFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
  },

  checkAddedBudgetAmount(rule, value, callback) {
    if (value) {
      if (this.props.data.budgetAmount + value > 999999999) {
        callback(new Error('发放总量不能超过99999999'));
        return;
      }
    }
    callback();
  },

  checkBudgetAmount(rule, value, callback) {
    this.props.form.validateFields(['budgetAmountType'], {force: true});
    if (this.props.form.getFieldValue('dayAvailableNum')) {
      this.props.form.validateFields(['dayAvailableNum'], { force: true });
    }
    callback();
  },

  checkBudgetAmountType(rule, value, callback) {
    const {form} = this.props;
    const budgetAmount = form.getFieldValue('budgetAmount');
    if (value === '2' && budgetAmount === undefined) {
      callback(new Error('请输入发放总量'));
      return;
    }
    if (budgetAmount > 999999999) {
      callback(new Error('发放总量不能超过99999999'));
      return;
    }
    callback();
  },

  render() {
    const isOnline = this.props.isEdit && this.props.isCampaignStart;
    const {data} = this.props;
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const budgetAmountType = getFieldValue('budgetAmountType') || '1';
    if (isOnline) {
      return (<FormItem
        label="发放总量："
        required
        validateStatus={classnames({error: !!getFieldError('addedBudgetAmount')})}
        help={getFieldError('addedBudgetAmount')}
        {...formItemLayout}>
        {budgetAmountType === '1' && <span className="ant-form-text">不限制</span>}
        {budgetAmountType === '2' && <span className="ant-form-text">设定总数量{data.budgetAmount}，追加</span>}
        {budgetAmountType === '2' && <InputNumber size="large" min={1} step={1} style={{width: 100}} {...getFieldProps('addedBudgetAmount', {
          validateFirst: true,
          rules: [this.checkAddedBudgetAmount],
        })}/>}
      </FormItem>);
    }
    return (<FormItem
      label="发放总量："
      required
      validateStatus={classnames({error: !!getFieldError('budgetAmountType') })}
      help={getFieldError('budgetAmountType')}
      {...formItemLayout}>
      <Select
        style={{width: 150}}
        disabled={budgetAmountType === '1' && isOnline}
        placeholder="请选择"
        {...getFieldProps('budgetAmountType', {
          initialValue: '1',
          validateFirst: true,
          rules: [this.checkBudgetAmountType],
        }) }
      >
        <Option key="1">不限制</Option>
        <Option key="2">设定总量</Option>
      </Select>
      <div style={{display: budgetAmountType === '2' ? 'inline-block' : 'none', verticalAlign: 'bottom', marginLeft: 8}}>
        <InputNumber size="large" min={1} step={1} style={{width: 150}} {...getFieldProps('budgetAmount', {
          validateFirst: true,
          rules: [this.checkBudgetAmount],
        })}/>
      </div>
    </FormItem>);
  },
});

export default BudgetAmountFormItem;
