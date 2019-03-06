import React, { Component } from 'react';
import { Modal, message } from 'antd';

class FrameContainer extends Component {
  state = {
    height: 250,
  };

  componentDidMount() {
    const frameWindow = document.getElementById('frame').contentWindow;
    window.addEventListener('message', (event) => {
      if (event.source === frameWindow) {
        try {
          const data = JSON.parse(event.data);
          if (data.pageHeight) {
            this.setState({
              height: data.pageHeight,
            });
          }
          if (data.action === 'configCommission') {
            console.log(data);
            this.handleResult(data);
          }
        } catch (err) {
          message.error(err.message);
          console.error(err);
        }
      }
    }, false);
  }

  handleResult(data) {
    if (data.resultStatus === 'succeed') {
      // 签约成功
      message.success('设置成功');
      this.props.success();
    } else if (data.resultStatus === 'failed') {
      // 签约失败
      message.error(data.resultMsg);  // 失败具体信息
    } else if (data.resultStatus === 'canceled') {
      // 用户取消
      // message.info('用户取消');
      this.props.cancel();
    } else {
      // 异常情况
      message.error(data.resultMsg || '请求出错');
    }
  }

  render() {
    const { bizId, visible } = this.props;
    return (
      <Modal
        visible = {visible}
        title="设置口碑客推广"
        onCancel={() => {this.props.cancel();}}
        footer={false}
      >
        <iframe id="frame" src={`http://kbadvert-d8162.alipay.net/mg/mainForIFrame.htm#/promoters/delegate/baobei?bizId=${bizId}`} frameBorder="0" width="100%" height={this.state.height}></iframe>
      </Modal>
    );
  }
}

export default FrameContainer;
