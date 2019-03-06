import React from 'react';
import { Modal, Spin } from 'antd';
import './emeber.less';

class SecurityModal extends React.Component {
  state = {
    visible: true,
    loading: true,
  }
  onCancel() { // 如果是结果页关闭时需要刷新
    this.setState({visible: false}, () => {
      setTimeout(() => { // 等动画完时再进行unmount
        if (this.refs.service_form.contentWindow.location.href.indexOf('#/?_k') !== -1 && this.props.needReload) {
          location.reload();
        } else {
          this.props.onCancel();
        }
      }, 500);
    });
  }
  submit() {
    try {
      const {innerSubmit} = this.props;
      const btn = this.refs.service_form.contentWindow.document.querySelector(innerSubmit);
      btn.click();
    } catch (e) {
      this.onCancel();
    }
  }
  render() { // 老系统，弹窗内容是老的或跨系统，提交显示控制权外露，隐藏内部提交按钮，外部提交点击时控制内部按钮点击。
    const {frameProps = {}, src = '', needSpin} = this.props;
    const {loading, visible} = this.state;
    const appendStyle = frameProps.style || {};
    return (<Modal
        {...this.props}
        className="service-form"
        visible={visible}
        onOk={() => {
          this.submit();
        }}
        onCancel={() => {
          this.onCancel();
        }}
        wrapClassName="security-modal"
      >
        <iframe src={src} ref="service_form" {...frameProps} style={{display: loading && needSpin ? 'none' : 'block', ...appendStyle}} onLoad={() => {
          try {
            this.setState({loading: false});
            const frameDoc = this.refs.service_form.contentWindow.document;
            frameDoc.querySelector('.mi-dialog-title').setAttribute('style', 'display: none;');
            frameDoc.querySelector('.mi-dialog-footer').setAttribute('style', 'display: none;');
          } catch (e) {
            console.log(e);
          }
        }}/>
        {loading && needSpin ? <div className="emember-spin-container"><Spin /></div> : null}
      </Modal>);
  }
}

export default SecurityModal;
