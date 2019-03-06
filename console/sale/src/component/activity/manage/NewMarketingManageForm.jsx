import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, DatePicker, Button} from 'antd';
import {format} from '../../../common/dateUtils';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const NewMarketingManageForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },
  getInitialState() {
    return {
      isMerchantPidRequired: true,
    };
  },
  onSearch() {
    this.props.form.validateFields((error) => {
      if (!error) {
        const info = {...this.props.form.getFieldsValue()};
        if (info.createTime) {
          info.gmtCreateStart = format(info.createTime[0]);
          info.gmtCreateEnd = format(info.createTime[1]);
          delete info.createTime;
        }
        this.props.onSearch(info);
      }
    });
  },
  checkMerchantPid(e) {
    if (e.target.value) {
      this.props.form.resetFields(['merchantId']);
      this.setState({
        isMerchantPidRequired: !e.target.value,
      });
    }
  },
  reset(e) {
    e.preventDefault();
    Object.keys(this.props.initial).forEach(v => this.props.initial[v] = '');
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps} = this.props.form;
    const {initial} = this.props;
    return (
        <Form horizontal className="advanced-search-form" style={{padding: 16}}>
          <Row>
            <Col span="8">
              <FormItem
                label="活动创建时间："
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}>
                <RangePicker {...getFieldProps('createTime')}/>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="活动名称："
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}>
                <Input {...getFieldProps('campName')} placeholder="请输入"/>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="活动ID："
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}>
                <Input
                  {...getFieldProps('campId', {
                    initialValue: initial.campId,
                    onChange: this.checkMerchantPid,
                  })}
                  placeholder="请输入"
                />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商户PID："
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}>
                <Input placeholder="请输入" {...getFieldProps('merchantId', {
                  initialValue: initial.merchantId,
                  rules: [
                    { required: this.state.isMerchantPidRequired, message: '此处必填'},
                  ],
                })}/>
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

export default Form.create()(NewMarketingManageForm);
