import React, {PropTypes} from 'react';
import { Form, InputNumber, Row, Col, Select } from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;

/*
  表单字段 － 封顶优惠数量
*/

const LimitNum = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    actionType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  checkNum(rule, value, callback) {
    if (typeof (value) === 'number' && value <= 0 ) {
      callback([new Error(rule.field.indexOf('limitAmount') > -1 ? '封顶优惠金额必须大于零' : '封顶优惠件数必须大于零')]);
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
    const { initData, actionType, ticketType, layout} = this.props;

    let isDisabled = false;
    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
      isDisabled = true;
    }

    // 诡异问题，提前转化格式
    initData.limitAmount = parseFloat(initData.limitAmount) || '';
    initData.limitNum = parseFloat(initData.limitNum) || '';

    return (
      <div>
        { ticketType === 'RATE' &&
        <FormItem
            {...layout}
            required
            label="封顶优惠金额："
            help={getFieldError('limitAmount')}
            validateStatus={
              classnames({
                error: !!getFieldError('limitAmount'),
              })}>
            <Row>
              <Col span="7">
                <Select style={{ width: 120 }}
                    placeholder="请选择"
                    size="large"
                    disabled={isDisabled}
                    {...getFieldProps('isLimitAmount', {
                      initialValue: initData.limitAmount && initData.limitAmount !== '0' ? 'limit' : 'nolimit',
                    })}>
                  <Option value="nolimit">不限制</Option>
                  <Option value="limit">限制</Option>
                </Select>
              </Col>
              { getFieldValue('isLimitAmount') === 'limit' &&
              <Col span="10">
                <InputNumber disabled={isDisabled} min={0.01} max={49999.99} step={0.01} size="large"
                   {...getFieldProps('limitAmount', {
                     rules: [
                       { required: true, type: 'number', message: '请设置封顶优惠金额' },
                       { validator: this.checkNum },
                     ],
                     initialValue: initData.limitAmount && parseFloat(initData.limitAmount),
                   })} />元
              </Col> }
            </Row>
        </FormItem>
        }

        { ticketType === 'REDUCETO' &&
          <FormItem
              {...layout}
              required
              label="封顶优惠件数："
              help={getFieldError('limitNum')}
              validateStatus={
                classnames({
                  error: !!getFieldError('limitNum'),
                })}>
            <Row>
              <Col span="7">
                <Select style={{ width: 120 }}
                        placeholder="请选择"
                        size="large"
                        disabled={isDisabled}
                        {...getFieldProps('isLimitNum', {
                          initialValue: initData.limitNum && initData.limitNum !== '0' ? 'limit' : 'nolimit',
                        })}>
                  <Option value="nolimit">不限制</Option>
                  <Option value="limit">限制</Option>
                </Select>
              </Col>
              { getFieldValue('isLimitNum') === 'limit' &&
              <Col span="10">
                <InputNumber disabled={isDisabled} size="large" min={1} max={99} step={1}
                 {...getFieldProps('limitNum', {
                   rules: [
                     { required: true, type: 'number', message: '请设置封顶优惠件数' },
                     { validator: this.checkNum },
                   ],
                   initialValue: initData.limitNum && parseFloat(initData.limitNum) || 1,
                 })} />件
              </Col> }
            </Row>
          </FormItem>
        }
      </div>
    );
  },
});

export default LimitNum;
