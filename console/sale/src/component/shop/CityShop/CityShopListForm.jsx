import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, Icon} from 'antd';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import ajax from 'Utility/ajax';
import UserSelect from '../../../common/UserSelect';
import AreaSelect from '../common/CityShopAreaSelect';
import CategorySelect from '../common/CategorySelect';
import BrandSelect from '../../../common/BrandSelect';
import ShopStatusSelect from '../../../common/ShopStatusSelect';
import {remoteLog} from '../../../common/utils';
import ShopTagOptions from '../common/ShopTagOptions';
import KaSelectOptions from '../common/KaSelectOptions';

const FormItem = Form.Item;

const CityShopListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    // this.onSearch(this.props.params.id);
    return {
      collapsed: true,
      disabled: false,
      noneDisabled: false,
    };
  },
  onSearch(id) {
    remoteLog('SHOP_TEAM_SEARCH');
    let info = '';
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      info = values;
    });
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
    if (info.bdOwnerId) {
      info.bdOwnerId = info.bdOwnerId.id;
    }
    if (info.status === 'ALL') {
      info.status = '';
    }
    if (info.isKeyShop === 'ALL') {
      info.isKeyShop = '';
    }
    if (info.providerBdId) {
      info.providerBdId = info.providerBdId.id;
    }
    if (typeof id === 'string') {
      info.brandId = this.props.params.id;
    }
    // if (info.shopTagCode) {
    //   info.shopTagCode = info.shopTagCode.filter((val)=>{
    //     if (val === 'TKA') {info.ifTka = '1';}
    //     if (val === 'RKA') {info.ifRka = '1';}
    //     return val !== 'TKA' && val !== 'RKA';
    //   });
    // }

    if (info.ka) {
      if (info.ka === 'TKA') {info.ifTka = '1';}
      if (info.ka === 'RKA') {info.ifRka = '1';}
    }
    delete info.ka;

    // if (info.competitorName && info.competitorName.length > 0) {
    //   info.competitorName = info.competitorName.join(',');
    // }
    // if (info.dual12Label) {
    //   delete info.dual12Label;
    //   info.shopTagCode = 'happy20161212';
    // }
    this.props.onSearch(info);
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  collapse() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  },

  renderMore() {
    const {getFieldProps} = this.props.form;
    const collapsed = this.state.collapsed;
    return [
      <Row key="1" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            label="门店收款ID："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('cashId')} placeholder=""/>
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
            label="门店状态："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <ShopStatusSelect size="large" {...getFieldProps('status', {initialValue: 'ALL'})}/>
          </FormItem>
        </Col>
      </Row>,
      <Row key="2" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            label="品牌名称："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <BrandSelect brandName={this.props.params.name} {...getFieldProps('brandId', {initialValue: this.props.params.id})}/>
          </FormItem>
        </Col>
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
            label="经营品类：">
            <CategorySelect {...getFieldProps('categoryId')} withAll/>
          </FormItem>
        </Col>
      </Row>,
      <Row key="3" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            label="门店标签："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <ShopTagOptions placeholder="全部" showSearch={false} multiple {...getFieldProps('shopTagCode')}/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            label="KA标签："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <KaSelectOptions {...getFieldProps('ka', {initialValue: 'ALL'})} />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            label="服务商地推小二："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <BuserviceUserSelect ajax={ajax}
               placeholder="真名"
               size="large"
               allowClear
               notFoundContent=""
               channel="outter_user_channels"
               searchScope={window.APP.jobPath ? 'job_scope' : 'global'}
               scopeTarget={window.APP.jobPath}
              {...getFieldProps('providerBdId')}
               buserviceUrl={window.APP.buserviceUrl}
               style={{width: '100%'}} />
          </FormItem>
        </Col>
        {/* <Col span="8">
          <FormItem
            label="标签："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Checkbox {...getFieldProps('dual12Label')} /><span className="dual12Label">12.12</span>
          </FormItem>
        </Col>*/}
      </Row>
    ];
  },

  render() {
    const {getFieldProps} = this.props.form;
    const collapsed = this.state.collapsed;
    return (
      <Form horizontal className="kb-shop-list-form advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              label="归属BD："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <UserSelect
                style={{width: '100%'}}
                {...getFieldProps('bdOwnerId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="服务商名称："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('providerName')} placeholder=""/>
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
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店地址：">
              <AreaSelect {...getFieldProps('area', {
                rules: [{
                  required: true,
                  message: '此处必填',
                  type: 'array',
                }],
              })} withAll/>
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
              label="门店ID："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('shopId')} placeholder=""/>
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
              <a onClick={this.collapse}>
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

export default Form.create()(CityShopListForm);
