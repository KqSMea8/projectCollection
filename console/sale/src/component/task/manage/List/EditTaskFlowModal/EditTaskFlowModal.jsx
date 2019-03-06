import React from 'react';
import {Modal} from 'antd';

import EditTaskFlowForm from './EditTaskFLowForm';
import {updateTaskFlow} from '../../../common/api';

class EditTaskFlowModal extends React.Component {
  state = {
    visible: false
  };

  open(data, id) {
    const { name, description, status, bizType } = data;
    this.setState({visible: true}, () => {
      this.form.setFieldsValue({
        name, description, status, bizType
      });
      this.id = id;
    });
  }

  close = () => {
    this.form.resetFields();
    this.setState({visible: false});
  };

  id;
  form;

  handleSubmit = () => {
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      updateTaskFlow({
        taskFlowId: this.id,
        ...values
      })
        .then(this.props.onSubmitOk);
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

  render() {
    const {visible} = this.state;

    return (
      <Modal
        title="修改任务流"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.close}
      >
        <EditTaskFlowForm ref={this.bindFormRef} />
      </Modal>
    );
  }
}

export default EditTaskFlowModal;
