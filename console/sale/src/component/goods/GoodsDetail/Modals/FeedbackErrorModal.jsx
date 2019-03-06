import React, {Component} from 'react';
import {Modal, Form, Select} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
class FeedbackErrorModal extends Component {

  onCancel() {
    this.props.onCancel();
  }

  onOk() {
    this.props.form.validateFields((errors, values)=>{
      if (!errors) {
        this.props.onOk(values); // 本次不传'报错原因'字段, 暂未用到values
      }
    });
  }

  render() {
    const {visible} = this.props;
    const {getFieldProps} = this.props.form;
    return (
      <Modal
        maskClosable={false}
        onCancel={this.onCancel.bind(this)}
        onOk={this.onOk.bind(this)}
        visible={visible}
        title="反馈报错">
          <Form>
            <FormItem
            label="报错原因"
            labelCol={{span: 5}}
            wrapperCol={{span: 15}}
            help={<div>请确认竞对商户门店下没有该商品。<br />若反馈属实，系统将在<span style={{color: 'red'}}>1小时后</span>自动删除／更新Leads。</div>}
            required
            >
              <Select
                placeholder="请选择"
                {...getFieldProps('FeedbackError', {rules: [{ required: true}]})}>
                  <Option value="0">竞对商品已下架／已更新</Option>
              </Select>
            </FormItem>
          </Form>
      </Modal>);
  }
}
export default createForm()(FeedbackErrorModal);
