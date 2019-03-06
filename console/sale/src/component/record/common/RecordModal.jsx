import { Button, Modal, Form, message, Input, Radio } from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {mobilephone} from '../../../common/validatorUtils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const RecordModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    customerId: PropTypes.string,
    result: PropTypes.func,
  },
  getInitialState() {
    return {
      loading: false,
      visible: false,
    };
  },
  onOK() {
    const _this = this;
    const id = this.props.customerId;
    if (id) {
      this.props.form.validateFields((error, values)=> {
        if (!error) {
          this.setState({ loading: true });
          ajax({
            url: '/sale/visitrecord/createVisitContacts.json',
            method: 'post',
            data: {...values, customerId: this.props.customerId},
            type: 'json',
            success: (result) => {
              if (!result) {
                return;
              }
              if (result.status && result.status === 'succeed') {
                message.success('新增成功');
                this.setState({ loading: false });
                this.props.result(true);
                setTimeout(()=> {
                  _this.onCancel();
                  _this.props.form.resetFields();
                }, 2000);
              }
            },
            error: (result) => {
              message.error(result.resultMsg);
              this.setState({ loading: false });
            },
          });
        }
      });
    } else {
      message.error('请先选择拜访门店/品牌');
    }
  },
  onCancel() {
    this.setState({
      visible: false,
    });
  },
  clickRecordModal(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({
      visible: true,
    });
  },
  render() {
    const {getFieldProps} = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <span>
        <a style={{marginLeft: '10px'}} onClick={this.clickRecordModal}>新增拜访对象</a>
        <Modal title="新增拜访对象" visible={this.state.visible} onCancel={this.onCancel}
          footer={[
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.onOK}>提交</Button>,
          ]}>
          <Form horizontal>
            <FormItem
              label="姓名："
              {...formItemLayout}>
              <Input placeholder="请填写" {...getFieldProps('name', {
                initialValue: '',
                validateFirst: true,
                rules: [{
                  required: true,
                  message: '此处必填',
                }, {
                  max: 10,
                  message: '不能超过10个字',
                  type: 'string',
                }],
              })}/>
            </FormItem>
            <FormItem
              label="电话："
              {...formItemLayout}>
              <Input placeholder="请填写" {...getFieldProps('tel', {
                initialValue: '',
                validateFirst: true,
                rules: [{
                  required: true,
                  message: '此处必填',
                }, mobilephone],
              })} />
            </FormItem>
            <FormItem
              label="职务："
              {...formItemLayout}>
              <RadioGroup {...getFieldProps('position', {
                initialValue: 'MANAGER',
                rules: [{
                  required: true,
                  message: '此处必填',
                }],
              })}>
                <Radio key="MANAGER" value="MANAGER">老板</Radio>
                <Radio key="SHOP_MANAGER" value="SHOP_MANAGER">店长</Radio>
                <Radio key="FINANCE" value="FINANCE">财务</Radio>
                <Radio key="SHOP_CLERK" value="SHOP_CLERK">店员</Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  },
});

export default Form.create()(RecordModal);
