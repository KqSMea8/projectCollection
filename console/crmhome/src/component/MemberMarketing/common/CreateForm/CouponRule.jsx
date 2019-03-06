import React, {PropTypes} from 'react';
import { Form, InputNumber } from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;

/*
  表单字段 － 优惠方式
*/

const CouponRule = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  checkCouponValue(rule, value, callback) {
    const { getFieldValue, getFieldError, validateFields } = this.props.form;
    const ruleVal = getFieldValue('couponRule');

    if (ruleVal === 'reduce') {
      if (!value) {
        callback([new Error('请输入优惠价格')]);
        return;
      }
    }

    if (getFieldError('originPrice') || getFieldError('reduceToPrice')) {
      validateFields(['originPrice', 'reduceToPrice'], {force: true});
    }

    callback();
  },

  checkOriginPrice(rule, value, callback) {
    const { getFieldValue, getFieldError, validateFields } = this.props.form;
    const ruleVal = getFieldValue('couponRule');

    if (ruleVal === 'reduceto') {
      if (!value) {
        callback([new Error('请输入商品原价')]);
        return;
      }
    }

    if (getFieldError('couponValue')) {
      validateFields(['couponValue'], {force: true});
    }

    callback();
  },

  checkReduceToPrice(rule, value, callback) {
    const { getFieldValue, getFieldError, validateFields } = this.props.form;
    const ruleVal = getFieldValue('couponRule');

    if (ruleVal === 'reduceto') {
      if (!value) {
        callback([new Error('请输入优惠价格')]);
        return;
      }
      if ( value >= getFieldValue('originPrice') ) {
        callback([new Error('现价需小于原价')]);
        return;
      }
    }

    if (getFieldError('couponValue')) {
      validateFields(['couponValue'], {force: true});
    }

    callback();
  },

  /*eslint-disable */
  render() {
    /*eslint-disable */
    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, actionType, ticketType} = this.props;

    let isDisabled = false;
    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
      isDisabled = true;
    }

    return (
      <div>
        { ticketType === 'MONEY' ? (
           <FormItem
             {...this.props.layout}
             required
             label="代金券金额："
             help={getFieldError('couponValue')}
             validateStatus={
              classnames({
              error: !!getFieldError('couponValue'),
            })}>
             <InputNumber disabled={isDisabled} min={0.01} max={49999.99} step={0.01}
               {...getFieldProps('couponValue', {
                 rules: [
                   { required: true, type: 'number', message: '请设置代金券金额' },
                 ],
                 initialValue: initData.couponValue && Number.parseFloat(initData.couponValue),
               })} />元
           </FormItem>
        ) : null }

        { ticketType === 'REDUCETO' ? (
        <FormItem
          {...this.props.layout}
          required
          label="换购券金额："
          help={getFieldError('reduceToPrice')}
          validateStatus={
              classnames({
                error: !!getFieldError('reduceToPrice'),
              })}>
          减至
          <InputNumber disabled={isDisabled} min={0} max={49999.99} step={0.01}
            {...getFieldProps('reduceToPrice', {
              rules: [
                { required: true, type: 'number', message: '请设置换购券金额' },
              ],
              initialValue: initData.reduceToPrice && Number.parseFloat(initData.reduceToPrice),
            })} />元
        </FormItem>
        ) : null }
      </div>
    );
  },
});

export default CouponRule;
