import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import ShopStatusSelect from '../../shop/common/ShopStatusSelect';
import AllCategorySelect from '../../shop/common/AllCategorySelect';
import BrandSelect from '../../shop/common/BrandSelect';

const FormItem = Form.Item;

const MallListForm = React.createClass({
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

  render() {
    const {getFieldProps} = this.props.form;
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
              label="门店状态："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <ShopStatusSelect size="large" {...getFieldProps('status', {initialValue: 'ALL'})}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
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

export default Form.create()(MallListForm);
