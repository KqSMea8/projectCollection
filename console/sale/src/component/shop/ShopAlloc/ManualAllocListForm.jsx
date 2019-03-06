import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, DatePicker, Icon} from 'antd';
import UserSelect from '../../../common/UserSelect';
import AreaSelect from '../../../common/AreaSelect';
import CategorySelect from '../../../common/CategorySelect';
import BrandSelect from '../../../common/BrandSelect';
import ShopTagSelect from '../../../common/ShopTagSelect';
import ShopTagOptions from '../common/ShopTagOptions';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
import ajax from 'Utility/ajax';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const disabledDate = (current) => {
  return current && current.getTime() > Date.now();
};

function adjustDateRange(startDate, endDate) {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
  return [start, end];
}

const ManualAllocListForm = React.createClass({
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
    }
    delete info.area;
    if (info.categoryId) {
      info.categoryId = info.categoryId.filter(r => r);
      info.categoryCode = info.categoryId[info.categoryId.length - 1];
      delete info.categoryId;
    }
    if (info.providerBdId) {
      info.providerBdId = info.providerBdId.id;
    }
    if (info.bdOwnerId) {
      info.bdOwnerId = info.bdOwnerId.id;
    }
    if (info.posSaleOwnerId) {
      info.posSaleOwnerId = info.posSaleOwnerId.id;
    }
    if (info.shopTagCode === 'ALL') {
      info.shopTagCode = '';
    }
    if (info.isKeyShop === 'ALL') {
      info.isKeyShop = '';
    }
    if (info.allocDate && info.allocDate.length === 2) {
      const range = adjustDateRange(info.allocDate[0], info.allocDate[1]);
      info.allocDateStart = range[0].getTime();
      info.allocDateEnd = range[1].getTime();
    }
    delete info.allocDate;

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
            label="商户PID："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('merchantPid')} placeholder=""/>
          </FormItem>
        </Col>
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
            label="服务商名："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('providerName')} placeholder=""/>
          </FormItem>
        </Col>
      </Row>,
      <Row key="2" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            label="分配时间："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <RangePicker {...getFieldProps('allocDate', {
              initialValue: [],
            })} disabledDate={disabledDate} showTime={false}/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            label={this.props.isPosSale ? 'POS销售归属人：' : '归属BD：'}
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <UserSelect
              style={{width: '100%'}}
              {...getFieldProps(this.props.isPosSale ? 'posSaleOwnerId' : 'bdOwnerId')}/>
          </FormItem>
        </Col>
      </Row>,
      <Row key="3" style={{display: collapsed ? 'none' : 'block'}}>
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
            label="服务商小二："
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
              label="门店标签："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              {this.props.isPosSale
                ? <ShopTagOptions placeholder="全部" showSearch={false} {...getFieldProps('shopTagCode')} />
                : <ShopTagSelect size="large" {...getFieldProps('shopTagCode', { initialValue: 'ALL' })} />
              }
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
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店地址：">
              <AreaSelect {...getFieldProps('area')} withAll/>
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

export default Form.create()(ManualAllocListForm);
