import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import {Modal} from 'antd';

import {getFeedbackReasonList, submitFeedback} from '../../../common/api';
import DealForm from './DealForm';

class TodoDealModal extends React.Component {
  static propTypes = {
    onSubmitOk: PropTypes.func,
  };
  static defaultProps = {
    onSubmitOk: noop,
  };
  constructor() {
    super();
    getFeedbackReasonList()
      .then(resp => {
        const { reasonList, resultList } = resp.data;
        this.setState({ reasonList, resultList });
      });
  }
  state = {
    visible: false,
    reasonList: [],
    resultList: [],
  };
  open(id) {
    this.todoTaskId = id;
    this.setState({ visible: true });
  }
  close() {
    this.setState({ visible: false });
  }
  handleOk = () => {
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const { result, reason, otherReason } = values;
      submitFeedback({
        todoTaskId: this.todoTaskId,
        result,
        reason,
        otherReason
      })
        .then(() => {
          this.props.onSubmitOk();
        });
    });
  };
  handleCancel = () => {
    this.close();
    this.form.resetFields();
  };
  bindFormRef = (c) => {
    if (c) {
      this.form = c.refs.wrappedComponent.props.form;
    } else {
      // unmounted
      this.form = null;
    }
  };
  form = null;
  todoTaskId;
  render() {
    const { visible, reasonList, resultList } = this.state;
    return (
      <Modal
        width={666}
        title="立即处理"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <DealForm resultList={resultList} reasonList={reasonList} ref={this.bindFormRef}/>
      </Modal>
    );
  }
}

export default TodoDealModal;
