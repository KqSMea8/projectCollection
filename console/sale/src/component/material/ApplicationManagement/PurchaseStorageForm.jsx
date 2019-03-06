import React, {PropTypes} from 'react';
import {Input, Row, Col, Button, Form, Cascader } from 'antd';
const FormItem = Form.Item;
import {History} from 'react-router';
import MaterialAcceptanceCheckStatusSelect from '../../../common/MaterialAcceptanceCheckStatusSelect';

const PurchaseStorageForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onSearch: PropTypes.func,
  },
  mixins: [History],
  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    this.props.onSearch(info);
  },
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps} = this.props.form;
    const options = [{
      value: 'zhejiang',
      label: '浙江',
      children: [{
        value: 'hangzhou',
        label: '杭州',
        children: [{
          value: 'xihu',
          label: '西湖',
        }],
      }],
    }, {
      value: 'jiangsu',
      label: '江苏',
      children: [{
        value: 'nanjing',
        label: '南京',
        children: [{
          value: 'zhonghuamen',
          label: '中华门',
        }],
      }],
    }];
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请单号："><Input placeholder="请输入" {...getFieldProps('stuffCheckId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请状态：">
              <MaterialAcceptanceCheckStatusSelect
                {...getFieldProps('checkStatus', {initialValue: 'ALL'})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请总额：">
                <Row>
                  <Col span="10">
                    <Input placeholder="请输入" {...getFieldProps('auditOperatorName')} id="tel1" defaultValue="086" />
                  </Col>
                  <Col span="1">
                    <p className="ant-form-split">-</p>
                  </Col>
                  <Col span="10">
                    <Input placeholder="请输入" {...getFieldProps('auditOperatorName')} id="tel1" defaultValue="086" />
                  </Col>
                </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请人："><Input placeholder="请输入" {...getFieldProps('stuffCheckId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请城市："
            >
              <Cascader placeholder="请选择"
                {...getFieldProps('checkStatus', {initialValue: ['zhejiang', 'hangzhou', 'xihu']})}
                options={options}
                style={{width: '100%'}}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="KA商户名称："><Input placeholder="请输入" {...getFieldProps('auditOperatorName')}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="物料类型：">
              <MaterialAcceptanceCheckStatusSelect
                {...getFieldProps('checkStatus', {initialValue: 'ALL'})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="物料需求方：">
              <MaterialAcceptanceCheckStatusSelect
                {...getFieldProps('checkStatus', {initialValue: 'ALL'})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="2" offset="20" style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.onSearch}>搜索</Button>
          </Col>
          <Col span="2" style={{textAlign: 'right'}}>
            <Button onClick={this.reset}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(PurchaseStorageForm);
