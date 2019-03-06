import React, { PropTypes } from 'react';
import { Button, message } from 'antd';
import ajax from 'Utility/ajax';
import { guid } from '../../../common/utils';
import QrcodeApplyModal from './QrcodeApplyModal';

const QrcodeApplyButton = React.createClass({
  propTypes: {
    types: PropTypes.object,
  },

  getInitialState() {
    return {
      modalVisible: false,
      requestLoading: false,
    };
  },

  showModal() {
    this.setState({ modalVisible: true });
  },

  hideModal() {
    this.setState({ modalVisible: false });
  },

  handleSubmit({ stuffAttrId, quantity, remark }) {
    const uuid = guid();
    this.setState({ requestLoading: true });
    ajax({
      url: '/home/proxy.json',
      method: 'post',
      data: {
        mappingValue: 'kbasset.applyQrCode',
        requestId: uuid,
        stuffAttrId,
        quantity,
        remark,
      },
    }).then(result => {
      this.setState({
        modalVisible: false,
        requestLoading: false,
      });
      if (result.status === 'succeed') {
        message.success('申请成功，即将刷新列表');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(result);
      }
    }).catch((reason) => {
      this.setState({ requestLoading: false });
      message.error(reason.resultMsg || '申请失败');
    });
  },

  render() {
    const { modalVisible, requestLoading } = this.state;
    const { types } = this.props;
    return (<div>
      <Button type="primary" onClick={this.showModal}>申请二维码</Button>
      <QrcodeApplyModal
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.hideModal}
        confirmLoading={requestLoading}
        types={types} />
    </div>);
  },
});

export default QrcodeApplyButton;
