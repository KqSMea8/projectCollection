import React, {PropTypes} from 'react';
import { Row, Col, Button, Form, DatePicker, Select } from 'antd';
import disabledFutureDate from '../../../common/disableFutureDate';
import {format} from '../../../common/dateUtils';
import ajax from 'Utility/ajax';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const CommissionQueryForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    this.fetchInitForm();

    return {
      loading: true,
      formInit: {
        allActivityName: [],
        allActivityType: [],
        dataStatusList: [],
        merchantList: [],
      },
    };
  },

  // 获取表单下拉选项
  fetchInitForm() {
    ajax({
      url: '/sale/rebate/merchantRebateInit.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({ formInit: res });
        }
      },
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    const values = this.props.form.getFieldsValue();
    if (values.dateRange) {
      values.fromDate = format(values.dateRange[0]);
      values.toDate = format(values.dateRange[1]);
    }
    this.props.onSearch(values);
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps} = this.props.form;
    const {formInit} = this.state;

    const merchantNameOptions = formInit.merchantList.map((m) => {
      const value = m.merchantName + ' (PID:' + m.partnerId + ')';
      return <Option key={m.key} value={m.merchantId} title={value}>{value}</Option>;
    });

    const activityNameOptions = formInit.allActivityName.map((active) => {
      return <Option key={active}>{active}</Option>;
    });

    const billTypeOptions = formInit.allActivityType.map((bill) => {
      return <Option key={bill}>{bill}</Option>;
    });

    const dataStatusOptions = formInit.dataStatusList.map((status) => {
      return <Option key={status}>{status}</Option>;
    });

    return (<div>
      <Form horizontal onSubmit={this.handleSubmit} className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              label="时间："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <RangePicker disabledDate={disabledFutureDate}
                {...getFieldProps('dateRange')} />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="服务商名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Select {...getFieldProps('merchantIdOrName')}
                allowClear
                placeholder="请选择">
                {merchantNameOptions}
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="活动名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Select {...getFieldProps('activityName')}
                allowClear
                placeholder="请选择">
                {activityNameOptions}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              label="账单类型："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Select {...getFieldProps('activityType')}
                allowClear
                placeholder="请选择">
                {billTypeOptions}
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="数据状态："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Select {...getFieldProps('dataStatus')}
                allowClear
                placeholder="请选择">
                {dataStatusOptions}
              </Select>
            </FormItem>
          </Col>
          <Col span="8" style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button type="ghost" onClick={this.handleClear}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(CommissionQueryForm);
