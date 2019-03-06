import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import { DatePicker, Input, Row, Col, Button, Form, Select } from 'antd';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import BrandSelect from '../../../common/BrandSelect';
import disabledFutureDate from '../../../common/disableFutureDate';
import {format} from '../../../common/dateUtils';
import CategorySelect from '../../../common/CategorySelect';
import AreaSelect from '../../../common/AreaSelect';
import ProviderSelect from '../../../common/ProviderSelect';
import { LeadsTagGroupForFilter } from '../common/leadsTagEnums';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

const TeamLeadsForm = React.createClass({
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
      info.claimStartDate = format(info.dateRange[0]);
      info.claimEndDate = format(info.dateRange[1]);
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
    if (info.labels) {
      info.labels = info.labels.join(',');
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
              label="认领时间：">
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
              label="leadsID：">
              <Input placeholder="请输入" {...getFieldProps('leadsId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店名称："><Input placeholder="请输入" disabled={!!getFieldValue('leadsId')} {...getFieldProps('name')}/>
            </FormItem></Col>
        </Row>
        <Row>
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
              label="品类：">
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
              label="公司名称：">
              <Input placeholder="请输入" disabled={!!getFieldValue('leadsId')} {...getFieldProps('companyName')}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="品牌：">
              <BrandSelect disabled={!!getFieldValue('leadsId')} {...getFieldProps('brandId')}/>
            </FormItem>
          </Col>
          {window.APP.userType === 'BUC' ? <div>
          <Col span="3" offset="1" style={{minWidth: 100}}>
            <Select size="large" style={{ width: 120 }} {...getFieldProps('serviceType', {
              initialValue: 'bd',
            })}>
              <Option value="bd">归属BD</Option>
              <Option value="service">归属服务商</Option>
            </Select>
          </Col>
          { getFieldValue('serviceType') === 'bd' ?
              <Col span="4">
                 <BuserviceUserSelect ajax={ajax}
                     placeholder="输入BD名称"
                     size="large"
                     allowClear
                     notFoundContent=""
                     disabled={!!getFieldValue('leadsId')}
                     channel="inner_user_channels"
                     searchScope={window.APP.jobPath ? 'job_scope' : 'global'}
                     scopeTarget={window.APP.jobPath}
                    {...getFieldProps('bdId')}
                     buserviceUrl={window.APP.buserviceUrl}
                     style={{width: '100%'}}/>
              </Col> :
              <Col span="11">
                <Col span="10">
                  <ProviderSelect
                    placeholder="输入服务商名称"
                    size="large"
                    form={this.props.form}
                    disabled={!!getFieldValue('leadsId')}
                    {...getFieldProps('providerId', {
                      onChange: this.searchJob,
                    })}/>
                </Col>
                <Col span="10" offset="1">
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
              </Col> }
              </div> :
              <Col span="8">
                <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="归属员工：">
                <BuserviceUserSelect ajax={ajax}
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
              </Col>}
          <Col span="8">
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label="Leads标签：">
              <Select
                placeholder="请选择"
                disabled={(!!getFieldValue('leadsId'))}
                style={{ width: '100%' }}
                multiple
                showSearch={false}
                {...getFieldProps('labels') }>
                {LeadsTagGroupForFilter.map((group, index) => (
                  <OptGroup label={group.label} key={index}>
                    {group.children.map(item => <Option value={item.value}>{item.label}</Option>)}
                  </OptGroup>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
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

export default Form.create()(TeamLeadsForm);
