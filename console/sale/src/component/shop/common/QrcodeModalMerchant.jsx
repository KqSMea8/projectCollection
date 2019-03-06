import React, {PropTypes} from 'react';
import {Row, Icon, Button, Spin, message} from 'antd';
import ajax from 'Utility/ajax';

const QrcodeModalMerchant = React.createClass({
  propTypes: {
    shopId: PropTypes.string,
    shopName: PropTypes.string,
  },

  getInitialState() {
    return {
      qrCodeUrl: '',
      errorMsg: null,
    };
  },

  componentDidMount() {
    this.doQueryBatchId();
  },

  componentWillUnmount() {
    this.queryId = null;
  },

  doQueryBatchId() {
    this.queryId = Math.random(); // 设置这次请求唯一标识
    const template = 'RETAIL_PASTER_296_320';
    this.doQueryOrderLoop(template);
  },

  doQueryOrderLoop(template, batchId, loopTime = 0) {
    const queryId = this.queryId; // 本次请求链路唯一标识
    setTimeout(() => {
      if (queryId !== this.queryId) return; // setTimeout 中发生了新的请求
      ajax({
        url: window.APP.crmhomeUrl + '/shop/koubei/queryShopKbCode.json',
        data: {
          targetId: this.props.shopId,
          templateNickName: template,
          codeType: 'MERCHANT_CODE',
          batchId: batchId,
        },
        success: (res) => {
          if (queryId !== this.queryId) return; // ajax 中发生了新的请求
          if (res.status === 'succeed') {
            const status = res.data.status;
            if (status === 'COMPLETED') {
              this.showQRCodeUrl(res.data);
            } else {
              this.doQueryOrderLoop(template, res.data.batchId, loopTime + 1);
            }
          }
        },
        error: (data) => {
          if (queryId !== this.queryId) return; // ajax 中发生了新的请求
          const errMsg = data && data.resultMsg || '请求失败';
          message.error(errMsg);
          this.setState({ errMsg });
        },
      });
    }, loopTime * 5000);
  },

  showQRCodeUrl(data) {
    this.setState({
      errMsg: null,
      qrCodeUrl: data.codeUrl,
      qrCodeDownUrl: window.APP.crmhomeUrl + '/shop/koubei/exportShopKbCode.htm?_input_charset=ISO8859-1&qrCode=' + data.qrCode,
    });
  },

  refresh(e) {
    e.preventDefault();
    this.setState({
      qrCodeUrl: null,
      qrCodeDownUrl: null,
      errMsg: null,
    }, () => this.doQueryBatchId());
  },

  download() {
    const qrCodeDownUrl = this.state.qrCodeDownUrl;
    if (!qrCodeDownUrl) {
      message.error('物料生成中，请稍候');
      return;
    }
    window.open(qrCodeDownUrl);
  },

  render() {
    const {errMsg, qrCodeUrl} = this.state;
    return (<div style={{textAlign: 'center', fontSize: 14, padding: 20, minHeight: 483}}>
      <Row style={{marginBottom: 20}}>
        <span style={{color: '#2db7f5'}}><Icon type="info-circle"/></span>
        <span>适用于连锁商户，顾客扫码后可进入最近店铺详情页</span>
      </Row>
      <Row>
        {qrCodeUrl && !errMsg && <img src={qrCodeUrl} height="300" style={{minWidth: 1}}/>}
        {!qrCodeUrl && !errMsg && <div style={{height: 300, paddingTop: 100}}><Spin/><br/><br/>物料生成中...</div>}
        {!qrCodeUrl && errMsg && <div style={{height: 300, paddingTop: 100}}><br/><br/><br/><a onClick={this.refresh}>点击重新生成</a></div>}
      </Row>
      <Row style={{marginTop: 68}} >
        <Button type="primary" style={{marginRight: 12}} onClick={this.download}>下载后可打印</Button>
        <a href="#" onClick={this.refresh}>看不到二维码？试试刷新图片</a>
      </Row>
    </div>);
  },
});

export default QrcodeModalMerchant;
