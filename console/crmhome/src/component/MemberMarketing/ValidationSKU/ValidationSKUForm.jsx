import React from 'react';
import {Button, Form, Select, Row, Col, Input, DatePicker, message} from 'antd';
// import AutoInvitationTable from './AutoInvitationTable';
import ajax from '../../../common/ajax';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
import {dateFormat} from '../../../common/dateUtils';

// 销售中台账户登录，需要获取merchantId，图片上传中增加op_merchant_id参数
const merchantIdInput = document.getElementById('J_crmhome_merchantId');
const merchantId = merchantIdInput ? merchantIdInput.value : '';

const ckeckData = (value, data) => {
  const datas = [];
  value.map((i) => {
    datas.push({
      key: i,
      value: data[i],
    });
  });
  return datas;
};
const ValidationSKUForm = React.createClass({

  getInitialState() {
    return {
      visible: false,
      isSupermarket: '',
      activityData: [],
      voucherData: [],
    };
  },

  componentWillMount() {
    this.getVoucherStatus();
    this.getActivityType();
  },

  getVoucherStatus() {
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm',
      method: 'get',
      data: {
        biz: 'supermarket.skucheck',
        action: '/skuCheck/voucherStatusEnum',
        data: JSON.stringify({'type': 'voucherStatus'}),
      },
      type: 'json',
      success: (res) => {
        const datas = ckeckData(Object.keys(res.enumMap) || [], res.enumMap) || [];
        datas.unshift({key: '', value: '所有券状态'});
        this.setState({
          voucherData: datas,
        });
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          message.error(res.errorMsg || '请求出错');
        });
      },
    });
  },

  getActivityType() {
    ajax({
      url: window.APP.kbretailprod + '/gateway.htm',
      method: 'get',
      data: {
        biz: 'supermarket.skucheck',
        action: '/skuCheck/activityTypeEnum',
        data: JSON.stringify({'type': 'activityType'}),
      },
      type: 'json',
      success: (res) => {
        const datas = ckeckData(Object.keys(res.enumMap) || [], res.enumMap) || [];
        datas.unshift({key: '', value: '所有来源'});
        this.setState({
          activityData: datas,
        });
      },
      error: (res) => {
        this.setState({
          loading: false,
          activityData: [],
        }, () => {
          message.error(res.errorMsg || '请求出错');
        });
      },
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      const params = {
        ...fieldsValue,
      };
      if (fieldsValue.activityTime) {
        params.voucherBeginTime = dateFormat(new Date(fieldsValue.activityTime[0].valueOf()), 'yyyy-MM-dd hh:mm:ss');
        params.voucherEndTime = dateFormat(new Date(fieldsValue.activityTime[1].valueOf()), 'yyyy-MM-dd hh:mm:ss');
        delete params.activityTime;
      }
      for (const key in params) {
        if (params.hasOwnProperty(key) && !params[key]) {
          delete params[key];
        }
      }
      this.props.onSearch(params);
    });
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
    // this.props.onSearch();
  },

  handDownload() {
    window.location = `${window.APP.kbretailprod}/downloadSkuCheck.htm?biz=supermarket.skucheck&action=/skuCheck/voucherSkuAllExcel&op_merchant_id=${merchantId}?data=${JSON.stringify(this.props.form.getFieldsValue())}`;
  },

  render() {
    const {getFieldProps} = this.props.form;
    const {activityData, voucherData} = this.state;
    return (
      <div>
        <Form form={this.props.form} onSubmit={this.handleSubmit} >
          <Row>
            <Col span="8">
              <FormItem
                label="活动来源："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Select
                  placeholder="请输入"
                  {...getFieldProps('activityType', {
                    initialValue: '',
                  })}>
                  {activityData.map((i) => {
                    return (<Option value={i.key}>{i.value}</Option>);
                  })}
                </Select>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="活动时间："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <RangePicker {...getFieldProps('activityTime')} showTime format="YYYY/MM/dd HH:mm:ss"/>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="券名称"
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('voucherName')} placeholder="请输入"/>
              </FormItem>
            </Col>
          </Row>
          <Row style={{ margin: '10px 0' }}>
            <Col span="8">
              <FormItem
                label="券状态："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Select
                  {...getFieldProps('voucherStatus', {
                    initialValue: '',
                  })}>
                  {voucherData.map((i) => {
                    return (<Option value={i.key}>{i.value}</Option>);
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="券ID："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('voucherId', {
                  initialValue: '',
                })} placeholder="请输入" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8" offset={'16'} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit" >搜索</Button>
              <Button onClick={this.handleClear} style={{ margin: '0 10px' }}>清除条件</Button>
              <Button onClick={this.handDownload}>下载验证详单</Button>
            </Col>
          </Row>
        </Form>
      </div>);
  },
});

export default Form.create()(ValidationSKUForm);
