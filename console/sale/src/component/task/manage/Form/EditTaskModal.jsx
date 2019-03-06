/**
 * @file EditTaskModal.jsx
 * @desc 编辑任务弹窗
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import noop from 'lodash/noop';

import SingleForm from './SingleForm/index';
import {FormMode} from '../../../../common/enum';

class EditTaskModal extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func
  };
  static defaultProps = {
    onSubmit: noop
  };
  state = {
    visible: false
  };
  /**
   * @param data 表单数据对象
   */
  open(data, id) {
    this.setState({ visible: true }, () => {
      this.id = id;
      this.form.setFieldsValue(data);
    });
  }
  close = () => {
    this.setState({ visible: false });
    this.form.resetFields();
  };
  handleSubmit = () => {
    const { validateFields } = this.form;
    const { onSubmit } = this.props;
    validateFields((error, data) => {
      if (error) {
        return;
      }
      onSubmit(data, this.id);
    });
  };
  bindFormRef = (c) => {
    if (c) {
      this.form = c.refs.wrappedComponent.props.form;
    } else {
      // unmounted
      this.form = null;
    }
  };
  data = null;
  id;
  form = null;
  render() {
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 }
    };
    return (
      <Modal
        title="编辑任务"
        visible={visible}
        width={800}
        onOk={this.handleSubmit}
        closable
        onCancel={this.close}
      >
        <SingleForm ref={this.bindFormRef} mode={FormMode.EDIT} formItemLayout={formItemLayout} />
      </Modal>
    );
  }
}

export default EditTaskModal;
