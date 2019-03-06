import React, {PropTypes} from 'react';
import {Icon} from 'antd';
import QrcodeModal from './QrcodeModal';

const Qrcode = React.createClass({
  propTypes: {
    id: PropTypes.string,
    showText: PropTypes.bool,
    shopType: PropTypes.string,
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
    const {id} = this.props;
    return (<div style={{display: 'inline-block'}}>
      <a href="#" style={{cursor: 'pointer'}} onClick={this.onClick}><Icon type="qrcode"/></a>
      {this.props.showText && <a href="#" style={{display: 'block', fontSize: 12}} onClick={this.onClick}>下载可打印</a>}
      {this.state.showModal ? <QrcodeModal id={id} onCancel={this.closeModal} shopType= {this.props.shopType}/> : null }
    </div>);
  },
});

export default Qrcode;
