import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, Select, Icon} from 'antd';
import AreaSelect from '../../../common/AreaSelect';
import CategorySelect from '../../../common/CategorySelect';
import BrandSelect from '../../../common/BrandSelect';
import {remoteLog, getQueryFromURL} from '../../../common/utils';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const BacklogShopListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    isService: PropTypes.bool, // true: 门店查询，客服小二使用；false：待开门店
  },

  getInitialState() {
    return {
      collapsed: true,
    };
  },

  componentDidMount() {
    const pid = getQueryFromURL(location.hash.split('?')[1]).pid;
    if (pid) {
      this.props.form.setFieldsValue({
        merchantPid: pid,
      });
      this.props.onSearch({merchantPid: pid});
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

  collapse(e) {
    e.preventDefault();
    this.setState({
      collapsed: !this.state.collapsed,
    });
  },

  renderMore() {
    const {getFieldProps} = this.props.form;
    const collapsed = this.state.collapsed;
    if (this.props.isService) {
      return [
        <Row key="1" style={{display: collapsed ? 'none' : 'block'}}>
          <Col span="8">
            <FormItem
              label="外部门店编号："
              {...formItemLayout}
            >
              <Input {...getFieldProps('outerShopId')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="经营品类："
            >
              <CategorySelect {...getFieldProps('categoryId')} withAll/>
            </FormItem>
          </Col>
        </Row>,
      ];
    }
    return [
      <Row key="1" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            label="外部门店编号："
            {...formItemLayout}
          >
            <Input {...getFieldProps('outerShopId')} placeholder=""/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            label="商户PID："
            {...formItemLayout}
          >
            <Input {...getFieldProps('merchantPid')} placeholder=""/>
          </FormItem>
        </Col>
      </Row>,
    ];
  },

  render() {
    const {getFieldProps} = this.props.form;
    const collapsed = this.state.collapsed;
    // const options = [];
    // if (permission('SHOP_QUERY_WAIT_IDENTIFIED')) {
    //   options.push(<Option key="ALL" value="ALL">全部状态</Option>,
    //             <Option key="IN_PROGRESS" value="IN_PROGRESS">开店处理中</Option>,
    //             <Option key= "WAIT_MERCHANT_CONFIRM" value="WAIT_MERCHANT_CONFIRM">待商户确认</Option>,
    //             <Option key="FAILED" value="FAILED">开店失败</Option>);
    // } else {
    //   options.push(<Option key="ALL" value="ALL">全部状态</Option>,
    //             <Option key="IN_PROGRESS" value="IN_PROGRESS">开店处理中</Option>,
    //             <Option key= "WAIT_MERCHANT_CONFIRM" value="WAIT_MERCHANT_CONFIRM">待商户确认</Option>,
    //             <Option key="FAILED" value="FAILED">开店失败</Option>);
    // }
    let rows;
    if (this.props.isService) {
      rows = [
        <Row key="1">
          <Col span="8">
            <FormItem
              label="商户PID："
              {...formItemLayout}
            >
              <Input {...getFieldProps('merchantPid')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="门店名称："
              {...formItemLayout}
            >
              <Input {...getFieldProps('shopName')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="品牌名称："
              {...formItemLayout}
            >
              <BrandSelect {...getFieldProps('brandId')}/>
            </FormItem>
          </Col>
        </Row>,
        <Row key="2">
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="门店地址："
            >
              <AreaSelect {...getFieldProps('area')} withAll/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="商户名称："
              {...formItemLayout}
            >
              <Input {...getFieldProps('merchantName')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="开店进度："
              {...formItemLayout}
            >
              <Select size="large" {...getFieldProps('openProgressCode', {
                initialValue: 'ALL',
              })}>
                <Option key="ALL" value="ALL">全部状态</Option>
                <Option key="IN_PROGRESS" value="IN_PROGRESS">开店处理中</Option>
                <Option key="FAILED" value="FAILED">开店失败</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>,
      ];
    } else {
      rows = [
        <Row key="1">
          <Col span="8">
            <FormItem
              label="门店名称："
              {...formItemLayout}
            >
              <Input {...getFieldProps('shopName')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="门店地址："
            >
              <AreaSelect {...getFieldProps('area')} withAll/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="品牌名称："
              {...formItemLayout}
            >
              <BrandSelect {...getFieldProps('brandId')}/>
            </FormItem>
          </Col>
        </Row>,
        <Row key="2">
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="经营品类："
            >
              <CategorySelect {...getFieldProps('categoryId')} withAll/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="商户名称："
              {...formItemLayout}
            >
              <Input {...getFieldProps('merchantName')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="开店进度："
              {...formItemLayout}
            >
              <Select size="large" {...getFieldProps('openProgressCode', {
                initialValue: 'ALL',
              })}>
                <Option key="ALL" value="ALL">全部状态</Option>
                <Option key="IN_PROGRESS" value="IN_PROGRESS">开店处理中</Option>
                <Option key="FAILED" value="FAILED">开店失败</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>,
      ];
    }
    return (
      <Form horizontal className="advanced-search-form">
        {rows}
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

export default Form.create()(BacklogShopListForm);
