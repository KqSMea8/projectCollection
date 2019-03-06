import { Button, Modal, Form, message, Input } from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import classnames from 'classnames';

const FormItem = Form.Item;

const SupportModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.any,
    title: PropTypes.any,
    visible: PropTypes.any,
    onCancel: PropTypes.func,
  },
  getInitialState() {
    return {
      loading: false,
      visible: this.props.visible,
    };
  },

  onOK() {
    this.props.form.validateFields((error, values)=> {
      if (!error) {
        this.setState({ loading: true });
        let url = '/goods/koubei/cardPauseSupport.json';
        if (this.props.title === '恢复') {
          url = '/goods/koubei/cardResumeSupport.json';
        }
        ajax({
          url: window.APP.crmhomeUrl + url,
          method: 'post',
          data: {id: this.props.params.itemId, reason: values.reason},
          type: 'json',
          success: (result) => {
            if (!result) {
              return;
            }
            if (result.status && result.status === 'succeed') {
              message.success('操作成功');
              this.setState({ loading: false });
              setTimeout(()=> {
                location.reload();
              }, 3000);
            }
          },
          error: (result) => {
            message.error(result.resultMsg);
            this.setState({ loading: false });
          },
        });
      }
    });
  },
  fetch() {
  },
  render() {
    const {getFieldProps, getFieldError} = this.props.form;
    return (
      <div>
        <Modal title={this.props.title} visible={this.props.visible} onCancel={this.props.onCancel}
          footer={[
            <Button key="back" type="ghost" size="large" onClick={this.props.onCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.onOK}>提交</Button>,
          ]}>
          <Form horizontal>
            <FormItem
              required
              label="原因："
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}
              validateStatus={
              classnames({
                error: !!getFieldError('reason'),
              })}
              help={(getFieldError('reason')) || '限80个字'}>
              <Input {...getFieldProps('reason', {
                initialValue: '',
                validateFirst: true,
                rules: [{
                  required: true,
                  message: '此处必填',
                }, {
                  max: 80,
                  message: '限80个字',
                }],
              })} type="textarea" rows="3"/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  },
});

export default Form.create()(SupportModal);
