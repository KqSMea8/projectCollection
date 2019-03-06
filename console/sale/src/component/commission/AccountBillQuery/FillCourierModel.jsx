import React, {PropTypes} from 'react';
import {Modal, Form, Input, DatePicker} from 'antd';
import {format, transFormData, toDate} from '../../../common/dateUtils';
const FormItem = Form.Item;
const FillCourierModel = React.createClass({
  propTypes: {
    form: PropTypes.any,
    ModalVisible: PropTypes.any,
    handleCancel: PropTypes.func,
    handleOk: PropTypes.func,
    invoiceId: PropTypes.any,
  },

  getInitialState() {
    return {
      mailId: '',
      visible: this.props.ModalVisible,
    };
  },
  componentWillMount() {
    if (this.props.mailInfoVOdata) {
      const data = this.props.mailInfoVOdata[0] || {};
      data.senderTime = toDate(transFormData(data.mailDate));
      this.props.form.setFieldsValue(data);
      this.setState({
        mailId: data.mailId,
      });
    }
  },
  handleOk() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      if (values.senderTime) {
        const senderTime = format(values.senderTime).split('-');
        values.senderTime = senderTime.join('');
      }
      values.mailId = this.state.mailId;
      values.invoiceId = this.props.invoiceId;
      this.props.handleOk(values);
    });
  },

  invalidHandleCancel() {
    this.setState({
      visible: false,
    });
  },
  render() {
    const {getFieldProps, getFieldError} = this.props.form;
    const visible = this.props.ModalVisible;
    return (
    <Modal title="填写快递信息" visible={visible}
      onOk={this.handleOk} onCancel={this.props.handleCancel}>
    <Form horizontal onSubmit={this.handleOk}>
      <FormItem
        label="快递单号："
        required
        labelCol={{span: 6}}
        wrapperCol={{span: 10}}>
        <Input placeholder="请输入快递单号"
          {...getFieldProps('trackingNo', {
            validateFirst: true,
            rules: [{
              required: true,
              message: '此处必填',
            }],
          })}/>
      </FormItem>
      <FormItem
        label="快递公司："
        required
        labelCol={{span: 6}}
        wrapperCol={{span: 10}}>
        <Input {...getFieldProps('expressCompanyName', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '此处必填',
          }],
        })} style={{ width: '100%' }} placeholder="请输入快递公司" />
      </FormItem>
      <FormItem
        label="退票收件人："
        required
        labelCol={{span: 6}}
        wrapperCol={{span: 10}}>
        <Input placeholder="请输入发件人"
          {...getFieldProps('senderName', {
            validateFirst: true,
            rules: [{
              required: true,
              message: '此处必填',
            }],
          })}/>
      </FormItem>
      <FormItem
        label="联系方式："
        required
        labelCol={{span: 6}}
        wrapperCol={{span: 10}}>
        <Input placeholder="请输入联系方式"
          {...getFieldProps('senderTel', {
            validateFirst: true,
            rules: [{
              required: true,
              message: '此处必填',
            }],
          })}/>
      </FormItem>
      <FormItem
        label="退票收件地址："
        required
        help={(getFieldError('senderAddress') || '发票若被驳回按此地址寄回')}
        labelCol={{span: 6}}
        wrapperCol={{span: 10}}>
        <Input placeholder="请输入收货地址"
          {...getFieldProps('senderAddress', {
            validateFirst: true,
            rules: [{
              required: true,
              message: '此处必填',
            }],
          })}/>
      </FormItem>
      <FormItem
        label="发件时间："
        required
        labelCol={{span: 6}}
        wrapperCol={{span: 10}}>
        <DatePicker {...getFieldProps('senderTime', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '此处必填',
            type: 'date',
          }],
        })} style={{width: '100%'}} />
      </FormItem>
    </Form>
    </Modal>
  );
  },
});

export default Form.create()(FillCourierModel);
