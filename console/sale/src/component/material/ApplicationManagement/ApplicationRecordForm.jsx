import React, {PropTypes} from 'react';
import {Input, Row, Col, Button, Form, DatePicker, Icon, InputNumber } from 'antd';
import {History} from 'react-router';
import disabledFutureDate from '../../../common/disableFutureDate';
import MaterialApplicationRecordApplyStatus from './MaterialApplicationRecordApplyStatus';
import MaterialApplicationRecordMaterialType from './MaterialApplicationRecordMaterialType';
import MaterialApplicationRecordStorageType from './MaterialApplicationRecordStorageType';
import GetAllAreasData from '../common/GetAllAreasData';
import KASelect from './ApplyMaterial/KASelect';
import {format} from '../../../common/dateUtils';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const ApplicationRecordForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    applycationType: PropTypes.string,
  },

  mixins: [History],

  getInitialState() {
    return {
      collapsed: true,
    };
  },

  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    if (info.dateRange) {
      info.gmtStart = format(info.dateRange[0]);
      info.gmtEnd = format(info.dateRange[1]);
    }
    if (info.storageType === 'KA') {
      if (info.kaParent) {
        info.storageCode = info.kaParent.merchantId;
      }
    } else if (info.storageType === 'CITY') {
      if (info.cityCode) {
        info.storageCode = info.cityCode[1];
      }
    } else if (info.storageType === 'YUNZONG') {
      info.storageCode = '2088021699414978';
    }
    if (info.cityCode) {
      info.cityCode = info.cityCode.join(',');
    }
    if (info.kaParent) {
      info.kaParent = info.kaParent.merchantId;
    }
    this.props.onSearch(info);
  },

  getCityCode(value) {
    this.props.form.setFieldsValue({
      cityCode: value,
    });
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  changeCollapsed(e) {
    e.preventDefault();
    this.setState({
      collapsed: !this.state.collapsed,
    });
  },

  renderMore() {
    const {getFieldProps} = this.props.form;
    const collapsed = this.state.collapsed;
    return [
      <Row style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="申请日期：">
              <RangePicker {...getFieldProps('dateRange')} disabledDate={disabledFutureDate}
              showTime={false} style={{width: '100%'}}/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="采购员名称："><Input placeholder="请输入花名" {...getFieldProps('buyerName')}/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="所属城市：">
            <GetAllAreasData
            {...getFieldProps('cityCode')} style={{width: '100%'}} onChangeCity ={this.getCityCode}
            disabled={this.props.form.getFieldValue('storageType') !== 'CITY'}/>
          </FormItem>
        </Col>
      </Row>,
      <Row style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="申请总额：">
              <Col span="10">
                <InputNumber placeholder="数字请输入" {...getFieldProps('minAmount', {initialValue: ''})} style={{width: '100%'}} size= "large"/>
              </Col>
              <Col span="4">
                <p className="ant-form-split">-</p>
              </Col>
              <Col span="10">
                <InputNumber placeholder="数字请输入" {...getFieldProps('maxAmount', {initialValue: ''})}
                min={parseInt(this.props.form.getFieldValue('minAmount'), 10)}
                style={{width: '100%'}}
                size= "large"
                 />
              </Col>
          </FormItem>
        </Col>
      </Row>,
    ];
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const collapsed = this.state.collapsed;
    return (<div>
      <Form className="advanced-search-form" horizontal onSubmit={this.onSearch}>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请单号："><Input placeholder="请输入" {...getFieldProps('orderId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请状态：">
              <MaterialApplicationRecordApplyStatus applycationType={this.props.applycationType}
                {...getFieldProps('status', {initialValue: ''})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="仓库类型：">
              <MaterialApplicationRecordStorageType
                {...getFieldProps('storageType', {initialValue: ''})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请人："><Input placeholder="请输入" {...getFieldProps('applicant')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="物料类型：">
              <MaterialApplicationRecordMaterialType applycationType={this.props.applycationType}
                {...getFieldProps('stuffAttrId', {initialValue: ''})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="KA商户名称：">
                <KASelect {...getFieldProps('kaParent')} disabled={getFieldValue('storageType') !== 'KA'}/>
            </FormItem>
          </Col>
        </Row>
        {this.renderMore()}
        <Row>
          <Col span="6"><div style={{height: 1}}></div></Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button style={{marginRight: 12}} type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
              <a href="#" onClick={this.changeCollapsed}>
                {
                  collapsed ? <span>更多<Icon type="down" /></span> : <span>收起<Icon type="up" /></span>
                }
              </a>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(ApplicationRecordForm);
