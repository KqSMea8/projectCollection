import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, Icon, Select, DatePicker} from 'antd';
import AreaSelect from '../../../common/AreaSelect';
import CategorySelect from '../../../common/CategorySelect';
import BrandSelect from '../../../common/BrandSelect';
import ProviderSelect from '../../../common/ProviderSelect';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import ajax from 'Utility/ajax';
import disabledFutureDate from '../../../common/disableFutureDate';
import {format} from '../../../common/dateUtils';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const StayOpenShopListForm = React.createClass({
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
    if (info.providerId) {
      info.providerId = info.providerId.partnerId;
    }
    if (info.providerBdId) {
      info.providerBdId = info.providerBdId.id;
    }
    if (info.bdId) {
      info.bdId = info.bdId.id;
    }
    if (info.dateRange) {
      info.startTime = format(info.dateRange[0]);
      info.endTime = format(info.dateRange[1]);
      delete info.dateRange;
    }
    const {area} = info;
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
    this.props.onSearch(info);
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
  renderMore() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const collapsed = this.state.collapsed;
    return [
      <Row key="1" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            label="品牌名称："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <BrandSelect {...getFieldProps('brandId')}/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            label="商户PID："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('merchantPid')} placeholder=""/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            label="门店进度："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Select size="large" {...getFieldProps('openProgressCode', {
              initialValue: 'ALL',
            })}>
                <Option value="ALL">全部状态</Option>
                <Option value="IN_PROGRESS">开店处理中</Option>
                <Option value="FAILED">开店失败</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>,
      <Row key="2" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            label="外部门店编号："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('outId')} placeholder=""/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            label="品类：">
            <CategorySelect
              withAll
              disabled={!!getFieldValue('shopId')}
              {...getFieldProps('categoryId')}
            />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="创建时间：">
              <RangePicker
                disabled={!!getFieldValue('leadsId')}
                {...getFieldProps('dateRange')}
                disabledDate={disabledFutureDate}
                showTime={false}/>
            </FormItem>
        </Col>
      </Row>,
    ];
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const collapsed = this.state.collapsed;
    return (
      <Form horizontal className="advanced-search-form">
        {window.APP.userType === 'BUC' ?
          <Row>
            <Col span="8">
              <FormItem
                label="创建人："
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
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店地址：">
              <AreaSelect {...getFieldProps('area')} withAll/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="商户名称："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('merchantName')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="门店名称："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('shopName')} placeholder=""/>
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
    );
  },
});

export default Form.create()(StayOpenShopListForm);
