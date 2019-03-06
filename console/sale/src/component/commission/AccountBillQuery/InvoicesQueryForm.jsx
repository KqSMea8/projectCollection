import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, DatePicker} from 'antd';
import {format} from '../../../common/dateUtils';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
import MerchantInfoSelect from './MerchantInfoSelect';
import moment from 'moment';
const InvoicesQueryForm = React.createClass({
  propTypes: {
    merchantData: PropTypes.array,
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      merchantName: '',
      collapsed: true,
    };
  },
  componentWillMount() {
    const initialValue = {};
    if (this.props.billNo && this.props.pid) {
      initialValue.billNo = this.props.billNo;
      initialValue.merchantPid = this.props.pid;
      this.props.onSearch(initialValue);
    } else {
      initialValue.createTime = [moment().add(-3, 'months').toDate(), moment().toDate()];
      if (this.props.merchantData && this.props.merchantData.length === 1) {
        initialValue.merchantPid = this.props.merchantData[0].partnerId;
        const startTime = format(initialValue.createTime[0]).split('-');
        initialValue.startTime = startTime.join('');
        const endTime = format(initialValue.createTime[1]).split('-');
        initialValue.endTime = endTime.join('');
        delete initialValue.createTime;
        this.props.onSearch(initialValue);
      }
    }
    this.setMerchantName(initialValue.merchantPid);

    this.props.form.setFieldsValue(initialValue);
  },
  onSearch() {
    let info = '';
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      info = values;
      if (info.createTime) {
        const startTime = format(info.createTime[0]).split('-');
        info.startTime = startTime.join('');
        const endTime = format(info.createTime[1]).split('-');
        info.endTime = endTime.join('');
      }
      delete info.createTime;
      this.props.onSearch(info);
    });
  },

  setMerchantName(merchantPid) {
    if (this.props.merchantData) {
      this.props.merchantData.map((r) => {
        if (r.partnerId === merchantPid) {
          this.setState({
            merchantName: r.merchantName,
          });
        }
      });
    }
  },

  reset(e) {
    e.preventDefault();
    if (this.props.merchantData.length === 1) {
      this.props.form.resetFields(['createTime', 'invoiceCode', 'billNo', 'invoiceNo']);
    } else {
      this.props.form.resetFields();
    }
  },
  render() {
    const merchantData = this.props.merchantData || [];
    const {getFieldProps} = this.props.form;
    const {merchantName} = this.state;
    return (
      <Form horizontal className="advanced-search-form">
        <Row key="1">
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="开票日期：">
            <RangePicker
              style={{width: '100%'}}
              {...getFieldProps('createTime')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="账单号："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('billNo')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="发票代码：">
            <Input {...getFieldProps('invoiceCode')} placeholder=""/>
            </FormItem>
          </Col>
        </Row>

        <Row key="2">
          <Col span="8">
            <FormItem
              label="服务商名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
                <MerchantInfoSelect merchantName={merchantName} {...getFieldProps('merchantPid', {
                  rules: [{
                    required: merchantData.length > 1 ? true : false,
                    message: '此处必填',
                  }]})} disabled={merchantData.length === 1}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="发票号："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('invoiceNo')} placeholder=""/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6"><div style={{height: 1}}></div></Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  },
});

export default Form.create()(InvoicesQueryForm);
