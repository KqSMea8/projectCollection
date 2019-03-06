import React, {PropTypes} from 'react';
import {Modal, Button} from 'antd';

const DetailModal = React.createClass({
  propTypes: {
    data: PropTypes.any,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  onOk() {
    this.props.onOk();
  },

  onCancel() {
    this.props.onCancel();
  },

  render() {
    const { data } = this.props;
    const jobConfigs = data.configs.join('、');
    const footer = <Button key="submit" type="primary" size="large" onClick={this.onOk}>确 定</Button>;

    return (<Modal title="查看岗位业务约束" visible onCancel={this.onCancel} footer={footer}>
      <h3>{data.jobName}</h3>
      <div style={{marginTop: 16}}>{jobConfigs}</div>
    </Modal>);
  },
});

export default DetailModal;
