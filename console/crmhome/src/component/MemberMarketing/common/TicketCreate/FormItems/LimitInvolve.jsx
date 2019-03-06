import React, {PropTypes} from 'react';
import { Form, Select, InputNumber } from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;

/*
  表单字段 － 参与限制、单日参与限制
*/

const LimitInvolve = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
    ticketType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  checkReceiveLimited(rule, value, callback) {
    const { getFieldValue, validateFields } = this.props.form;
    const { initData, actionType } = this.props;

    const max = getFieldValue('budgetAmount');

    if (max && value > max) {
      callback([new Error('限制数量不得超过总数量')]);
    }

    if (actionType === 'edit' && initData.campaignStart) {
      if (initData.receiveLimited && value < initData.receiveLimited) {
        callback([new Error('限制数量只可追加')]);
      }
    }

    if (getFieldValue('dayReceiveLimited') !== undefined) {
      validateFields(['dayReceiveLimited'], {force: true});
    }

    callback();
  },

  checkDayReceiveLimited(rule, value, callback) {
    const {getFieldValue} = this.props.form;
    const { initData, actionType } = this.props;
    const max = getFieldValue('budgetAmount');
    const receiveLimited = getFieldValue('receiveLimited');

    if (max && value > max) {
      callback([new Error('每日限制数量不得超过总数量')]);
    }

    if (value > receiveLimited) {
      callback([new Error('每日限制数量不得超过总限制数量')]);
    }

    if (actionType === 'edit' && initData.campaignStart) {
      if (initData.dayReceiveLimited && value < initData.dayReceiveLimited) {
        callback([new Error('每日限制数量只可追加')]);
      }
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
    const { initData, roleType, actionType } = this.props;
    const isEdit = actionType === 'edit';
    const isMerchant = roleType === 'merchant';

    return (
      <div>
        <FormItem
          {...this.props.layout}
          required
          label= {this.props.ticketType === 'RATE' ? '参与限制：' : '领取限制：'}>
          <Select
            disabled={(isEdit && isMerchant && initData.campaignStart && !initData.receiveLimited) || (isEdit && initData.receiveLimited)}
            style={{ width: 250 }}
            placeholder="请选择"
            {...getFieldProps('isLimitInvolve', {
              initialValue: initData.receiveLimited ? 'limit' : 'nolimit',
            })}>
            <Option value="nolimit">不限制</Option>
            <Option value="limit">{this.props.ticketType === 'RATE' ? '设定每人参与总次数' : '设定每人领取总张数'}</Option>
          </Select>
        </FormItem>
        {getFieldValue('isLimitInvolve') === 'limit' ?
          <FormItem
            style={{ marginTop: -10 }}
            {...this.props.layout}
            label=" "
            help={getFieldError('receiveLimited')}
            validateStatus={
            classnames({
              error: !!getFieldError('receiveLimited'),
            })}>
            <InputNumber
              min={1}
              max={100}
              step={1}
              {...getFieldProps('receiveLimited', {
                rules: [
                  { required: true, type: 'number', message: '请设置' },
                  { validator: this.checkReceiveLimited },
                ],
                initialValue: initData.receiveLimited,
              })} /> {this.props.ticketType === 'RATE' ? '次/人' : '张/人'}
          </FormItem>
        : null}

        <FormItem
          {...this.props.layout}
          required
          label= {this.props.ticketType === 'RATE' ? '每日参与限制：' : '每个用户每日使用上限：'}>
          <Select
            style={{ width: 250 }}
            placeholder="请选择"
            disabled={(isEdit && isMerchant && initData.campaignStart && !initData.dayReceiveLimited) || (isEdit && initData.dayReceiveLimited)}
            {...getFieldProps('isLimitInvolveDay', {
              initialValue: initData.dayReceiveLimited ? 'limit' : 'nolimit',
            })}>
            <Option value="nolimit">不限制</Option>
            <Option value="limit">{this.props.ticketType === 'RATE' ? '设定每人每日参与次数' : '设定每人每日使用张数'}</Option>
          </Select>
        </FormItem>
        {getFieldValue('isLimitInvolveDay') === 'limit' ?
          <FormItem
            style={{ marginTop: -10 }}
            {...this.props.layout}
            label=" "
            help={getFieldError('dayReceiveLimited')}
            validateStatus={
            classnames({
              error: !!getFieldError('dayReceiveLimited'),
            })}>
            <InputNumber
              min={1}
              max={100}
              step={1}
              {...getFieldProps('dayReceiveLimited', {
                rules: [
                  { required: true, type: 'number', message: '请设置' },
                  { validator: this.checkDayReceiveLimited },
                ],
                initialValue: initData.dayReceiveLimited,
              })} />{this.props.ticketType === 'RATE' ? '次/人/日' : '张/人/日'}
          </FormItem>
        : null}
      </div>
    );
  },
});

export default LimitInvolve;
