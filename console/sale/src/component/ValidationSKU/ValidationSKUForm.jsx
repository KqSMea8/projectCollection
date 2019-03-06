import React from 'react';
import {Button, Form, Select, Row, Col, Input, DatePicker} from 'antd';
// import AutoInvitationTable from './AutoInvitationTable';
import {number2DateTime} from '../../common/dateUtils';
import ajax from 'Utility/ajax';
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

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
      activityType: [],
      voucherStatusData: [],
      belongAreaData: [],
      partnerLevelData: [],
      data: [],
    };
  },

  componentWillMount() {
    this.getVoucherStatus();
    this.getPartnerLevel();
    this.getBelongArea();
  },
  // 券状态
  getVoucherStatus() {
    ajax({
      url: window.APP.kbretailprodUrl + '/voucherSkuCheckKb.json',
      // url: 'http://kbretailprod-d2240.alipay.net/voucherSkuCheckKb.json',
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
          voucherStatusData: datas,
        });
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          // message.error('111');
        });
      },
    });
  },
  // 商户分层
  getPartnerLevel() {
    ajax({
      url: window.APP.kbretailprodUrl + '/voucherSkuCheckKb.json',
      // url: 'http://kbretailprod-d2240.alipay.net/voucherSkuCheckKb.json',
      method: 'get',
      data: {
        biz: 'supermarket.skucheck',
        action: '/skuCheck/partnerLevelEnum',
        data: JSON.stringify({'type': 'partnerLevel'}),
      },
      type: 'json',
      success: (res) => {
        const datas = ckeckData(Object.keys(res.enumMap) || [], res.enumMap) || [];
        datas.unshift({key: '', value: '所有分层'});
        this.setState({
          partnerLevelData: datas,
        });
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          // message.error( '111');
        });
      },
    });
  },
  // 归属大区
  getBelongArea() {
    ajax({
      url: window.APP.kbretailprodUrl + '/voucherSkuCheckKb.json',
      // url: 'http://kbretailprod-d2240.alipay.net/voucherSkuCheckKb.json',
      method: 'get',
      data: {
        biz: 'supermarket.skucheck',
        action: '/skuCheck/belongAreaEnum',
        data: JSON.stringify({'type': 'belongArea'}),
      },
      type: 'json',
      success: (res) => {
        const datas = ckeckData(Object.keys(res.enumMap) || [], res.enumMap) || [];
        datas.unshift({key: '', value: '所有大区'});
        this.setState({
          belongAreaData: datas,
        });
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          // message.error( '111');
        });
      },
    });
  },

  handleSubmit(e) {
    // const params = this.props.form.getFieldsValue();
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      const params = {
        ...fieldsValue,
      };
      if (fieldsValue.activityTime && fieldsValue.activityTime[0]) {
        console.log(fieldsValue.activityTime);
        params.voucherBeginTime = number2DateTime(new Date(fieldsValue.activityTime[0].valueOf()));
        params.voucherEndTime = number2DateTime(new Date(fieldsValue.activityTime[1].valueOf()));
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

  handleOk() {
    this.setState({
      visible: false,
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  handDownload() {
    window.location = `${window.APP.kbretailprodUrl}/downloadSkuCheckKb.htm?biz=supermarket.skucheck&action=/skuCheck/voucherSkuKbExcel&data=${JSON.stringify(this.props.form.getFieldsValue())}`;
  },

  render() {
    const {getFieldProps} = this.props.form;
    const {voucherStatusData, belongAreaData, partnerLevelData} = this.state || [];

    return (
      <div>
        <Form form={this.props.form} onSubmit={this.handleSubmit}>
          <Row>
            <Col span="8">
              <FormItem
                label="商户PID："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('partnerId')} placeholder="请输入"/>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="商户名称："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('partnerName')} placeholder="请输入"/>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="商户分层："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Select
                  {...getFieldProps('partnerLevel', {
                    initialValue: '',
                  })}>
                  {partnerLevelData.map((i) => {
                    return (<Option value={i.key} key={i.key}>{i.value}</Option>);
                  })}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem
                label="归属大区："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Select
                  {...getFieldProps('belongArea', {
                    initialValue: '',
                  })}>
                  {belongAreaData.map((i) => {
                    return (<Option value={i.key} key={i.key}>{i.value}</Option>);
                  })}
                </Select>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="券名称："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('voucherName')} placeholder="请输入"/>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="券时间："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <RangePicker {...getFieldProps('activityTime')} placeholder="请输入"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem
                label="券ID："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('voucherId')} placeholder="请输入"/>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="券状态："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Select
                  {...getFieldProps('voucherStatus', {
                    initialValue: '',
                  })}>
                  {voucherStatusData.map((i) => {
                    return (<Option value={i.key} key={i.key}>{i.value}</Option>);
                  })}
                </Select>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="归属BD："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('belongBd')} placeholder="请输入"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8" offset={'16'} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button onClick={this.handleClear} style={{margin: '0 10px'}}>清除条件</Button>
              <Button onClick={this.handDownload}>下载验证详单</Button>
            </Col>
          </Row>
        </Form>
      </div>);
  },
});

export default Form.create()(ValidationSKUForm);
