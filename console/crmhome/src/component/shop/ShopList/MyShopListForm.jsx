import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import BrandSelect from '../common/BrandSelect';
import AreaSelect from '../common/AreaSelect';
import AllCategorySelect from '../common/AllCategorySelect';
import ShopStatusSelect from '../common/ShopStatusSelect';
import {remoteLog} from '../common/utils';

const FormItem = Form.Item;

const MyShopListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      visible: false,
      value: 1,
    };
  },
  onChange(e) {
    this.setState({
      value: e.target.value,
    });
  },
  onAreaChange(area) {
    if (area && area.length > 0) {
      const cityId = area[area.length - 1];
      this.setState({
        cityId,
      });
    }
  },
  onSearch() {
    remoteLog('SHOP_MY_SEARCH');
    const info = {...this.props.form.getFieldsValue()};
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
    if (info.isKeyShop === 'ALL') {
      info.isKeyShop = '';
    }
    this.props.onSearch(info);
  },
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps} = this.props.form;
    return (
      <Form horizontal className="advanced-search-form" form={this.props.form}>
        <Row>
          <Col span="8">
            <FormItem
              label="门店ID："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('shopId')} placeholder="请输入门店ID"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店地址：">
              <AreaSelect {...getFieldProps('area', { onChange: this.onAreaChange })} placeholder="省-市-区" onAreaChange={this.onAreaChange} withAll/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="品牌名称："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <BrandSelect {...getFieldProps('brandId')} placeholder="请输入品牌名称"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              label="门店名称："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('shopName')} placeholder="请输入门店名称"/>
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
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="经营品类：">
              <AllCategorySelect {...getFieldProps('categoryId')} placeholder="请选择品类" withAll/>
            </FormItem>
          </Col>
        </Row>
        {window.APP.roleType === 'MALL_MERCHANT' ? null : (<Row>
          <Col span="8">
            <FormItem
              label="外部门店编号："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('outId')} placeholder="请输入编号"/>
            </FormItem>
          </Col>
        </Row>)}
        <Row>
          <div style={{float: 'right'}}>
            <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
            <Button type="ghost" style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
          </div>
        </Row>
      </Form>
    );
  },
});

export default Form.create()(MyShopListForm);
