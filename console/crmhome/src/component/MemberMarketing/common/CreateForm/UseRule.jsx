import React, {PropTypes} from 'react';
import { Form, Select, InputNumber } from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;
const Option = Select.Option;

/*
  表单字段 － 使用条件
*/

const UseRule = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    ticketType: PropTypes.string,
    actionType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  checkNum(rule, value, callback) {
    if (value <= 0 ) {
      callback([new Error('商品件数必须大于零')]);
    }

    callback();
  },


  /*eslint-disable */
  render() {
    /*eslint-enable */
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
    const { initData, ticketType, layout, actionType} = this.props;
    let isDisabled = false;
    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
      isDisabled = true;
    }
    const isLimit = getFieldValue('isLimitCostFull') === 'limit';

    return (
      <div>
        {ticketType === 'RATE' || ticketType === 'REDUCETO' ?
        <FormItem
          {...layout}
          required
          label="使用条件："
          help={getFieldError('minItemNum') || getFieldError('maxDiscountItemNum')}
          validateStatus={
          classnames({
            error: !!(getFieldError('minItemNum') || getFieldError('maxDiscountItemNum')),
          })}>
          <span>
            同一件商品满
            <InputNumber disabled={isDisabled} min={1} max={99} step={1} style={{ width: 70, marginLeft: 5, marginRight: 5 }}
            {...getFieldProps('minItemNum', {
              rules: [
                { required: true, type: 'number', message: '请输入使用条件' },
                { validator: this.checkNum },
              ],
              initialValue: initData.minItemNum && Number.parseInt(initData.minItemNum, 10),
            })} />
            件可享受优惠，且该商品最高优惠
            <InputNumber disabled={isDisabled} min={1} max={99} step={1} style={{ width: 70, marginLeft: 5, marginRight: 5 }}
            {...getFieldProps('maxDiscountItemNum', {
              rules: [
                { required: true, type: 'number', message: '请输入使用条件' },
                { validator: this.checkNum },
              ],
              initialValue: initData.maxDiscountItemNum && Number.parseInt(initData.maxDiscountItemNum, 10),
            })} />
            件
          </span>
        </FormItem>
        : null}

        {ticketType === 'MONEY' ?
        <FormItem
          {...layout}
          required
          label="使用条件："
          help={isLimit && getFieldError('minimumAmount')}
          validateStatus={
          classnames({
            error: !!(isLimit && getFieldError('minimumAmount')),
          })}>
          <Select
            disabled={isDisabled}
            style={{ width: 120 }}
            placeholder="请选择"
            {...getFieldProps('isLimitCostFull', {
              initialValue: initData.minimumAmount ? 'limit' : 'nolimit',
            })}>
            <Option value="nolimit">不限制</Option>
            <Option value="limit">限制</Option>
          </Select>
          {isLimit ?
          <span style={{ marginLeft: 5 }}>
            满
            <InputNumber
              disabled={isDisabled}
              min={0.01}
              max={49999.99}
              step={0.01}
              style={{ marginLeft: 5, marginRight: 5 }}
              {...getFieldProps('minimumAmount', {
                rules: [
                  { required: true, type: 'number', message: '请输入使用条件' },
                ],
                initialValue: initData.minimumAmount && Number.parseFloat(initData.minimumAmount),
              })} />
            元使用
          </span>
          : null}
        </FormItem>
        : null}
      </div>
    );
  },
});

export default UseRule;
