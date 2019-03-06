import React, {PropTypes} from 'react';
import {Row, Col, Form, Button, DatePicker} from 'antd';
import ajax from 'Utility/ajax';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import classnames from 'classnames';

const FormItem = Form.Item;

const ShopCorrectionForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    defaultDateRange: PropTypes.array,
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.props.form.setFieldsValue({'opTime': this.props.defaultDateRange});
  },

  onSearch() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) return;
      this.props.onSearch(values);
    });
  },

  setTimeZero(date) {
    if (date.setHours) date.setHours(0);
    else date.setHourOfDay(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  },

  disabledBeginTime(beginValue) {
    const endValue = this.props.form.getFieldValue('endTime');
    if (!beginValue || !endValue) {
      return false;
    }
    this.setTimeZero(beginValue);
    this.setTimeZero(endValue);
    const beginTime = beginValue.getTime();
    const endTime = endValue.getTime();
    return beginTime > endTime || endTime - beginTime > 31536000000;
  },

  disabledEndTime(endValue) {
    const beginValue = this.props.form.getFieldValue('beginTime');
    if (!endValue || !beginValue) {
      return false;
    }
    this.setTimeZero(beginValue);
    this.setTimeZero(endValue);
    const beginTime = beginValue.getTime();
    const endTime = endValue.getTime();
    return endTime < beginTime || endTime - beginTime > 31536000000;
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {defaultDateRange} = this.props;
    const {getFieldProps, getFieldError} = this.props.form;
    return (
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              validateStatus={ classnames({ error: !!getFieldError('beginTime') || !!getFieldError('endTime') }) }
              label="操作时间："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              required>
              <DatePicker
                {...getFieldProps('beginTime', {
                  initialValue: defaultDateRange[0],
                  rules: [
                    {required: true, message: '请选择操作时间', type: 'date'},
                  ],
                })}
                disabledDate={this.disabledBeginTime}
                format="yyyy-MM-dd"
                placeholder="开始时间" />
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <DatePicker {...getFieldProps('endTime', {
                initialValue: defaultDateRange[1],
                rules: [
                  {required: true, message: '请选择操作时间', type: 'date'},
                ],
              })}
                disabledDate={this.disabledEndTime}
                format="yyyy-MM-dd"
                placeholder="结束时间" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="操作人姓名："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <BuserviceUserSelect {...getFieldProps('opName')}
                placeholder="请输入小二花名/真名"
                searchScope="job_scope"
                scopeTarget={window.APP.jobPath}
                ajax={ajax}
                buserviceUrl={window.APP.buserviceUrl} />
            </FormItem>
          </Col>
          <Col span="8" offset="16">
            <div style={{float: 'right'}}>
              <Button type="primary" style={{marginRight: 5}} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  },
});

export default Form.create()(ShopCorrectionForm);
