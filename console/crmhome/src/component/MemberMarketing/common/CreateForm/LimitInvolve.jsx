import React, {PropTypes} from 'react';
import { Form, Select, InputNumber, Row, Col } from 'antd';

const FormItem = Form.Item;

const FORM_TXT = {
  realtime: {
    receiveLimited: {
      label: '活动期间每人累计可参与几次',
      last: '次/人',
    },
    dayReceiveLimited: {
      label: '活动期间每人每天可参与几次',
      last: '次/人/日',
    },
  },
  common: {
    receiveLimited: {
      label: '活动期间每人累计可领券几张',
      last: '张/人',
    },
    dayReceiveLimited: {
      label: '活动期间每人每天可领券几张',
      last: '张/人/日',
    },
  },
};

/*
  表单字段 － 参与限制、单日参与限制
*/

const LimitInvolve = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    actionType: PropTypes.string,
    campType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
      campType: 'common',
    };
  },

  checkReceiveLimited(rule, value, callback) {
    const { getFieldValue, validateFields } = this.props.form;
    const { initData, actionType } = this.props;

    const max = getFieldValue('budgetAmount');

    if (getFieldValue('isLimitBudgetAmount') === 'limit' && (max && value > max)) {
      callback([new Error('限制数量不得超过总数量')]);
    }

    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
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

    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
      if (initData.dayReceiveLimited && value < initData.dayReceiveLimited) {
        callback([new Error('每日限制数量只可追加')]);
      }
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
    const { initData, actionType, layout, campType } = this.props;
    let isDisabled = false;
    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
      isDisabled = true;
    }

    return (
      <div>
        <FormItem
          {...layout}
          required
          label= {FORM_TXT[campType].receiveLimited.label}>
          <Row>
            <Col span="10">
              <Select
                disabled={isDisabled}
                style={{ width: 160 }}
                placeholder="请选择"
                {...getFieldProps('isLimitInvolve', {
                  initialValue: initData.receiveLimited ? 'limit' : 'nolimit',
                })}>
                <Option value="nolimit">不限制</Option>
                <Option value="limit">限制</Option>
              </Select>
            </Col>
            { getFieldValue('isLimitInvolve') === 'limit' &&
            <Col span="10">
              <FormItem help={getFieldError('receiveLimited')}>
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
                    })} />{FORM_TXT[campType].receiveLimited.last}
              </FormItem>
            </Col> }
          </Row>
        </FormItem>


        <FormItem
          {...layout}
          required
          label= {FORM_TXT[campType].dayReceiveLimited.label}>
          <Row>
            <Col span="10">
              <Select
                style={{ width: 160 }}
                placeholder="请选择"
                disabled={ isDisabled }
                {...getFieldProps('isLimitInvolveDay', {
                  initialValue: initData.dayReceiveLimited ? 'limit' : 'nolimit',
                })}>
                <Option value="nolimit">不限制</Option>
                <Option value="limit">限制</Option>
              </Select>
            </Col>
            <Col span="10">
              {getFieldValue('isLimitInvolveDay') === 'limit' &&
                <FormItem
                  help={getFieldError('dayReceiveLimited')}>
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
                    })} />{FORM_TXT[campType].dayReceiveLimited.last}
                </FormItem> }
              </Col>
            </Row>
        </FormItem>
      </div>
    );
  },
});

export default LimitInvolve;
