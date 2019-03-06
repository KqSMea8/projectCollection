import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, Icon, InputNumber} from 'antd';
import classnames from 'classnames';
import permission from '@alipay/kb-framework/framework/permission';
import BrandSelect from '../../../common/BrandSelect';
import AreaSelect from '../../../common/AreaSelect';
import CategorySelect from '../../../common/CategorySelect';
import ShopStatusSelect from '../../../common/ShopStatusSelect';
import ReportV2 from '../common/ReportV2';
import {History} from 'react-router';
import ShopTagOptions from '../common/ShopTagOptions';
import KaSelectOptions from '../common/KaSelectOptions';

const FormItem = Form.Item;

const MyShopListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    initBrand: PropTypes.object, // {id, name}
    isPosSale: PropTypes.bool,
  },
  mixins: [History],
  getDefaultProps() {
    return {
      form: {},
      onSearch: () => {},
    };
  },
  getInitialState() {
    return {
      collapsed: true,
      disabled: false,
      noneDisabled: false,
      initBrand: this.props.initBrand || {},
    };
  },
  componentDidMount() {
    if (this.state.initBrand) {
      this.props.form.setFieldsValue({
        brandId: this.state.initBrand.id,
      });
    }
    this.onSearch();
  },
  onSearch() {
    this.getParam(param => this.props.onSearch(param));
  },
  getParam(callback) {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const info = {...values};
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
        callback(info);
      }
    });
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

  checkQualityMin(rule, value, callback) {
    this.props.form.validateFields(['qualityScoreMax'], {force: true});
    callback();
  },

  checkQualityMax(rule, value, callback) {
    const min = this.props.form.getFieldValue('qualityScoreMin');
    if (!min && !value) {
      callback();
      return;
    }
    if (isNaN(min) || isNaN(value) || min > value) {
      callback(new Error('最大值需大于最小值'));
      return;
    }
    callback();
  },

  renderMore() {
    const {getFieldProps, getFieldError} = this.props.form;
    const collapsed = this.state.collapsed;
    return [
      <Row key="1" style={{display: collapsed ? 'none' : 'block'}}>
        <Col span="8">
          <FormItem
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            label="经营品类：">
            <CategorySelect {...getFieldProps('categoryId')} withAll/>
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
            label="商户PID："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('merchantPid')} placeholder=""/>
          </FormItem>
        </Col>
      </Row>,
      <Row key="2" style={{display: collapsed ? 'none' : 'block'}}>
        {!this.props.isPosSale ? <Col span="8">
          <FormItem
            label="门店收款ID："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <Input {...getFieldProps('cashId')} placeholder=""/>
          </FormItem>
        </Col> : undefined}
        <Col span="8">
          <FormItem
            label="质量分："
            help={getFieldError('qualityScoreMax')}
            validateStatus={classnames({
              error: !!getFieldError('qualityScoreMax'),
            })}
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <InputNumber style={{width: 88}} min={0} max={106} {...getFieldProps('qualityScoreMin', {
              rules: [this.checkQualityMin],
              initialValue: undefined,
            })} />
            <span style={{paddingRight: 8}} >-</span>
            <InputNumber style={{width: 88}} min={0} max={106} {...getFieldProps('qualityScoreMax', {
              rules: [this.checkQualityMax],
              initialValue: undefined,
            })} />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem
            label="门店标签："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <ShopTagOptions placeholder="全部" showSearch={false} multiple {...getFieldProps('shopTagCode')}/>
          </FormItem>
        </Col>
      </Row>,
      <Row key="3" style={{display: collapsed ? 'none' : 'block'}}>
        {!this.props.isPosSale ? <Col span="8">
          <FormItem
            label="KA标签："
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}>
            <KaSelectOptions {...getFieldProps('ka', {initialValue: 'ALL'})} />
          </FormItem>
        </Col> : undefined}
      </Row>,
    ];
  },

  render() {
    const {getFieldProps} = this.props.form;
    const collapsed = this.state.collapsed;
    return (
      <Form horizontal className="kb-shop-list-form advanced-search-form" onSubmit={this.onSearch}>
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
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              label="门店地址：">
              <AreaSelect {...getFieldProps('area')} withAll/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="品牌名称："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <BrandSelect brandName={this.state.initBrand.name}
                {...getFieldProps('brandId', {
                  initialValue: this.state.initBrand.id || '',
                  onChange: () => this.setState({ initBrand: {} }),
                })}
              />
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
              label="商户名称："
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}>
              <Input {...getFieldProps('merchantName')} placeholder=""/>
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
        {this.renderMore()}
        <Row>
          <Col span="6"><div style={{height: 1}}></div></Col>
          <Col span="10" offset="8">
            <div style={{float: 'right', marginTop: 5}}>
              <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
              {!this.props.isPosSale && permission('SHOP_REPORT_DOWNLOAD') &&
              <ReportV2 bdType="1" style={{marginRight: 12}} getParam={this.getParam.bind(this)}/>}
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

export default Form.create()(MyShopListForm);
