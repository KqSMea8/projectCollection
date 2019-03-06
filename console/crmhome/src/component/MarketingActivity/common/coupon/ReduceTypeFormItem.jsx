import React, {PropTypes} from 'react';
import {Form, Radio} from 'antd';
import classnames from 'classnames';
import MoneyInput from '../../../../common/MoneyInput';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const ReduceTypeFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
  },

  checkValue(rule, value, callback) {
    this.props.form.validateFields(['reduceType'], {force: true});
    callback();
  },

  checkType(rule, value, callback) {
    const {form} = this.props;
    const couponValue = form.getFieldValue('couponValue');
    this.props.form.validateFields(['conditionsOfUseType'], {force: true});
    if (value === '1' && couponValue === undefined) {
      callback(new Error('请输入单品立减'));
      return;
    }
    if (value === '2') {
      const originPrice = form.getFieldValue('originPrice');
      const reduceToPrice = form.getFieldValue('reduceToPrice');
      if (originPrice === undefined) {
        callback(new Error('请输入单品原价'));
        return;
      }
      if (reduceToPrice === undefined) {
        callback(new Error('请输入优惠价'));
        return;
      }
      if (originPrice < reduceToPrice) {
        callback(new Error('优惠价必须小于原价'));
        return;
      }
    }
    callback();
  },

  render() {
    const {isEdit, data} = this.props;
    const {getFieldProps, getFieldError} = this.props.form;
    if (isEdit) {
      return (<FormItem
        label="优惠方式："
        required
        {...formItemLayout}>
        {data.reduceType === '1' && <span className="ant-form-text">单品立减{data.couponValue}元</span>}
        {data.reduceType === '2' && <span className="ant-form-text">单品原价{data.originPrice}元，优惠价{data.reduceToPrice}元</span>}
      </FormItem>);
    }
    return (<FormItem
      label="优惠方式："
      required
      validateStatus={classnames({error: !!getFieldError('reduceType')})}
      help={getFieldError('reduceType')}
      {...formItemLayout}>
      <RadioGroup {...getFieldProps('reduceType', {
        rules: [this.checkType],
      })}>
        <Radio style={{display: 'block', height: 32, lineHeight: '32px'}} value="1">
          <span className="ant-form-text">单品立减</span>
          <MoneyInput {...getFieldProps('couponValue', {
            validateFirst: true,
            rules: [this.checkValue],
          })}/>
          <span className="ant-form-text">元</span>
        </Radio>
        <Radio style={{display: 'block', height: 32, lineHeight: '32px', marginTop: 8}} value="2">
          <span className="ant-form-text">单品原价</span>
          <MoneyInput {...getFieldProps('originPrice', {
            validateFirst: true,
            rules: [this.checkValue],
          })}/>
          <span className="ant-form-text">元，优惠价</span>
          <MoneyInput {...getFieldProps('reduceToPrice', {
            validateFirst: true,
            rules: [this.checkValue],
          })} min={0} />
          <span className="ant-form-text">元</span>
        </Radio>
      </RadioGroup>
    </FormItem>);
  },
});

export default ReduceTypeFormItem;
