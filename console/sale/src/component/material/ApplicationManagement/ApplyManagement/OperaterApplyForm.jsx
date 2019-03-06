import React, {PropTypes} from 'react';
import {Input, Row, Col, Button, Form, DatePicker, message} from 'antd';
import {History} from 'react-router';
import disabledFutureDate from '../../../../common/disableFutureDate';
import MaterialApplicationRecordApplyStatus from '../MaterialApplicationRecordApplyStatus';
import MaterialApplicationRecordMaterialType from '../MaterialApplicationRecordMaterialType';
import {format} from '../../../../common/dateUtils';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';
import kbAjax from '@alipay/kb-framework/framework/ajax';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
/*
 * 小二
 *
 **/
const ApplicationRecordForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    applycationType: PropTypes.string,
    type: PropTypes.string, // 类型（服务商或者小二）
  },

  mixins: [History],

  getInitialState() {
    const user = getLoginUser();
    const {userChannel} = user;
    this.user = user;
    this.isService = userChannel === 'BUC';// 是不是小二
    return {
      collapsed: true,
      providerData: {},// 服务商数据
    };
  },
  componentWillMount() {
    this.getUser(this.user);
  },
  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    if (info.dateRange) {
      info.gmtStart = format(info.dateRange[0]);
      info.gmtEnd = format(info.dateRange[1]);
    }
    if (info.storageType === 'KA') {
      if (info.kaParent) {
        info.storageCode = info.kaParent.merchantId;
      }
    } else if (info.storageType === 'CITY') {
      if (info.cityCode) {
        info.storageCode = info.cityCode[1];
      }
    } else if (info.storageType === 'YUNZONG') {
      info.storageCode = '2088021699414978';
    }
    if (info.cityCode) {
      info.cityCode = info.cityCode.join(',');
    }
    if (info.kaParent) {
      info.kaParent = info.kaParent.merchantId;
    }
    if (!this.isService) {
      // 服务商
      // 这个是后端偷懒
      // 在服务商查询单位查询单位 没写，，让前段填空
      info.storageName = '';
    }
    this.props.onSearch(info);
  },

  getCityCode(value) {
    this.props.form.setFieldsValue({
      cityCode: value,
    });
  },

  getUser(obj) {
    const {id} = obj;
    if (!this.isService) {
      // 服务商
      kbAjax({
        url: '/sale/asset/queryUserNameAdderss.json',
        method: 'get',
        data: {operatorId: id},
        type: 'json',
        success: (res) => {
          if (res.status === 'succeed') {
            this.setState({providerData: res.data});
          } else {
            message.error(res.resultMsg || '系统繁忙');
          }
        },
        error: (e) => {
          message.error(e.resultMsg || '系统繁忙');
        }
      });
    }
  },

  changeCollapsed(e) {
    e.preventDefault();
    this.setState({
      collapsed: !this.state.collapsed,
    });
  },
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps} = this.props.form;
    const realName = this.state.providerData.realName || '';
    return (<div>
      <Form className="advanced-search-form" horizontal onSubmit={this.onSearch}>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请单号："><Input placeholder="请输入" {...getFieldProps('orderId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请状态：">
              <MaterialApplicationRecordApplyStatus applycationType={this.props.applycationType}
                {...getFieldProps('status', {initialValue: ''})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="物料类型：">
              <MaterialApplicationRecordMaterialType applycationType={this.props.applycationType}
                {...getFieldProps('stuffAttrId', {initialValue: ''})}
                style={{width: '100%'}}/>
            </FormItem>
          </Col>

        </Row>
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请单位、城市："><Input placeholder="请输入" disabled={!this.isService} {...getFieldProps('storageName', {
                  initialValue: realName || '',
                })}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="申请日期：">
                <RangePicker {...getFieldProps('dateRange')} disabledDate={disabledFutureDate}
                showTime={false} style={{width: '100%'}}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6"><div style={{height: 1}}></div></Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button style={{marginRight: 12}} type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(ApplicationRecordForm);
