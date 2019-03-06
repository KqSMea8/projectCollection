import React, {PropTypes} from 'react';
import {Form, Select, InputNumber, DatePicker} from 'antd';
import classnames from 'classnames';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const ValidTimeFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
    checkAppend: PropTypes.func,
  },

  checkValidPeriod(value, callback) {
    const {data} = this.props;
    if (value === undefined) {
      callback(new Error('请输入相对有效期'));
      return;
    }
    if (value < 1) {
      callback(new Error('有效期不能小于1'));
      return;
    }
    if (this.props.isEdit && this.props.isCampaignStart && value < data.validPeriod) {
      callback(new Error('修改时，不能缩短有效期'));
      return;
    }
  },

  checkValidTime(value, callback) {
    const {data} = this.props;
    const validTime = value;
    if (validTime === undefined || (validTime[0] === null || validTime[1] === null)) {
      callback(new Error('请输入时间跨度'));
      return;
    }
    const startTime = validTime[0];
    const endTime = validTime[1];
    if (moment(startTime).add(10, 'years').toDate() <= endTime) {
      callback(new Error('时间跨度必须小于 10 年'));
      return;
    }
    if (data.activityTime && data.activityTime[1] && endTime < data.activityTime[1]) {
      callback(new Error('券结束时间应该大于等于活动结束时间'));
      return;
    }
    if (this.props.isEdit && this.props.isCampaignStart && (startTime.valueOf() !== data.validTime[0].valueOf())) {
      callback(new Error('活动已开始不能修改券有效开始时间'));
      return;
    }
    if (this.props.isEdit && this.props.isCampaignStart && endTime < data.validTime[1]) {
      callback(new Error('修改时，不能缩短有效期'));
      return;
    }
  },

  checkInputValue(rule, value, callback) {
    this.props.form.validateFields(['validTimeType'], {force: true});
    callback();
  },

  checkValidTimeType(rule, value, callback) {
    const {form, checkAppend = () => {}} = this.props;
    const validPeriod = form.getFieldValue('validPeriod');
    const validTime = form.getFieldValue('validTime');

    checkAppend();

    if (value === 'RELATIVE') {
      this.checkValidPeriod(validPeriod, callback);
    }
    if (value === 'FIXED') {
      this.checkValidTime(validTime, callback);
    }
    callback();
  },

  render() {
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const validTimeType = getFieldValue('validTimeType');
    const isOnline = this.props.isEdit && this.props.isCampaignStart;
    return (<FormItem
      label="券有效期："
      required
      validateStatus={classnames({error: !!getFieldError('validTimeType')})}
      help={getFieldError('validTimeType')}
      {...formItemLayout}>
      <Select style={{width: 110, marginRight: 8}} placeholder="请选择" {...getFieldProps('validTimeType', {
        validateFirst: true,
        rules: [this.checkValidTimeType],
      })} disabled={isOnline}>
        <Option key="RELATIVE">相对时间</Option>
        <Option key="FIXED">指定时间</Option>
      </Select>
      <div style={{display: validTimeType === 'RELATIVE' ? 'inline-block' : 'none', verticalAlign: 'bottom'}}>
        <span className="ant-form-text">领取后</span>
        <InputNumber size="large" {...getFieldProps('validPeriod', {
          validateFirst: true,
          rules: [this.checkInputValue],
        })}/>
        <span className="ant-form-text">日内有效</span>
      </div>
      <div style={{display: validTimeType === 'FIXED' ? 'inline-block' : 'none', verticalAlign: 'bottom'}}>
        <RangePicker {...getFieldProps('validTime', {
          validateFirst: true,
          rules: [this.checkInputValue],
        })} format="yyyy-MM-dd HH:mm" showTime style={{width: 270}}/>
      </div>
    </FormItem>);
  },
});

export default ValidTimeFormItem;
