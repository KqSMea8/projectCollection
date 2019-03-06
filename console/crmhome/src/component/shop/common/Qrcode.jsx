import React, {PropTypes} from 'react';
import {Icon} from 'antd';
import QrcodeModal from './QrcodeModal';

const Qrcode = React.createClass({
  propTypes: {
    id: PropTypes.string,
    shopName: PropTypes.string,
    showText: PropTypes.bool,
    shopType: PropTypes.string,
    partnerId: PropTypes.string,
  },

  getInitialState() {
    return {
      showModal: false,
    };
  },

  onClick(e) {
    e.preventDefault();
    this.setState({
      showModal: true,
    });
  },

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    const {id, shopType, partnerId, shopName} = this.props;
    return (<div style={{display: 'inline-block'}}>
      <a href="#" style={{cursor: 'pointer'}} onClick={this.onClick}><Icon type="qrcode"/></a>
      {this.props.showText && <a href="#" style={{display: 'block', fontSize: 12}} onClick={this.onClick}>下载可打印</a>}
      {this.state.showModal ? <QrcodeModal id={id} onCancel={this.closeModal} shopName={shopName} shopType={shopType} partnerId={partnerId} /> : null}
    </div>);
  },
});

export default Qrcode;
