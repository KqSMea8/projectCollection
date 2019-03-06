import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, Select} from 'antd';
import AreaSelect from '../common/AreaSelect';
import AllCategorySelect from '../common/AllCategorySelect';
import BrandSelect from '../common/BrandSelect';
import {remoteLog} from '../common/utils';

const FormItem = Form.Item;
const Option = Select.Option;

const BacklogShopListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    return {};
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
    remoteLog('SHOP_BACKLOG_SEARCH');
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
    if (info.openProgressCode === 'ALL') {
      info.openProgressCode = '';
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
        <Row key="1">
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
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店地址：">
              <AreaSelect {...getFieldProps('area', { onChange: this.onAreaChange })} placeholder="省-市-区" withAll/>
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
        <Row key="2">
          <Col span="8">
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="经营品类：">
              <AllCategorySelect {...getFieldProps('categoryId')} placeholder="请选择品类" withAll/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="开店进度："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Select size="large" {...getFieldProps('openProgressCode', {
                initialValue: 'ALL',
              })}>
                <Option value="ALL">全部状态</Option>
                <Option value="IN_PROGRESS">开店处理中</Option>
                <Option value="FAILED">开店失败</Option>
                <Option value="WAIT_MERCHANT_CONFIRM">待确认</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            {window.APP.roleType !== 'MALL_MERCHANT' && <FormItem
              label="外部门店编号："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('outerShopId')} placeholder="请输入编号"/>
            </FormItem>}
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

export default Form.create()(BacklogShopListForm);
