import React, {PropTypes} from 'react';
import {Row, Icon, Button} from 'antd';

function random() {
  return Math.floor(Math.random() * 1e6);
}

const QrcodeModalPropaganda = React.createClass({
  propTypes: {
    id: PropTypes.string,
    shopType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      id: '',
      shopType: 'COMMON',
    };
  },

  getInitialState() {
    return {
      rand: random(),
      forceRefreshParams: '',
    };
  },

  onClick() {
    this.setState({
      rand: random(),
    });
  },

  download() {
    const {id} = this.props;
    location.href = window.APP.crmhomeUrl + '/shop/koubei/downloadQRCode.htm?type=shop_info&shopId=' + id;
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
    const {rand, forceRefreshParams} = this.state;
    const shopType = this.props.shopType === 'MALL' ? 'mall_info' : 'shop_info';
    return (<div style={{textAlign: 'center', fontSize: 14, padding: 20, minHeight: 483}}>
      <Row style={{marginBottom: 20}}>
        <span style={{color: '#2db7f5'}}><Icon type="info-circle"/></span> 用户扫描二维码即可查看店铺详情
      </Row>
      <Row>
        <img src={window.APP.crmhomeUrl + `/shop/koubei/qrCode.htm?type=${shopType}&shopId=` + id + '&t=' + rand + forceRefreshParams} height="300" style={{minWidth: 1}}/>
      </Row>
      <Row>
        <Button type="primary" style={{marginRight: 12}} onClick={this.download}>下载后可打印</Button>
        <a href="#" onClick={this.refresh}>看不到二维码？试试刷新图片</a>
      </Row>
    </div>);
  },
});

export default QrcodeModalPropaganda;
