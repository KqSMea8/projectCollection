import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, Select} from 'antd';
import ajax from 'Utility/ajax';
import CategorySelect from '../../../common/CategorySelect';
import BrandSelect from '../../../common/BrandSelect';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import ProviderSelect from '../../../common/ProviderSelect';
const Option = Select.Option;

const FormItem = Form.Item;

const ConfirmShopListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      collapsed: true,
    };
  },

  onSearch() {
    const info = {...this.props.form.getFieldsValue()};
    const {area} = info;
    if (info.providerId) {
      info.providerId = info.providerId.partnerId;
    }
    if (info.providerBdId) {
      info.providerBdId = info.providerBdId.id;
    }
    if (info.bdId) {
      info.bdId = info.bdId.id;
    }
    if (area) {
      info.provinceCode = area[0];
      info.cityCode = area[1];
      info.districtCode = area[2];
      delete info.area;
    }
    if (info.categoryId) {
      info.categoryId = info.categoryId.filter(r => r);
      info.categoryCode = info.categoryId[info.categoryId.length - 1];
      delete info.categoryId;
    }
    if (info.status === 'ALL') {
      info.status = '';
    }
    if (info.isKeyShop === 'ALL') {
      info.isKeyShop = '';
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
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    return (
      <Form horizontal className="advanced-search-form">
        {window.APP.userType === 'BUC' ?
          <Row>
            <Col span="6">
              <FormItem
                label="归属BD："
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}>
                <Select size="large" {...getFieldProps('serviceType', {
                  initialValue: 'service',
                })}>
                  <Option value="service">服务商</Option>
                  <Option value="bd">BD小二</Option>
                </Select>
              </FormItem>
            </Col>
            { getFieldValue('serviceType') === 'service' ?
              <Col span="11">
                <Col span="10" offset="1">
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
              </Col> :
              <Col span="5" offset="1">
                  <BuserviceUserSelect ajax={ajax}
                     placeholder="输入小二花名/真名"
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
              </Col>
            }
          </Row> :
          <Row>
            <Col span="8">
              <FormItem
                label="创建人："
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}>
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
          </Row>
        }
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店名称：">
              <Input placeholder="请输入" {...getFieldProps('shopName')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店ID：">
              <Input placeholder="请输入" {...getFieldProps('shopId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="门店品类："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <CategorySelect {...getFieldProps('categoryId')} withAll/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              label="品牌名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <BrandSelect {...getFieldProps('brandId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="操作类型："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Select size="large" {...getFieldProps('status')} defaultValue="value">
                <Option value="ALL">全部</Option>
                <Option value="SURROUND_SHOP">添加</Option>
                <Option value="REMOVE_SHOP">移除</Option>
              </Select>
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

export default Form.create()(ConfirmShopListForm);
