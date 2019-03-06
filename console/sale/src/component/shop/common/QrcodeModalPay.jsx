import React, {PropTypes} from 'react';
import {Row, Icon, Button} from 'antd';

const ButtonGroup = Button.Group;

function random() {
  return Math.floor(Math.random() * 1e6);
}

const QrcodeModalPay = React.createClass({
  propTypes: {
    id: PropTypes.string,
  },

  getInitialState() {
    return {
      activeKey: 0,
      rand: random(),
      forceRefreshParams: '',
    };
  },

  componentDidMount() {
    if (window.Tracker && window.Tracker.custom) {
      window.Tracker.custom('biz-kb-shop-qrcode-modal-tab-pay', {});
    }
  },

  onClick(activeKey) {
    this.setState({
      activeKey,
      rand: random(),
    });
  },

  download() {
    const {id} = this.props;
    if (this.state.activeKey === 0) {
      location.href = window.APP.crmhomeUrl + '/shop/koubei/downloadQRCode.htm?type=normal&shopId=' + id;
    } else {
      location.href = window.APP.crmhomeUrl + '/shop/koubei/downloadQRCode.htm?type=mini&shopId=' + id;
    }
  },

  refresh(e) {
    e.preventDefault();
    this.setState({
      rand: random(),
      forceRefreshParams: '&refresh=1',
    });
  },

  render() {
    const {id} = this.props;
    const {activeKey, rand, forceRefreshParams} = this.state;
    return (<div style={{textAlign: 'center', fontSize: 14, padding: 20, minHeight: 483}}>
      <Row style={{marginBottom: 20}}>
        <span style={{color: '#2db7f5'}}><Icon type="info-circle"/></span> 用户扫描二维码即可付款，用户付款时可享受折扣优惠
      </Row>
      <Row>
        {activeKey === 0 && <img src={window.APP.crmhomeUrl + '/shop/koubei/qrCode.htm?type=normal&shopId=' + id + '&t=' + rand + forceRefreshParams} height="300" style={{minWidth: 1}}/>}
        {activeKey === 1 && <img src={window.APP.crmhomeUrl + '/shop/koubei/qrCode.htm?type=mini&shopId=' + id + '&t=' + rand + forceRefreshParams} height="300" style={{minWidth: 1}}/>}
      </Row>
      <Row style={{margin: '20px 0'}}>
        <ButtonGroup>
          <Button type={activeKey === 0 ? 'primary' : 'ghost'} onClick={this.onClick.bind(this, 0)}>整合版</Button>
          <Button type={activeKey === 1 ? 'primary' : 'ghost'} onClick={this.onClick.bind(this, 1)}>精简版</Button>
        </ButtonGroup>
      </Row>
      <Row>
        <Button type="primary" style={{marginRight: 12}} onClick={this.download}>下载后可打印</Button>
        <a href="#" onClick={this.refresh}>看不到二维码？试试刷新图片</a>
      </Row>
    </div>);
  },
});

export default QrcodeModalPay;
