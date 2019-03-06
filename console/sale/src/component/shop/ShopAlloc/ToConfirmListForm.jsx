import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, Icon} from 'antd';
import AreaSelect from '../../../common/AreaSelect';
import CategorySelect from '../../../common/CategorySelect';
import BrandSelect from '../../../common/BrandSelect';
import ShopTagSelect from '../../../common/ShopTagSelect';

const FormItem = Form.Item;

const ToConfirmListForm = React.createClass({
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
    if (info.categoryId) {
      info.categoryId = info.categoryId.filter(r => r);
      info.categoryCode = info.categoryId[info.categoryId.length - 1];
      delete info.categoryId;
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
            label="门店收款ID："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('cashId')} placeholder=""/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            label="门店标签："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <ShopTagSelect size="large" {...getFieldProps('shopTag', {initialValue: 'ALL'})}/>
          </FormItem>
        </Col>
      </Row>,
      <Row key="2" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            label="服务商名："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('providerName')} placeholder=""/>
          </FormItem>
        </Col>
      </Row>,
    ];
  },

  render() {
    const {getFieldProps} = this.props.form;
    const collapsed = this.state.collapsed;
    return (
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              label="门店ID："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('shopId')} placeholder=""/>
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
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="经营品类：">
              <CategorySelect {...getFieldProps('categoryId')} withAll/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem
              label="门店名称："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('shopName')} placeholder=""/>
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
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店地址：">
              <AreaSelect {...getFieldProps('area')} withAll/>
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

export default Form.create()(ToConfirmListForm);
