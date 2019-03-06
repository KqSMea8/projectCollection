import React, { PropTypes } from 'react';
import { Modal } from 'antd';
const confirm = Modal.confirm;
const ConfirmOut = React.createClass({
  propTypes: {
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
  },
  componentDidMount() {
    this.showConfirm();
  },
  showConfirm() {
    const self = this;
    confirm({
      title: '离开页面将无法保存修改信息。',
      onOk() {
        self.props.onOk();
      },
      onCancel() {
        self.props.onCancel();
      },
    });
  },
  render() {
    return null;
  },
});

export default ConfirmOut;
