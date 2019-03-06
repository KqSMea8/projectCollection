import React, { PropTypes } from 'react';
import { Modal, Form, Input, Alert, message } from 'antd';
//  import {getUriParam} from '../../../common/utils';
import ajax from '../../../common/ajax';
const FormItem = Form.Item;

const RejectedModal = React.createClass({
  propTypes: {
    confirmOrderId: PropTypes.string.isRequired,
    confirmHandleOk: PropTypes.func,
    confirmHandleCancel: PropTypes.func,
    returnModifyModal: PropTypes.bool,
  },

  getInitialState() {
    return {
      data: [],
      valueLength: 0,
    };
  },
  getInputValue(rule, value) {
    if (value.length >= 100) {
      this.props.form.setFieldsValue({ memo: value.substr(0, 100) });
      this.setState({
        valueLength: 100,
      });
    } else {
      this.setState({
        valueLength: value.length,
      });
    }
  },
  handleOk() {
    const params = {
      confirmOrderId: this.props.confirmOrderId,
      memo: this.props.form.getFieldValue('memo'),
    };
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leads/confirmorder/reject.json`,
      method: 'post',
      useIframeProxy: true,
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          message.success('提交成功', 3);
        } else {
          if (result.errorMsg) {
            message.error('提交失败', 3);
          }
        }
        this.props.confirmHandleOk();
      },
      error: (result) => {
        message.error(result.resultMsg, 3);
        // this.props.confirmHandleOk();   // 调试用
      },
    });
  },
  render() {
    const { getFieldProps } = this.props.form;
    return (<Modal title="退回修改"
      visible={this.props.returnModifyModal}
      onOk={this.handleOk}
      onCancel={this.props.confirmHandleCancel}
    >
      <Alert message="是否确认将商品退回修改？" type="warning" showIcon />
      <p style={{ marginBottom: 12 }}>退回原因:</p>
      <div style={{ posetion: 'relative' }}>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormItem
            help="">
            <Input
              style={{ height: 200 }}
              type="textarea"
              {...getFieldProps('memo', {
                rules: [{
                  validator: this.getInputValue,
                }],
              }) } />
          </FormItem>
        </Form>
        <p style={{ position: 'absolute', right: 30, bottom: 100 }}>{this.state.valueLength}/100</p>
      </div>
    </Modal>);
  },
});

export default Form.create()(RejectedModal);
