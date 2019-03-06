import React, {PropTypes} from 'react';
import { Form, Select, InputNumber, DatePicker, Row, Col } from 'antd';
import classnames from 'classnames';
import { dateLaterThanToday, serverStringToDate } from '../../../../../common/dateUtils';

const FormItem = Form.Item;
const Option = Select.Option;

/*
  表单字段 － 券有效期
*/

const ValidTime = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    actionType: PropTypes.string,
    roleType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  checkValidTimeRelative(rule, value, callback) {
    const { initData, actionType } = this.props;

    if (actionType === 'edit' && initData.campaignStart) {
      if (initData.validPeriod && value < initData.validPeriod) {
        callback([new Error('券有效期只可延长')]);
      }
    }

    callback();
  },

  checkStartTime(rule, value, callback) {
    const { getFieldValue, getFieldError, validateFields } = this.props.form;
    const end = getFieldValue('validTimeTo');
    const activityStart = getFieldValue('startTime');

    if (value && end) {
      if (value > end) {
        callback([new Error('开始时间应该早于结束时间')]);
        return;
      }

      const millSecond = end.getTime() - value.getTime();

      const day = millSecond / 1000 / 60 / 60 / 24;
      if ( day >= 365) {
        callback(new Error('券有效期最长为1年'));
        return;
      }
    }

    if (value && activityStart && value < new Date(activityStart)) {
      callback([new Error('开始时间要晚于活动的开始时间')]);
      return;
    }

    if (getFieldError('validTimeTo')) {
      validateFields(['validTimeTo'], {force: true});
    }

    callback();
  },

  checkEndTime(rule, value, callback) {
    const { getFieldValue, getFieldError, validateFields } = this.props.form;
    const { initData, actionType } = this.props;
    const start = getFieldValue('validTimeFrom');
    const activityEnd = getFieldValue('endTime');

    if (value && start) {
      if (value < start) {
        callback([new Error('结束时间应该大于开始时间')]);
        return;
      }

      const millSecond = value.getTime() - start.getTime();

      const day = millSecond / 1000 / 60 / 60 / 24;
      if ( day >= 365) {
        callback(new Error('券有效期最长为1年'));
        return;
      }
    }

    if (value && activityEnd && value <= new Date(activityEnd)) {
      callback([new Error('结束时间要晚于活动结束时间')]);
      return;
    }

    if (actionType === 'edit' && initData.campaignStart) {
      if (initData.validTimeTo && value < serverStringToDate(initData.validTimeTo)) {
        callback([new Error('券有效期结束时间只可后延')]);
        return;
      }
    }

    if (getFieldError('validTimeFrom')) {
      validateFields(['validTimeFrom'], {force: true});
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
    const { layout, initData, actionType, roleType } = this.props;
    const isEdit = actionType === 'edit';
    const isMerchant = roleType === 'merchant';

    const now = +new Date();
    const start = new Date(now + 7 * 24 * 60 * 60 * 1000);
    const end = new Date(now + 38 * 24 * 60 * 60 * 1000);
    const defaultStartTime = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
    const defaultEndTime = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 0);

    let initFromTime = null;
    let initToTime = null;

    if (initData.validTimeFrom && initData.validTimeTo) {
      initFromTime = serverStringToDate(initData.validTimeFrom);
      initToTime = serverStringToDate(initData.validTimeTo);
    }

    return (
      <FormItem
        {...layout}
        required
        label="券有效期：">
        <Row>
          <Col span="7">
            <Select style={{ width: 120 }} placeholder="请选择" size="large"
            disabled={isEdit && isMerchant && initData.campaignStart}
            {...getFieldProps('validTimeType', {
              initialValue: initData.validTimeType || 'RELATIVE',
            })}>
              <Option value="RELATIVE">相对时间</Option>
              <Option value="FIXED">指定时间</Option>
            </Select>
          </Col>
          <Col span="17">
            {getFieldValue('validTimeType') === 'RELATIVE' ?
              <FormItem
                style={{ marginBottom: 0 }}
                help={getFieldError('validPeriod')}
                validateStatus={
                classnames({
                  error: !!getFieldError('validPeriod'),
                })}>
                领取后 <InputNumber min={1} max={15} {...getFieldProps('validPeriod', {
                  rules: [
                    { required: true, type: 'number', message: '请输入券有效期' },
                    { validator: this.checkValidTimeRelative },
                  ],
                  initialValue: initData.validPeriod || 3,
                })}/> 日内有效
              </FormItem> :
              <FormItem
                style={{ marginBottom: 0 }}
                help={getFieldError('validTimeFrom') || getFieldError('validTimeTo')}
                validateStatus={
                classnames({
                  error: !!(getFieldError('validTimeFrom') || getFieldError('validTimeTo')),
                })}>
                <DatePicker
                  disabled={isEdit && isMerchant && initData.campaignStart}
                  showTime
                  format="yyyy-MM-dd HH:mm"
                  disabledDate={dateLaterThanToday}
                  placeholder="开始时间"
                  style={{ width: 140 }}
                  {...getFieldProps('validTimeFrom', {
                    rules: [
                      { required: true, type: 'date', message: '请选择券有效期开始时间' },
                      { validator: this.checkStartTime },
                    ],
                    initialValue: initFromTime || defaultStartTime,
                  })} />
                <span style={{ margin: '0 5px', color: '#ccc' }}>－</span>
                <DatePicker
                  showTime
                  format="yyyy-MM-dd HH:mm"
                  disabledDate={dateLaterThanToday}
                  placeholder="结束时间"
                  style={{ width: 140 }}
                  {...getFieldProps('validTimeTo', {
                    rules: [
                      { required: true, type: 'date', message: '请选择券有效期结束时间' },
                      { validator: this.checkEndTime },
                    ],
                    initialValue: initToTime || defaultEndTime,
                  })} />
              </FormItem>
            }
          </Col>
        </Row>
      </FormItem>
    );
  },
});

export default ValidTime;
