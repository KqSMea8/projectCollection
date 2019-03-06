import React, {PropTypes} from 'react';
import {Row, Icon, Button} from 'antd';
import QrcodeModalPropagandaKeywordInput from './QrcodeModalPropagandaKeywordInput';

const ButtonGroup = Button.Group;

function random() {
  return Math.floor(Math.random() * 1e6);
}

const typeMapping = {
  'shop': 'shop_info',
  'merchant': 'merchant_core',
  'keyword': 'merchant_core',
};

const QrcodeModalPropaganda = React.createClass({
  propTypes: {
    shopId: PropTypes.string,
    partnerId: PropTypes.string,
    shopType: PropTypes.string,
    enableKeys: PropTypes.array,
  },

  getDefaultProps() {
    return {
      enableKeys: ['shop', 'merchant', 'keyword'],
    };
  },

  getInitialState() {
    return {
      rand: random(),
      forceRefreshParams: '',
      activeKey: this.props.enableKeys[0],
      shopName: '',
    };
  },

  onClick() {
    this.setState({
      rand: random(),
    });
  },

  onSubmitKeyword(shopName) {
    this.setState({ shopName });
  },

  setActiveKey(activeKey) {
    if (activeKey !== this.state.activeKey) {
      this.setState({ shopName: '' });
    }
    this.setState({
      rand: random(),
      activeKey,
    });
  },

  currentKeyword() {
    const {shopName} = this.state;
    return shopName ? <span>二维码当前关键字：<span style={{color: '#2db7f5'}}>{shopName}</span></span> : '二维码当前未绑定关键字';
  },

  download() {
    location.href = this.appendParams(window.APP.crmhomeUrl + '/shop/koubei/downloadQRCode.htm');
  },

  appendParams(origUrl) {
    const {shopId, partnerId, shopType} = this.props;
    const {activeKey, shopName} = this.state;
    const type = shopType || typeMapping[activeKey];
    let url = origUrl;
    url += '?type=' + type + '&shopId=' + shopId;
    if (activeKey === 'keyword' || activeKey === 'merchant') {
      url += '&partnerId=' + partnerId;
    }
    if (activeKey === 'keyword') {
      url += '&shopName=' + encodeURIComponent(shopName);
    }
    return url;
  },

  refresh(e) {
    e.preventDefault();
    this.setState({
      rand: random(),
      forceRefreshParams: '&refresh=1',
    });
  },

  render() {
    const {partnerId, enableKeys} = this.props;
    const {rand, forceRefreshParams, activeKey} = this.state;
    const imageSrc = this.appendParams(window.APP.crmhomeUrl + '/shop/koubei/qrCode.htm') + '&t=' + rand + forceRefreshParams;
    return (<div style={{textAlign: 'center', fontSize: 14, padding: 20, minHeight: 483}}>
      <Row style={{marginBottom: 20}}>
        <span style={{color: '#2db7f5'}}><Icon type="info-circle"/></span> 用户扫描二维码即可查看店铺详情
      </Row>
      {activeKey === 'keyword' && <Row style={{marginBottom: 20}}><QrcodeModalPropagandaKeywordInput onSubmit={this.onSubmitKeyword}/></Row>}
      <Row>
        <img src={imageSrc} height="300" style={{minWidth: 1}}/>
        {activeKey === 'keyword' && <div><span style={{color: '#2db7f5'}}></span>{this.currentKeyword()}</div>}
      </Row>
      {enableKeys && partnerId && <Row style={{margin: 20, visibility: enableKeys.length > 1 ? '' : 'hidden'}}>
        <ButtonGroup>
          {enableKeys.indexOf('shop') !== -1 && <Button type={activeKey === 'shop' ? 'primary' : 'ghost'}
            onClick={this.setActiveKey.bind(this, 'shop')}>当前门店宣传码</Button>}
          {enableKeys.indexOf('merchant') !== -1 && <Button type={activeKey === 'merchant' ? 'primary' : 'ghost'}
            onClick={this.setActiveKey.bind(this, 'merchant')}>商户宣传码</Button>}
          {enableKeys.indexOf('keyword') !== -1 && <Button type={activeKey === 'keyword' ? 'primary' : 'ghost'}
            onClick={this.setActiveKey.bind(this, 'keyword')}>关键字搜索宣传码</Button>}
        </ButtonGroup>
      </Row>}
      <Row>
        <Button type="primary" style={{marginRight: 12}} onClick={this.download}>下载后可打印</Button>
        <a href="#" onClick={this.refresh}>看不到二维码？试试刷新图片</a>
      </Row>
    </div>);
  },
});

export default QrcodeModalPropaganda;
