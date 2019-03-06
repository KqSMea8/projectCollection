import React, {PropTypes} from 'react';
import {Form, Select, InputNumber} from 'antd';
import classnames from 'classnames';
import MoneyInput from '../../../../common/MoneyInput';

const FormItem = Form.Item;
const Option = Select.Option;

/*
  表单字段 － 最低消费
*/

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const UseCondtionFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
    minMessage: PropTypes.string,
    min: PropTypes.number,
    priceType: PropTypes.number,
  },

  checkMinConsume(rule, value, callback) {
    if (rule.field === 'minimumAmount') {
      this.props.form.validateFields(['conditionsOfUseType'], {force: true});
    } else {
      this.props.form.validateFields(['consumptionType'], {force: true});
    }
    if (rule.field === 'maxDiscountItemNum' && this.props.priceType === 2) {
      this.props.form.validateFields(['totalMaxDiscountItemNum', 'minItemNum'], {force: true});
    }
    if (rule.field === 'checkMinConsume') {
      this.props.form.validateFields(['maxDiscountItemNum'], {force: true});
    }
    callback();
  },

  checkUseType(rule, value, callback) {
    const {form, min, minMessage, priceType} = this.props;
    const minItemNum = form.getFieldValue('minItemNum');
    const maxDiscountItemNum = form.getFieldValue('maxDiscountItemNum');
    if (priceType === '2') {
      if (value === '2' && (minItemNum === undefined || maxDiscountItemNum === undefined)) {
        callback(new Error('请指定使用条件'));
        return;
      }
      callback();
      return;
    }
    const minimumAmount = form.getFieldValue('minimumAmount');
    if (value === '2' && minimumAmount === undefined) {
      callback(new Error('请输入最低消费金额'));
      return;
    }
    if (value === '2' && min && minMessage && parseFloat(minimumAmount) < parseFloat(min)) {
      callback(new Error(minMessage));
      return;
    }
    callback();
  },

  discountItemNumCheck(rule, value, callback) {
    const {form} = this.props;
    const maxDiscountItemNum = form.getFieldValue('maxDiscountItemNum');
    const conditionType = form.getFieldValue('conditionType');
    if (maxDiscountItemNum === undefined && conditionType === '2') {
      callback(new Error('同一订单最高优惠件数，不能低于单商品的最高优惠件数'));
    }
    if (maxDiscountItemNum !== undefined && Number(maxDiscountItemNum) > Number(value) && conditionType === '2') {
      callback(new Error('同一订单最高优惠件数，不能低于单商品的最高优惠件数'));
    }
    callback();
  },

  render() {
    const {priceType} = this.props;
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const useType = getFieldValue('conditionsOfUseType');
    if (priceType === 2 || priceType === 3) {
      return (<div>
        <FormItem
          label="订单最低消费："
          required
          validateStatus={classnames({error: !!getFieldError('consumptionType')})}
          help={getFieldError('consumptionType')}
          {...formItemLayout}>
          <Select style={{width: 110, marginRight: 8}} placeholder="请选择" {...getFieldProps('consumptionType', {
            initialValue: '1',
          })}>
            <Option key="1">不限制</Option>
            <Option key="2">指定金额</Option>
          </Select>
          <div style={{display: getFieldValue('consumptionType') === '2' ? 'inline-block' : 'none', verticalAlign: 'bottom'}}>
            <span className="ant-form-text">订单满</span>
            <MoneyInput {...getFieldProps('goodsThresholdOrderAmount', {
              validateFirst: true,
              rules: [{
                required: getFieldValue('consumptionType') === '2' ? true : false,
                message: '请输入订单最低消费',
              }],
            })}/>
            <span className="ant-form-text">元可享受优惠</span>
          </div>
        </FormItem>
        <FormItem
          label="使用条件："
          required
          validateStatus={classnames({error: !!getFieldError('minItemNum') || !!getFieldError('maxDiscountItemNum')})}
          help={getFieldError('minItemNum') || getFieldError('maxDiscountItemNum')}
          {...formItemLayout}>
          <Select style={{width: 110, marginRight: 8}} placeholder="请选择" {...getFieldProps('conditionType', {
            initialValue: '2',
          })}>
            <Option key="1">不限制</Option>
            <Option key="2">指定使用条件</Option>
          </Select>
          <div style={{display: getFieldValue('conditionType') === '2' ? 'inline-block' : 'none', verticalAlign: 'bottom', marginTop: 8}}>
            <span className="ant-form-text">同一件商品满</span>
            <InputNumber min={1} step={1} {...getFieldProps('minItemNum', {
              validateFirst: true,
              rules: [{
                required: getFieldValue('conditionType') === '2' ? true : false,
                message: '请输入使用条件',
              }, this.checkMinConsume],
            })}/>
            <span className="ant-form-text">件可享受优惠，</span>
            <span className="ant-form-text">且该商品最高优惠</span>
            <InputNumber min={1} step={1} {...getFieldProps('maxDiscountItemNum', {
              validateFirst: true,
              rules: [{
                required: getFieldValue('conditionType') === '2' ? true : false,
                message: '请输入使用条件',
              }, this.checkMinConsume],
            })}/>
            <span className="ant-form-text">件</span>
          </div>
        </FormItem>
        { (priceType === 2 || priceType === 3) && <FormItem
          label="同一订单优惠限制："
          required
          validateStatus={classnames({error: !!getFieldError('totalMaxDiscountItemNum')})}
          help={getFieldError('totalMaxDiscountItemNum')}
          {...formItemLayout}>
          <Select style={{width: 110, marginRight: 8}} placeholder="请选择" {...getFieldProps('totalMaxDiscountType', {
            initialValue: '2',
          })}>
            <Option key="1">不限制</Option>
            <Option key="2">设置优惠限制</Option>
          </Select>
          <div style={{display: getFieldValue('totalMaxDiscountType') === '2' ? 'inline-block' : 'none', verticalAlign: 'bottom'}}>
            <span className="ant-form-text"> 同一订单最高优惠</span>
            <MoneyInput {...getFieldProps('totalMaxDiscountItemNum', {
              rules: [{
                required: getFieldValue('totalMaxDiscountType') === '2' ? true : false,
                message: '请输入同一订单优惠限制',
              }, this.discountItemNumCheck],
            })}/>
            <span className="ant-form-text">件</span>
          </div>
        </FormItem>}
      </div>);
    }
    return (<FormItem
      label="最低消费："
      required
      validateStatus={classnames({error: !!getFieldError('minimumAmount')})}
      help={getFieldError('minimumAmount')}
      {...formItemLayout}>
      <Select style={{width: 110, marginRight: 8}} placeholder="请选择" {...getFieldProps('conditionsOfUseType', {
        initialValue: '1',
      })}>
        <Option key="1">不限制</Option>
        <Option key="2">指定金额</Option>
      </Select>
      <div style={{display: useType === '2' ? 'inline-block' : 'none', verticalAlign: 'bottom'}}>
        <span className="ant-form-text">单品满</span>
        <MoneyInput {...getFieldProps('minimumAmount', {
          rules: [{
            required: useType === '2' ? true : false,
            message: '请输入最低消费',
          }],
        })}/>
        <span className="ant-form-text">元可享受优惠</span>
      </div>
    </FormItem>);
  },
});

export default UseCondtionFormItem;
