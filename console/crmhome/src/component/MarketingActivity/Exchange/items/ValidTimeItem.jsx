import React from 'react';
import { Form, DatePicker, Row, Select, InputNumber, Col } from 'antd';
import classnames from 'classnames';
import FormItemBase from './FormItemBase';
import moment from 'moment';

const RELATIVE = 'RELATIVE';
const FIXED = 'FIXED';
const Option = Select.Option;
const FormItem = Form.Item;
const VALID_TIME_TO = 'validTimeTo';
const VALID_TIME_FROM = 'validTimeFrom';
const VALID_TIME_TYPE = 'validTimeType';
const VALID_PERIOD = 'validPeriod';
const NOW = moment();
class ValidTimeItem extends FormItemBase {
  static displayName = 'exchange-online-time';
  static fieldName = {
    VALID_TIME_TO, VALID_TIME_FROM, VALID_TIME_TYPE, VALID_PERIOD,
  };
  disabledActivityTime = (value) => {
    if (!value) {
      return false;
    }

    // 只能选未来的时间，若已上线的活动，则只能延后
    return value.getTime() < moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').valueOf() ||
      (this.isOnline && value.getTime() < this.initialValue[VALID_TIME_TO].valueOf());
  }

  checkData = (rule, value, callback) => {
    const { getFieldsValue, getFieldValue } = this.props.form;
    if (value === FIXED) { // 如果是指定时间，需要检查和上架时间的关系
      const { startTime, endTime, validTimeTo, validTimeFrom } = getFieldsValue(['startTime', 'endTime', 'validTimeTo', 'validTimeFrom']);
      if (moment(endTime).isBefore(moment(startTime))) {
        return callback('截至时间应该大于起始时间');
      }
      if (moment(validTimeFrom).isBefore(moment(startTime))) {
        return callback('券开始时间应该大于等于上架开始时间');
      }
      if (moment(validTimeTo).isBefore(moment(endTime))) {
        return callback('券结束时间应该大于等于上架结束时间');
      }
      if (moment(validTimeTo).diff(validTimeFrom, 'years') >= 10) {
        return callback('券有效期跨度必须小于 10 年');
      }
    }

    if (value === RELATIVE && (getFieldValue(VALID_PERIOD) <= 0 || getFieldValue(VALID_PERIOD) > 365)) {
      return callback('相对时间必须为大于 0 小于等于 365 的整数');
    }

    if (!this.isReadyToOnline && value === RELATIVE && getFieldValue(VALID_PERIOD) < this.initialValue[VALID_PERIOD]) { // 已开始 则只能延长
      return callback(`有效期只能延长，必须大于原时间 ${this.initialValue[VALID_PERIOD]} 天`);
    }
    callback();
  }

  get initialValue() {
    const initialData = this.props.initialData || {};
    return {
      [VALID_TIME_TYPE]: initialData[VALID_TIME_TYPE] || RELATIVE,
      [VALID_PERIOD]: Number(initialData[VALID_PERIOD]) || 30,
      [VALID_TIME_FROM]: initialData[VALID_TIME_FROM] ? moment(initialData[VALID_TIME_FROM], 'YYYY-MM-DD HH:mm').toDate() :
        new Date(NOW.year(), NOW.month(), NOW.date(), 0, 0),
      [VALID_TIME_TO]: initialData[VALID_TIME_TO] ? moment(initialData[VALID_TIME_TO], 'YYYY-MM-DD HH:mm').toDate() :
        new Date(NOW.year(), NOW.month() + 1, NOW.date(), 23, 59),
    };
  }

  render() {
    const { getFieldProps, getFieldError, validateFields, getFieldValue } = this.props.form;
    return (
      <FormItem {...this.itemLayout}
        label="券有效期："
        required
        validateStatus={
          classnames({
            error: !!getFieldError(VALID_TIME_TYPE),
          })}
        help={getFieldError(VALID_TIME_TYPE) ||
          (getFieldValue(VALID_TIME_TYPE) === RELATIVE ||
            getFieldValue(VALID_TIME_TYPE) === undefined
            && this.props.initialData[VALID_TIME_TYPE] === RELATIVE ? '相对时间必须为大于 0 小于等于 365 的整数' : '')}
        >
        <Row>
          <Select {...getFieldProps(VALID_TIME_TYPE, { // 券有效期 FIXED | RELATIVE
            validateTrigger: 'onBlur',  // 验证不能用 onChange，onChange 的话 TYPE 从 RELATIVE => FIXED 时，指定时间的控件 render 还未执行，所以 value 还未生成
            initialValue: this.initialValue[VALID_TIME_TYPE],
            rules: [{
              required: true, type: 'enum', enum: [FIXED, RELATIVE],
            }, this.checkData],
          }) }
            size="large"
            style={{ width: 100 }}
            disabled={this.isOnline}
          >
            <Option key="RELATIVE">相对时间</Option>
            <Option key="FIXED">指定时间</Option>
          </Select>
        </Row>
        <Row style={{ marginTop: 10 }}>
          {getFieldValue(VALID_TIME_TYPE) === RELATIVE ?
            <Col>
              <span style={{ marginLeft: 8, marginRight: 7 }}>领取后</span>
              <InputNumber max={365} step={1} min={1} {...getFieldProps(VALID_PERIOD, {
                initialValue: this.initialValue[VALID_PERIOD],
                normalize: (v) => Number(v),
                validateTrigger: 'onBlur',
                rules: [{ required: true, message: '请填写活动有效期', type: 'number' },
                  (r, v, c) => {
                    validateFields([VALID_TIME_TYPE], { force: true });
                    c();
                  }],
              }) } />
              <span>日内有效</span>
            </Col>
            :
            <Col>
              <DatePicker
                disabled={this.isOnline}
                size="large"
                style={{ width: '130px' }}
                showTime
                format="yyyy-MM-dd HH:mm"
                disabledDate={this.disabledActivityTime}
                {...getFieldProps(VALID_TIME_FROM, { // 券有效开始时间
                  validateTrigger: 'onChange',
                  initialValue: this.initialValue[VALID_TIME_FROM],
                  rules: [{
                    required: true, type: 'date', message: '请填写券有效开始时间',
                  }, (r, v, c) => {
                    validateFields([VALID_TIME_TYPE], { force: true });
                    c();
                  }],
                }) } />
              <span style={{ margin: '0 5px' }}> - </span>
              <DatePicker
                size="large"
                style={{ width: '130px' }}
                showTime
                format="yyyy-MM-dd HH:mm"
                disabledDate={this.disabledActivityTime}
                {...getFieldProps(VALID_TIME_TO, { // 券有效结束时间
                  validateTrigger: 'onChange',
                  initialValue: this.initialValue[VALID_TIME_TO],
                  rules: [{
                    required: true, type: 'date', message: '请填写券有效结束时间',
                  }, (r, v, c) => {
                    validateFields([VALID_TIME_TYPE], { force: true });
                    c();
                  }],
                }) } />
            </Col>
          }
        </Row>
      </FormItem>
    );
  }
}

export default ValidTimeItem;
