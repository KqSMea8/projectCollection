import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import { DatePicker, Input, Row, Col, Button, Form, Select } from 'antd';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import BrandSelect from '../../../common/BrandSelect';
import disabledFutureDate from '../../../common/disableFutureDate';
import {format} from '../../../common/dateUtils';
import CategorySelect from '../../../common/CategorySelect';
import AreaSelect from '../../../common/AreaSelect';
import ProviderSelect from '../../../common/ProviderSelect';

const NotEffectiveLeadsForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.props.onSearch({
      searchType: 'TEAM',
    });
  },

  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    if (info.dateRange) {
      info.startDate = format(info.dateRange[0]);
      info.endDate = format(info.dateRange[1]);
      delete info.dateRange;
    }
    const {area, categoryId} = info;
    if (area) {
      info.provinceCode = area[0];
      info.cityCode = area[1];
      info.districtCode = area[2];
      info.area = null;
    }
    if (categoryId) {
      const categoryList = info.categoryId.slice();
      info.categoryId = categoryList.pop();
      if (info.categoryId === '') {
        info.categoryId = categoryList.pop();
      }
    }
    info.searchType = 'TEAM';
    if (info.leadsLevel === '-1') {
      info.leadsLevel = '';
    }
    if (info.providerId) {
      info.providerId = info.providerId.partnerId;
    }
    if (info.providerBdId) {
      info.providerBdId = info.providerBdId.id;
    }
    if (info.bdId) {
      info.bdId = info.bdId.id;
    }
    this.props.onSearch(info);
  },

  searchJob(merchant) {
    this.setState({'jobId': ''});
    this.props.form.setFieldsValue({'providerBdId': ''});
    if (merchant.partnerId) {
      ajax({
        'url': '/sale/merchant/queryJobPath.json',
        'data': {partnerId: merchant.partnerId},
        'success': ({data = ''} = {}) => {
          this.setState({'jobId': data});
        },
      });
    }
  },

  reset(e) {
    e.preventDefault();
    this.setState({'jobId': ''});
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店名称："><Input placeholder="请输入" disabled={!!getFieldValue('leadsId')} {...getFieldProps('name')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="区域：">
              <AreaSelect
                disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('area')}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="品牌名称：">
              <BrandSelect disabled={!!getFieldValue('leadsId')} {...getFieldProps('brandId')}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="经营品类：">
              <CategorySelect
                withAll
                disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('categoryId')}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="创建时间：">
              <RangePicker
                disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('dateRange')}
                disabledDate={disabledFutureDate}
                showTime={false}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="审核状态：">
              <Select {...getFieldProps('auditStatus', {
                initialValue: '',
              })}>
                <Option key="all" value="">全部</Option>
                <Option value="PROCESSING">审核中</Option>
                <Option value="FAILED">审核驳回</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        { window.APP.userType === 'BUC' ?
          <Row>
            <Col span="8">
              <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="创建人：">
                <ProviderSelect
                    placeholder="输入服务商名称"
                    size="large"
                    form={this.props.form}
                    disabled={!!getFieldValue('leadsId')}
                    {...getFieldProps('providerId', {
                      onChange: this.searchJob,
                    })}/>
              </FormItem>
            </Col>
            <Col span="5" offset="1" style={{minWidth: 100}} >
              <BuserviceUserSelect
                  placeholder="输入服务商的员工姓名"
                  size="large"
                  ajax={ajax}
                  allowClear
                  notFoundContent=""
                  channel="outter_user_channels"
                  searchScope="job_scope"
                  scopeTarget={this.state.jobId}
                  disabled={!this.state.jobId || !!getFieldValue('leadsId')}
                  {...getFieldProps('providerBdId')}
                  buserviceUrl={window.APP.buserviceUrl}
                  style={{width: '100%'}}/>
            </Col>
          </Row> :
          <Row>
            <Col span="8">
              <FormItem
                label="创建人："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <BuserviceUserSelect ajax={ajax}
                   placeholder="输入员工名"
                   allowClear
                   notFoundContent=""
                   disabled={!!getFieldValue('leadsId')}
                   channel="outter_user_channels"
                   searchScope={window.APP.jobPath ? 'job_scope' : 'global'}
                   scopeTarget={window.APP.jobPath}
                   {...getFieldProps('bdId')}
                   buserviceUrl={window.APP.buserviceUrl}
                   style={{width: '100%'}}/>
              </FormItem>
            </Col>
          </Row>}
        <Row>
          <Col span="16">
            <div style={{height: 1}}></div>
          </Col>
          <Col span="2" offset="4" style={{textAlign: 'right'}}>
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

export default Form.create()(NotEffectiveLeadsForm);
