import React, {PropTypes} from 'react';
import {DatePicker, Row, Col, Button, Form, TreeSelect, Input, Select, Tooltip, Cascader, message} from 'antd';
import classnames from 'classnames';
import {queryPurposeOptionData} from '../common/queryVisitPurpose';
import ajax from 'Utility/ajax';
import VisitSelect from '../common/VisitSelect';
import VisitPurposeUserSelect from '../common/VisitPurposeUserSelect';
import moment from 'moment';
import {formatDate} from '../common/Utils';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const RecordEditorForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    type: PropTypes.string,
    params: PropTypes.object,
    day: PropTypes.any,
    role: PropTypes.array,
    // 这里的shopId是从我的门店,已开门店 ,列表项操作下拉里的拜访小记里传过来
    shopId: PropTypes.any,
    // 这里的leadsId是从有效leads ,列表项操作下拉里的拜访小记里传过来
    leadsId: PropTypes.any,
    userType: PropTypes.string,
    typeList: PropTypes.any,
    isExportVisitRecord: PropTypes.bool, // 控制 导出拜访小记的按钮是否展示
    isPosSale: PropTypes.bool,
  },

  getInitialState() {
    return {
      collapsed: true,
      treeData: [],
      treeValue: '',
      defaultDate: [],
      cities: []
    };
  },
  componentWillMount() {
    this.onSearch();
    /* 拜访小记 -- 支持按城市功能后端5.18 来不及；下次上；*/
    this.fetchCities(cities => {
      const formatedCities = this.formatCities(cities);
      this.setState({
        cities: formatedCities,
        city: [cities[0].i, cities[0].c[0].i],
        cityName: cities[0].c[0].n,
        cityCode: cities[0].c[0].i
      });
    });
  },
  componentDidMount() {
    queryPurposeOptionData(true).then(treeData => this.setState({ treeData }));
    // 如果是从index.htm#/shop/my 我的门店已开门店跳转过来的则默认会带一个shopId
    this.queryDataByShopId();
    // 如果是从index.htm#/private-leads/valid 跳转过了,带个leadsId
    this.queryDataByLeadsId();
    // 为了设置从首页跳转过来的链接把搜索条件直接加上
    const info = {};
    if (this.props.day === 'Today') {
      info.dateRange = [ this.getTodayStr('start'), this.getTodayStr('end') ];
      this.props.form.setFieldsValue(info);
      info.beginDate = formatDate(info.dateRange[0]) || '';
      info.endDate = formatDate(info.dateRange[1]) || '';
      delete info.dateRange;
    } else if (this.props.day === 'OthersDay') {
      info.dateRange = [ moment(this.getDateStr(-30)).format('YYYY-MM-DD HH:mm'), moment(this.getDateStr(-1)).format('YYYY-MM-DD HH:mm') ];
      this.props.form.setFieldsValue(info);
      info.beginDate = moment(info.dateRange[0]).format('YYYY-MM-DD HH:mm') || '';
      info.endDate = moment(info.dateRange[1]).format('YYYY-MM-DD HH:mm') || '';
      delete info.dateRange;
    }
    if (this.props.role && this.props.role.length > 0) {
      if (this.props.day === 'Today' || this.props.day === 'OthersDay') {
        this.props.onSearch(info);
      }
    }
  },
  onKeyDown(e) {
    // e.preventDefault();
    if (e.keyCode === 13) {
      this.onSearch();
    }
  },
  onSearch(type) {
    this.props.form.validateFields((error, values)=> {
      const info = values;
      if (error) {
        return;
      }
      if (info.dateRange) {
        info.beginDate = info.dateRange[0] ? formatDate(info.dateRange[0]) : '';
        info.endDate = info.dateRange[1] ? formatDate(info.dateRange[1]) : '';
        delete info.dateRange;
      }
      if ( type === 'download') {
        info.downloadType = 'download';
      }
      if (this.props.type === 'BRAND') {
        info.customerId = info.customer;
        delete info.customer;
      }
      if (info.ownerId) {
        info.ownerId = info.ownerId.loginName;
      }
      if (info.visitPersonId) {
        info.visitPersonId = info.visitPersonId.loginName;
      }
      if (info.citiesCode) {
        // 后端定义的；要传 citycode  + ',' ;(微醺。。)；
        info.citiesCode = info.citiesCode[1] + ',';
      }
      this.props.onSearch(info);
    });
  },
  onChangeDate(value) {
    const dateRange = this.props.form.getFieldValue('dateRange');
    if (value === 'Today') {
      this.setState({ defaultDate: [ this.getTodayStr('start'), this.getTodayStr('end') ] });
      dateRange[0] = this.getTodayStr('start');
      dateRange[1] = this.getTodayStr('end');
    } else {
      this.setState({ defaultDate: [ moment(this.getDateStr(-30)).format('YYYY-MM-DD HH:mm'), moment(this.getDateStr(-1)).format('YYYY-MM-DD HH:mm') ] });
      dateRange[0] = moment(this.getDateStr(-30)).format('YYYY-MM-DD HH:mm');
      dateRange[1] = moment(this.getDateStr(-1)).format('YYYY-MM-DD HH:mm');
    }
    this.onSearch();
  },
  onChangeCity(value) {
    this.props.form.setFieldsValue({
      citiesCode: value,
    });
  },
  onChange(value) {
    this.setState({ value });
  },
  onReset(e) {
    e.preventDefault();
    this.props.params.brandId = '';
    this.props.params.brandName = '';
    this.props.form.resetFields();
    const dateRange = this.props.form.getFieldValue('dateRange');
    this.setState({ defaultDate: [ '', '']});
    dateRange[0] = '';
    dateRange[1] = '';
  },
  getDateStr(AddDayCount) {
    const dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);
    return dd;
  },
  getTodayStr(time) {
    const dd = new Date();
    const y = dd.getFullYear();
    const m = dd.getMonth() + 1;
    const d = dd.getDate();
    switch (time) {
    case 'start': return y + '-' + m + '-' + d + ' 00:00';
    case 'end' : return y + '-' + m + '-' + d + ' 23:59';
    default: return null;
    }
  },
  formatCities(cities) {
    return cities.map(city => {
      const formatedCity = {};
      if (city.c && city.c.length > 0) {
        formatedCity.children = this.formatCities(city.c);
      }
      formatedCity.value = city.i;
      formatedCity.label = city.n;
      return formatedCity;
    });
  },
  fetchCities(callback) {
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryAreas.json`,
      method: 'get',
      type: 'json',
      success: (cityRes) => {
        if (!cityRes) {
          return;
        }
        if (cityRes.status && cityRes.status === 'succeed') {
          callback(cityRes.data);
        } else {
          if (cityRes.errorMsg) {
            message.error(cityRes.errorMsg, 3);
          }
        }
      },
    });
  },
  queryDataByShopId() {
    if (this.props.shopId) {
      this.props.form.setFieldsValue({customerId: this.props.shopId});
      this.props.onSearch({customerId: this.props.shopId});
    }
  },

  queryDataByLeadsId() {
    if (this.props.leadsId) {
      this.props.form.setFieldsValue({customerId: this.props.leadsId});
      this.props.onSearch({customerId: this.props.leadsId});
    }
  },
  searchJob(merchant) {
    this.setState({'jobId': ''});
    this.props.form.setFieldsValue({'providerBdId': ''});
    if (merchant.partnerId) {
      ajax({
        'url': '/sale/merchant/queryJobPath.json',
        'data': {partnerId: merchant.partnerId},
        'success': ({data = ''} = {}) => {
          this.setState({'jobId': data});
        },
      });
    }
  },

  render() {
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const type = this.props.type;
    const isPosSale = this.props.isPosSale;
    const userType = this.props.userType === 'BUC' ? false : true;
    const formItemLayout = {
      labelCol: { span: '6' },
      wrapperCol: { span: '18' },
    };
    const tProps = {
      treeData: this.state.treeData,
      value: this.state.treeValue,
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_CHILD,
      searchPlaceholder: '请选择',
      style: {
        width: '100%',
      },
    };
    const {typeList} = this.props;
    const isPosLeads = this.props.isPosSale;
    return (<div onKeyDown={this.onKeyDown}>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="16">
            <FormItem
              label="拜访时间："
              labelCol={{span: 3}}
              wrapperCol={{span: 21}}>
              <RangePicker style={{width: '70%'}}
              showTime
              format="yyyy-MM-dd HH:mm"
              {...getFieldProps('dateRange', {
                initialValue: this.state.defaultDate,
              })} />
              <Button type="ghost" onClick={this.onChangeDate.bind(this, 'Today')} style={{marginLeft: '8px'}} >今日</Button>
              <Button type="ghost" onClick={ this.onChangeDate }>近30日</Button>
            </FormItem>
          </Col>
          <Col span="8" style={{height: 32}}>
          <FormItem label="区域：" { ...formItemLayout }>
            <Cascader {...getFieldProps('citiesCode')}
            options={this.state.cities}
            placeholder="请选择城市"
            onChange={this.onChangeCity}
            defaultValue={this.props.defaultValue}
            expandTrigger="hover"
            style = {{width: '65%'}}/>
          </FormItem>
        </Col>
        </Row>
        <Row>
          <Col span="8">
            {
              type !== 'BRAND' ?
              <FormItem label="拜访门店：" { ...formItemLayout }>
                <Input {...getFieldProps('customerName', {initialValue: ''})} placeholder="请输入"/>
              </FormItem> :
              <FormItem label="拜访品牌：" { ...formItemLayout }>
                <VisitSelect customerName={this.props.params.brandName} isPosSale={isPosSale} type="BRAND" style={{ width: '100%' }} placeholder="请输入" {...getFieldProps('customer', {initialValue: this.props.params.brandId })}/>
              </FormItem>
            }
          </Col>
          <Col span="8">
            {
              type === 'BRAND' ?
              <FormItem label="品牌ID：" { ...formItemLayout }>
                <Input {...getFieldProps('customerId')} placeholder="请输入"/>
              </FormItem>
              :
              <FormItem label="门店ID：" { ...formItemLayout }>
                <Input {...getFieldProps('customerId')} placeholder="请输入"/>
              </FormItem>
            }
          </Col>
          { type !== 'BRAND' && <Col span="8">
            <FormItem
             { ...formItemLayout }
             label={ (isPosSale === true && type === 'SHOP') ? '代运营归属人：' : '归属人：'}>
              {!isPosLeads && <Col span="4" style={{minWidth: 130}}>
                <Select size="large" style={{ width: 120 }} {...getFieldProps('ownerType', {
                  initialValue: this.props.userType === 'BUC' ? 'BD' : 'PROVIDER',
                })}>
                  <Option value="BD" disabled={userType} >内部BD</Option>
                  <Option value="PROVIDER">服务商</Option>
                  <Option value="P_STAFF">服务商员工</Option>
                </Select>
              </Col>}
              <Col span={isPosLeads ? '16' : '10'}>
                <VisitPurposeUserSelect {...getFieldProps('ownerId')} placeholder="请输入" userType={isPosLeads ? 'BD' : getFieldValue('ownerType')}/>
              </Col>
            </FormItem>
          </Col>}
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="拜访目的："
              { ...formItemLayout }
              validateStatus={classnames({error: !!getFieldError('visitPurposes')})}
              help={getFieldError('visitPurposes') || true }>
              <TreeSelect {...tProps} {...getFieldProps('visitPurposes', {
                onChange: this.onChange,
                rules: [{
                  max: 6,
                  message: '不能超过6个选项',
                  type: 'array',
                }],
              })}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="拜访方式：" { ...formItemLayout }>
              <Select {...getFieldProps('visitWay', {
                initialValue: '',
              })} placeholder="请输入">
                <Option value="">全部</Option>
                <Option value="VISIT_DOOR">上门</Option>
                <Option value="VISIT_PHONE">电话</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
             { ...formItemLayout }
             label="拜访人：">
              {!isPosLeads && <Col span="4" style={{minWidth: 130}}>
                <Select size="large" style={{ width: 120 }} {...getFieldProps('visitPersonType', {
                  initialValue: this.props.userType === 'BUC' ? 'BD' : 'P_STAFF',
                })}>
                  <Option value="BD" disabled={userType} >归属内部BD</Option>
                  <Option value="PROVIDER">归属服务商</Option>
                  <Option value="P_STAFF">归属服务商员工</Option>
                </Select>
              </Col>}
              <Col span={isPosLeads ? '16' : '10'}>
                <VisitPurposeUserSelect {...getFieldProps('visitPersonId')} placeholder="请输入" userType={isPosLeads ? 'BD' : getFieldValue('visitPersonType')}/>
              </Col>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            {
              type !== 'BRAND' ? <FormItem
                { ...formItemLayout }
                label="物料类型：">
                  <Select size="large" {...getFieldProps('stuffType')} placeholder="请选择">
                    <Option value="">全部</Option>
                    {typeList.map((obj) => {
                      return (<Option value={obj.key} key={obj.key}>{obj.value}</Option>);
                    })}
                  </Select>
              </FormItem> : <div style={{height: '1px'}}></div>
            }
          </Col>
          <Col span="8">
            <div style={{height: '1px'}}></div>
          </Col>
          <Col span="8" style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.onSearch}>搜索</Button>
            <Button type="ghost" onClick={this.onReset} style={{marginLeft: '8px'}} >清除条件</Button>
            { this.props.isExportVisitRecord ?
              <Tooltip placement="topRight" title="今日实时数据导出一次控制在4000条内">
                <Button type="ghost" onClick={ this.onSearch.bind(this, 'download') } style={{marginLeft: '8px'}} >导出拜访小记(.xls)</Button>
              </Tooltip>
              : null }
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(RecordEditorForm);
