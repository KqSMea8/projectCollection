import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import CategorySelect from '../../../common/CategorySelect';
import CategoryByArea from '../../../common/AreaCategory/mixins';
import BrandSelect from '../../../common/BrandSelect';
import AreaSelect from '../../../common/AreaSelect';

const FormItem = Form.Item;

const AddShopForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  mixins: [CategoryByArea],

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
    this.props.onSearch(info);
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店名称：">
              <Input {...getFieldProps('shopName')} placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店ID：">
              <Input {...getFieldProps('shopId')} placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="门店品牌："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <BrandSelect {...getFieldProps('brandId')}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              label="门店地址："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <AreaSelect {...getFieldProps('area')} withAll/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="品类："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
                <CategorySelect {...getFieldProps('categoryId')} withAll/>
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
