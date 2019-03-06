import React, {PropTypes} from 'react';
import {Input, Row, Col, Button, Form, DatePicker, Select, Icon} from 'antd';
const FormItem = Form.Item;
import {MaterialPropertiesList} from '../common/MaterialLogMap';
import GetAllAreasData from '../common/GetAllAreasData';
import ajax from 'Utility/ajax';
import moment from 'moment';
import {format} from '../../../common/dateUtils';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import MaterialAcceptanceCheckStatusSelect from '../../../common/MaterialAcceptanceCheckStatusSelect';
import MaterialAcceptanceAuditStatusSelect from '../../../common/MaterialAcceptanceAuditStatusSelect';
import MaterialAcceptanceBizSourceSelect from '../../../common/MaterialAcceptanceBizSourceSelect';
import MaterialAcceptanceChannelSelect from '../../../common/MaterialAcceptanceChannelSelect';
import { LABEL_OPTIONS } from './constants';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const MaterialAcceptanceForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onSearch: PropTypes.func,
  },
  getInitialState() {
    return {
      collapsed: true,
    };
  },
  componentWillMount() {
    const initialValue = {};
    initialValue.dateRange = [moment().add(-3, 'months').toDate(), moment().toDate()];
    this.props.form.setFieldsInitialValue(initialValue);
  },
  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    if (info.dateRange) {
      info.paveStartDate = format(info.dateRange[0]);
      info.paveEndDate = format(info.dateRange[1]);
      delete info.dateRange;
    }
    if (info.cityId) {
      info.cityId = info.cityId[1];
    }
    if (info.checkStatus === 'ALL') {
      info.checkStatus = '';
    }
    if (info.bucUser) {
      info.auditOperatorId = info.bucUser.id;
      delete info.bucUser;
    }
    // 当shopKaLabel为全部时，服务端接收到的入参必须是null
    if (info.shopKaLabel === 'ALL' ) {
      delete info.shopKaLabel;
    }

    this.props.onSearch(info);
  },
  getCityCode(value) {
    this.props.form.setFieldsValue({
      cityId: value,
    });
  },
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  collapse(e) {
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
              label="门店名称："><Input placeholder="请输入" {...getFieldProps('shopName')}/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="运营服务商："><Input placeholder="请输入" {...getFieldProps('merchantName')}/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="审核人：">
              <BuserviceUserSelect ajax={ajax}
                   placeholder="输入员工名"
                   allowClear
                   notFoundContent=""
                   channel="inner_user_channels"
                   searchScope={'global'}
                   scopeTarget={window.APP.jobPath}
                   {...getFieldProps('bucUser')}
                   buserviceUrl={window.APP.buserviceUrl}
                   style={{width: '100%'}}/>
          </FormItem>
        </Col>
      </Row>,
      <Row style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店ID："><Input placeholder="请输入" {...getFieldProps('shopId')}/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="门店标签：">
            <Select {...getFieldProps('shopKaLabel', { initialValue: 'ALL' })} >
              {LABEL_OPTIONS.map(opt => <Option key={opt.value} >{opt.text}</Option>)}
            </Select>
          </FormItem>
        </Col>
      </Row>,
    ];
  },
  render() {
    const {getFieldProps} = this.props.form;
    const collapsed = this.state.collapsed;
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="验收ID："><Input placeholder="请输入" {...getFieldProps('stuffCheckId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="铺设时间：">
                <RangePicker {...getFieldProps('dateRange')} showTime={false} format="yyyy/MM/dd"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="城市：">
                <GetAllAreasData {...getFieldProps('cityId')} onChangeCity={this.getCityCode} style={{width: '100%'}} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="验收状态：">
              <MaterialAcceptanceCheckStatusSelect
                {...getFieldProps('checkStatus', {initialValue: 'ALL'})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="铺设人："><Input placeholder="请输入" {...getFieldProps('paveOpName')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="物料属性：">
                <Select {...getFieldProps('stuffType')}>
                  {
                    (MaterialPropertiesList || []).map((p) => {
                      return <Option key={p.key} value={p.key}>{p.value}</Option>;
                    })
                  }
                </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="审核类型：">
              <MaterialAcceptanceAuditStatusSelect
                {...getFieldProps('checkType', {initialValue: ''})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="活动名称：">
              <MaterialAcceptanceBizSourceSelect
                {...getFieldProps('bizSource', {initialValue: ''})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="渠道来源：">
              <MaterialAcceptanceChannelSelect
                {...getFieldProps('channel', {initialValue: ''})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
        </Row>
        {this.renderMore()}
        <Row>
          <Col span="6"><div style={{height: 1}}></div></Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
              <a href="#" onClick={this.collapse}>
                {
                  collapsed ? '更多 ' : '收起 '
                }
                {
                  collapsed ? <Icon type="down" /> : <Icon type="up" />
                }
              </a>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(MaterialAcceptanceForm);
