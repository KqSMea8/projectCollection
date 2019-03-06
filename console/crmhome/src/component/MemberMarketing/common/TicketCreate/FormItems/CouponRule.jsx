import React, {PropTypes} from 'react';
import { Form, Radio, InputNumber } from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
      if (value === undefined) {
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
    /*eslint-enable */
    const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
    const { initData, roleType, actionType } = this.props;
    const type = initData.itemDiscountType;
    const isEdit = actionType === 'edit';
    const isMerchant = roleType === 'merchant';
    const isDisabled = isEdit && isMerchant;

    return (
      <div>
        {roleType === 'brand' ?
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
        : null}

        {roleType === 'merchant' ?
        <FormItem
          {...this.props.layout}
          required
          help={getFieldValue('couponRule') === 'reduce'
            ? getFieldError('couponValue')
            : getFieldError('originPrice') || getFieldError('reduceToPrice')}
          validateStatus={
            classnames({
              error: getFieldValue('couponRule') === 'reduce'
                ? !!getFieldError('couponValue')
                : !!(getFieldError('originPrice') || getFieldError('reduceToPrice')),
            })
          }
          label="代金券金额：">
          <RadioGroup disabled={isDisabled} {...getFieldProps('couponRule', {
            initialValue: type && type === 'REDUCETO' ? 'reduceto' : 'reduce',
          })}>
            <Radio value="reduce">
              <InputNumber disabled={(isDisabled) || getFieldValue('couponRule') === 'reduceto'} min={0.01} max={49999.99} step={0.01}
              style={getFieldValue('couponRule') === 'reduceto'
                ? { marginLeft: 0, borderColor: '#d9d9d9', boxShadow: 'none' }
                : { marginLeft: 0 }
              }
              {...getFieldProps('couponValue', {
                rules: [
                  { validator: this.checkCouponValue },
                ],
                initialValue: initData.couponValue && Number.parseFloat(initData.couponValue),
              })} />
              元
            </Radio>
            <Radio value="reduceto">
              商品原价
              <InputNumber disabled={(isDisabled) || getFieldValue('couponRule') === 'reduce'} min={0.01} max={49999.99} step={0.01}
              style={getFieldValue('couponRule') === 'reduce'
                ? { marginLeft: 5, borderColor: '#d9d9d9', boxShadow: 'none' }
                : { marginLeft: 5 }
              }
              {...getFieldProps('originPrice', {
                rules: [
                  { validator: this.checkOriginPrice },
                ],
                initialValue: initData.originPrice && Number.parseFloat(initData.originPrice),
              })} />
              元，减至
              <InputNumber disabled={isDisabled || getFieldValue('couponRule') === 'reduce'} min={0.00} max={49999.99} step={0.01}
              style={getFieldValue('couponRule') === 'reduce'
                ? { marginLeft: 5, borderColor: '#d9d9d9', boxShadow: 'none' }
                : { marginLeft: 5 }
              }
              {...getFieldProps('reduceToPrice', {
                rules: [
                  { validator: this.checkReduceToPrice },
                ],
                initialValue: initData.reduceToPrice && Number.parseFloat(initData.reduceToPrice),
              })} />
              元
            </Radio>
          </RadioGroup>
        </FormItem>
        : null}
      </div>
    );
  },
});

export default CouponRule;
