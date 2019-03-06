import React, {PropTypes} from 'react';
import { Form, Select, InputNumber, Row, Col } from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;
const Option = Select.Option;

/*
  表单字段 － 发放总量
*/

const TicketAmount = React.createClass({
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

  checkBudgetAmount(rule, value, callback) {
    const { getFieldValue, validateFields } = this.props.form;
    const { initData, actionType } = this.props;

    if (actionType === 'edit' && initData.campaignStart) {
      if (initData.budgetAmount && value < initData.budgetAmount) {
        callback([new Error('总数只可追加')]);
      }
    }

    if (getFieldValue('receiveLimited') !== undefined) {
      validateFields(['receiveLimited'], {force: true});
    }

    if (getFieldValue('dayReceiveLimited') !== undefined) {
      validateFields(['dayReceiveLimited'], {force: true});
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
    const { initData, roleType, actionType, layout } = this.props;

    const isEdit = actionType === 'edit';
    const isMerchant = roleType === 'merchant';

    return (
      <FormItem
        {...layout}
        required
        label="发放总量：">
        <Row>
          <Col span="7">
            <Select
              disabled={isEdit && isMerchant && initData.campaignStart && initData.budgetAmount === '999999999'}
              style={{ width: 120 }}
              placeholder="请选择"
              size="large"
              {...getFieldProps('isLimitBudgetAmount', {
                initialValue: initData.budgetAmount && (initData.budgetAmount !== '999999999' || !initData.budgetAmount) ? 'limit' : 'nolimit',
              })}
            >
              <Option value="nolimit">不限制</Option>
              <Option value="limit">设定总数</Option>
            </Select>
          </Col>
          {getFieldValue('isLimitBudgetAmount') === 'limit' ?
          <Col span="7">
            <FormItem
                help={getFieldError('budgetAmount')}
                validateStatus={
                classnames({
                  error: !!getFieldError('budgetAmount'),
                })}
                style={{ marginBottom: 0 }}>
              <InputNumber min={1} max={999999999} step={1} {...getFieldProps('budgetAmount', {
                rules: [
                  { required: true, type: 'number', message: '请设定总数' },
                  { validator: this.checkBudgetAmount },
                ],
                initialValue: initData.budgetAmount && Number.parseInt(initData.budgetAmount, 10),
              })} />
            </FormItem>
          </Col>
          : null}
        </Row>
      </FormItem>
    );
  },
});

export default TicketAmount;
