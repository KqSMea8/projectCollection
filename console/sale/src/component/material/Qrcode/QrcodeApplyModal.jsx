import React, { PropTypes } from 'react';
import { Modal, Form, Select, Input, Row, Col } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';

const FormItem = Form.Item;
const Option = Select.Option;

let quantityLimit = Number.MAX_VALUE;

const QrcodeApplyModal = React.createClass({
  propTypes: {
    visible: PropTypes.bool,
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    confirmLoading: PropTypes.bool,
    types: PropTypes.object,
  },

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.onOk(values);
      }
    });
  },

  handleClose() {
    Modal.confirm({
      title: '确认放弃当前编辑吗？',
      content: '无法保存当前草稿',
      onOk: () => {
        this.props.form.resetFields();
        this.props.onCancel();
      },
    });
  },

  checkQuantity(rule, value, callback) {
    if (value) {
      if (!/^\d+$/.test(value) || value < 1) {
        callback(new Error('输入数字不符合要求，请输入正整数'));
      } else if (value > quantityLimit) {
        callback(new Error(`单次生成数量不超过${quantityLimit}个`));
      }
    }
    callback();
  },

  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const { visible, confirmLoading, types } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const typeOptions = Object.keys(types)
      .filter(k => {
        const { permissionList, hidden } = types[k];
        return !hidden && (permissionList.length === 0 || permissionList.every(p => permission(p.permission)));
      })
      .map(k => <Option value={k} key={k}>{types[k].readableName}</Option>);
    const defaultType = Object.keys(types)[0];
    const { sampleImage } = types[getFieldValue('stuffAttrId')] || {};
    ({ quantityLimit } = types[getFieldValue('stuffAttrId')] || {});
    return (<Modal
        title="申请二维码"
        width={720}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleClose}
        confirmLoading={confirmLoading}>
      <Row style={{ padding: '6px 20px' }}>
        <p>生成物料样式范例</p>
      </Row>
      <Row style={{ padding: '0 20px' }}>
        <Col span="8">
          <p style={{ height: 280 }}>
            <img src={sampleImage} alt="生成物料样式范例图片" width="200px"/>
          </p>
        </Col>
        <Col span="16">
          <Form horizontal>
            <FormItem label="二维码类型：" required {...formItemLayout} >
              <Select placeholder="请选择" {...getFieldProps('stuffAttrId', {
                initialValue: defaultType,
                rules: [{
                  required: true,
                  message: '请选择二维码类型',
                }]})}>
                {typeOptions}
              </Select>
            </FormItem>
            <FormItem label="生成数量：" required {...formItemLayout} >
              <Input placeholder={`单次生成数量不超过${quantityLimit}个`} {...getFieldProps('quantity', {
                rules: [{
                  required: true,
                  message: '请输入生成数量',
                }, {
                  validator: this.checkQuantity,
                }]})} />
            </FormItem>
            <FormItem label="备注：" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
              <Input type="textarea" rows="5" placeholder="请输入" {...getFieldProps('remark')}/>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Modal>);
  },
});

export default Form.create()(QrcodeApplyModal);
