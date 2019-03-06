import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import AllCategorySelect from '../../shop/common/AllCategorySelect';
import BrandSelect from '../../shop/common/BrandSelect';
import AreaSelect from '../../shop/common/AreaSelect';

const FormItem = Form.Item;

const AddShopForm = React.createClass({
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
    if (area) {
      info.provinceCode = area[0];
      info.cityCode = area[1];
      info.districtCode = area[2];
      delete info.area;
    }
    if (info.brand) {
      info.brandId = info.brand.id;
      info.brandName = info.brand.name;
      delete info.brand;
    }
    if (info.categoryId) {
      info.categoryId = info.categoryId.filter(r => r);
      info.categoryCode = info.categoryId[info.categoryId.length - 1];
      delete info.categoryId;
    }
    info.range = 2;
    this.props.onSearch(info);
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    return (
      <Form horizontal className="advanced-search-form" form={this.props.form}>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店名称：">
              <Input {...getFieldProps('shopName')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店ID：">
              <Input {...getFieldProps('shopId')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="门店地址："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <AreaSelect {...getFieldProps('area')} placeholder="请选择" withAll/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              label="门店品牌："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <BrandSelect
                 disabled={!!getFieldValue('leadsId')}
                 {...getFieldProps('brand')}
               />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="品类："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
                <AllCategorySelect {...getFieldProps('categoryId')} placeholder="请选择" withAll/>
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

export default Form.create()(AddShopForm);
