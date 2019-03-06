import React, {PropTypes} from 'react';
import {Input, Row, Col, Button, Form, DatePicker, message} from 'antd';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
const FormItem = Form.Item;
import moment from 'moment';
import {format} from '../../../../common/dateUtils';
import MaterialLogisticsAuditStatusSelect from '../../../../common/MaterialLogisticsAuditStatusSelect';
import MaterialLogisticsapplySelect from '../../../../common/MaterialLogisticsapplySelect';
import MerchantPidSelect from '../../KoubeiCode/common/MerchantPidSelect/index.jsx';
import BrandSelect from '../../../../common/BrandSelect';
import UserSelect from '../../../../common/UserSelect';
const InputGroup = Input.Group;
const MaterialAcceptanceForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onSearch: PropTypes.func,
  },
  getInitialState() {
    return {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
  },
  componentWillMount() {
    const initialValue = {};
    initialValue.dateRange = [moment().add(-3, 'months').toDate(), moment().toDate()];
    this.props.form.setFieldsInitialValue(initialValue);
  },
  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    /*
    if (info.dateRange) {
      info.gmtApplyStartTime = format(info.dateRange[0]);
      info.gmtApplyEndTime = format(info.dateRange[1]);
      delete info.dateRange;
    }*/
    if (info.merchantName && info.merchantName.indexOf('/') !== -1) {
      info.merchantName = info.merchantName.substr(0, info.merchantName.indexOf('/'));
    }
    if (info.dateRange) {
      delete info.dateRange;
    }
    if (this.state.startValue) {
      info.gmtApplyStartTime = format(this.state.startValue);
    }
    if (this.state.endValue) {
      info.gmtApplyEndTime = format(this.state.endValue);
    }
    if (info.cityId) {
      info.cityId = info.cityId[1];
    }
    if (info.expressStatus === 'ALL') {
      delete info.expressStatus;
    }
    if (info.status === 'ALL') {
      delete info.status;
    }
    if (info.bucUser) {
      info.auditOperatorId = info.bucUser.id;
      delete info.bucUser;
    }
    if (info.providerName && info.providerName.displayName) {
      info.providerName = info.providerName.displayName;
      if (info.providerName && info.providerName.indexOf('(') !== -1) {
        info.providerName = info.providerName.substr(0, info.providerName.indexOf('('));
      }
    }
    this.props.onSearch(info);
  },
  onOutData() {
    //  导出数据
    const openurl = appendOwnerUrlIfDev('/sale/asset/batchKaStuffApplyOrderForGet.resource');
    let request = '';
    let totalQuest = '';
    if (this.props.pagination && this.props.pagination.total >= 20000) {
      message.error('请求的数据量过大，已超出最大值20000，无法完成导出。');
      return false;
    } else if (this.props.pagination && this.props.pagination.total <= 0 || !this.props.pagination) {
      message.error('没有数据可导出。');
      return false;
    }
    if (this.props.pagination && this.props.pagination.total) {
      totalQuest = '&totalSize=' + this.props.pagination.total + '&pageSize=' + this.props.pagination.pageSize + '&pageNum=' + this.props.pagination.current;
    }
    if (this.props.params) {
      for (const i in this.props.params) {
        if (this.props.params[i]) {
          request = request + '&' + i + '=' + window.encodeURIComponent(this.props.params[i]);
        }
      }
    }
    if (request) {
      request = request.replace(/&/, '?');
    }
    if (!request) {
      totalQuest = totalQuest.replace('&', '?');
    }
    window.open(openurl + request + totalQuest + '&_input_charset=utf-8');
  },
  onChange(field, value) {
    console.log(field, 'change', value);
    this.setState({
      [field]: value,
    });
  },
  onStartChange(value) {
    this.onChange('startValue', value);
  },
  onEndChange(value) {
    this.onChange('endValue', value);
  },
  getCityCode(value) {
    this.props.form.setFieldsValue({
      cityId: value,
    });
  },
  disabledStartDate(startValue) {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.getTime() >= this.state.endValue.getTime();
  },
  handleEndToggle({ open }) {
    this.setState({ endOpen: open });
  },
  handleStartToggle({ open }) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  },
  disabledEndDate(endValue) {
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return (endValue.getTime() <= this.state.startValue.getTime()) || (endValue.getTime() >= this.addMonth(this.state.startValue, 3).getTime() );
  },
  addMonth(now, value) {
    // ( 24 * 60 * 60 * 1000 * 1)
    const date = new Date(+now);
    date.setMonth(date.getMonth() + value);
    if (now.getDate() !== date.getDate()) {
      date.setDate(0);
    }
    return date;
  },
  reset(e) {
    e.preventDefault();
    this.setState({
      startValue: null,
      endValue: null,
      endOpen: false,
    });
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps} = this.props.form;
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请单发起日期：">
              <InputGroup size="large">
                <Col span="12">
                  <DatePicker disabledDate={this.disabledStartDate}
                  {...getFieldProps('gmtApplyStartTime')}
                  value={this.state.startValue}
                  placeholder="开始日期"
                  onChange={this.onStartChange}
                  toggleOpen={this.handleStartToggle}/>
                </Col>
                <Col span="12" style={{paddingRight: '0px'}}>
                  <DatePicker disabledDate={this.disabledEndDate} style={{width: '100%'}}
                  {...getFieldProps('gmtApplyEndTime')}
                  value={this.state.endValue}
                  placeholder="结束日期"
                  onChange={this.onEndChange}
                  open={this.state.endOpen}
                  toggleOpen={this.handleEndToggle}/>
                </Col>
              </InputGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="物流状态：">
              <MaterialLogisticsAuditStatusSelect
                {...getFieldProps('expressStatus', {initialValue: 'ALL'})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="物流：">
              <InputGroup size="large">
                <Col span="12">
                  <Input placeholder="请输入物流公司名称" {...getFieldProps('expressCompany')} />
                </Col>
                <Col span="12" style={{paddingRight: '0px'}}>
                  <Input style={{width: '100%'}} placeholder="请输入物流单号" {...getFieldProps('expressNo')} />
                </Col>
              </InputGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          {( window.APP.userType === 'BUC' ) ?
            <Col span="8">
              <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="服务商名称：">
                <UserSelect searchScope = "global" channel="outter_user_channels" {...getFieldProps('providerName') } />
              </FormItem>
            </Col>
            : null }
          <Col span="8">
            <FormItem
              label="品牌名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <BrandSelect {...getFieldProps('brandName')} isName/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="商户名称：">
              <MerchantPidSelect {...getFieldProps('merchantName') } isName />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请单状态：">
              <MaterialLogisticsapplySelect
                {...getFieldProps('status', {initialValue: 'ALL'})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <div style={{height: 1}}>
              <Button type="primary" style={{marginRight: 12}} onClick={this.onOutData}>导出数据</Button>
            </div>
          </Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" style={{marginRight: 0}} onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(MaterialAcceptanceForm);
