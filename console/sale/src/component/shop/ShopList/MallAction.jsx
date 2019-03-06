import React, {PropTypes} from 'react';
import {Popconfirm, Form, Input, Modal, message, Button} from 'antd';
import ajax from 'Utility/ajax';
const FormItem = Form.Item;

const MallAction = React.createClass({
  propTypes: {
    refresh: PropTypes.func,
    form: PropTypes.object,
    shopId: PropTypes.string,
  },

  getInitialState() {
    return {
      visible: false,
      loading: false
    };
  },

  handleOk() {
    const self = this;
    self.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      self.setState({
        loading: true,
      });

      ajax({
        url: '/support/control/offlineMall.json',
        method: 'get',
        data: {
          mallId: self.props.shopId,
          memo: values.offlineReason,
        },
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            message.success('下架成功！');
            self.props.refresh();
            self.setState({
              visible: false,
              loading: false,
            });
          }
        },
        error: (error) => {
          if (error) {
            message.error(error.resultMsg);
            self.setState({
              loading: false,
            });
          }
        },
      });
    });
  },

  openModal() {
    this.setState({
      visible: true,
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <span>
          <span className="ant-divider"></span>
          <Popconfirm title="确定要下架吗？" onConfirm={this.openModal}>
            <a href="#">下架</a>
          </Popconfirm>
          <Modal
            title="下架"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={[<Button key="cancel" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
             <Button key="confirm" type="primary" size="large" onClick={this.handleOk} loading={this.state.loading}>确定</Button>]}
          >
            <Form horizontal form={this.props.form}>
              <FormItem
                label="下架原因："
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                required>
                <Input type="textarea" placeholder="请输入下架原因，最多255个字符"
                  {...getFieldProps('offlineReason', { rules: [
                    { required: true, message: '请输入下架原因' },
                    { max: 255, message: '下架原因最多不超过255个字' },
                  ],
                  })} />
              </FormItem>
            </Form>
          </Modal>
      </span>
    );
  },
});

export default Form.create()(MallAction);
