import React, { PropTypes } from 'react';
import { Modal, Form, Input, Alert, message } from 'antd';
//  import {getUriParam} from '../../../common/utils';
import ajax from '../../../common/ajax';
const FormItem = Form.Item;

class RejectedModal extends React.Component {
  static propTypes = {
    sequenceId: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
  }

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const params = {
        rejectReason: values.memo,
        optType: 2,
      };
      if (this.props.itemId || this.props.sequenceId) {
        params.itemId = this.props.itemId || '';
        params.sequenceId = this.props.sequenceId || '';
      }
      ajax({
        url: '/goods/caterItem/merchantVerify.json',
        method: 'post',
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
          this.props.onOk();
        },
        error: (result) => {
          message.error(result.resultMsg || '系统异常', 3);
        },
      });
    });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (<Modal title="退回修改"
      visible={this.props.visible}
      onOk={this.handleOk}
      onCancel={this.props.onCancel}
    >
      <Alert message="是否确认将商品退回修改？" type="warning" showIcon />
      <p style={{ marginBottom: 12 }}>退回原因:</p>
      <div style={{ posetion: 'relative' }}>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormItem
            required
            validateStatus={!!getFieldError('memo') ? 'error' : 'success'}
            help={getFieldError('memo')}
          >
            <Input
              style={{ height: 200 }}
              type="textarea"
              {...getFieldProps('memo', {
                normalize(v) {
                  return (v || '').substr(0, 100);
                },
                rules: [{
                  required: true,
                  message: '请填写退回原因',
                }, {
                  type: 'string',
                  max: 100,
                }],
              }) } />
          </FormItem>
        </Form>
        <p style={{ position: 'absolute', right: 30, bottom: 100 }}>{(this.props.form.getFieldValue('memo') || '').length}/100</p>
      </div>
    </Modal>);
  }
}


export default Form.create()(RejectedModal);
