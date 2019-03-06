/**
 * @file AddTaskModal.jsx
 * @desc 新增任务弹窗
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Radio, Form } from 'antd';
import noop from 'lodash/noop';

import {FormMode} from '../../../../../common/enum';

import SingleForm from '../SingleForm';

const AddMode = {
  NEW: 'NEW', // 新建任务
  REL: 'REL' // 关联已有任务
};

class AddTaskModal extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func
  };
  static defaultProps = {
    onSubmit: noop
  };
  state = {
    visible: false
  };
  open(mode) {
    this.mode = mode;
    // 初次打开弹窗时form未实例化
    // 避免unmount的情况
    if (this.form) {
      this.form.resetFields();
    }
    this.setState({ visible: true });
  }
  close = () => {
    this.setState({ visible: false });
  };
  mode = AddMode.NEW;
  form = null;
  bindFormRef = (c) => {
    if (c) {
      this.form = c.refs.wrappedComponent.props.form;
    } else {
      // unmounted
      this.form = null;
    }
  };
  handleSubmit = () => {
    const { validateFields } = this.form;
    const { onSubmit } = this.props;
    validateFields((error, data) => {
      if (error) {
        return;
      }
      onSubmit(data);
    });
  };
  render() {
    const { visible } = this.state;
    const { formItemLayout } = this.props;
    return (
      <Modal
        title="添加任务"
        visible={visible}
        width={800}
        closable
        onOk={this.handleSubmit}
        onCancel={this.close}
      >
        <Form>
          <Form.Item label="任务来源" {...formItemLayout}>
            <Radio.Group value={AddMode.NEW}>
              <Radio value={AddMode.NEW}>新建任务</Radio>
              <Radio disabled value={AddMode.REL}>关联已有任务</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        <SingleForm ref={this.bindFormRef} formItemLayout={formItemLayout} mode={FormMode.CREATE} />
      </Modal>
    );
  }
}

export default AddTaskModal;
