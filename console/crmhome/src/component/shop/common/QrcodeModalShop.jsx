import React, {PropTypes} from 'react';
import {Row, Icon, Button, Spin, message} from 'antd';
import ajax from '../../../common/ajax';

const ButtonGroup = Button.Group;

// 门店码
const QrcodeModalShop = React.createClass({
  propTypes: {
    shopId: PropTypes.string,
    shopName: PropTypes.string,
  },

  getInitialState() {
    return {
      activeKey: 'DOOR_PASTER_148_210',
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

  onTemplateSwitch(activeKey) {
    this.setState({
      activeKey,
      qrCodeUrl: null,
      qrCodeDownUrl: null,
      errMsg: null,
    }, () => this.doQueryBatchId());
  },

  doQueryBatchId() {
    this.queryId = Math.random(); // 设置这次请求唯一标识
    const template = this.state.activeKey;
    this.doQueryOrderLoop(template);
  },

  doQueryOrderLoop(template, batchId, loopTime = 0) {
    const queryId = this.queryId; // 本次请求链路唯一标识
    setTimeout(() => {
      if (queryId !== this.queryId) return; // setTimeout 中发生了新的请求
      ajax({
        url: '/shop/queryShopKbCode.json',
        data: {
          targetId: this.props.shopId,
          templateNickName: template,
          codeType: 'SHOP_CODE',
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
      qrCodeDownUrl: window.APP.crmhomeUrl + '/shop/exportShopKbCode.htm?qrCode=' + data.qrCode,
    });
  },

  refresh(e) {
    e.preventDefault();
    this.onTemplateSwitch(this.state.activeKey);
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
    const {activeKey, errMsg, qrCodeUrl} = this.state;
    return (<div style={{textAlign: 'center', fontSize: 14, padding: 20, minHeight: 483}}>
      <Row style={{marginBottom: 20}}>
        <span style={{color: '#2db7f5'}}><Icon type="info-circle"/></span>
        <span>顾客扫码后进入门店详情，付款、领取优惠、使用门店订购的点菜、排队等服务功能</span>
      </Row>
      <Row>
        {qrCodeUrl && !errMsg && <img src={qrCodeUrl} height="300" style={{minWidth: 1, padding: activeKey === 'DOOR_PASTER_148_210' ? 0 : 20}}/>}
        {!qrCodeUrl && !errMsg && <div style={{height: 300, paddingTop: 100}}><Spin/><br/><br/>物料生成中...<br/>首次生成物料需要时间较长，请耐心等待</div>}
        {!qrCodeUrl && errMsg && <div style={{height: 300, paddingTop: 100}}><br/><br/><br/><a onClick={this.refresh}>点击重新生成</a></div>}
      </Row>
      <Row style={{margin: '20px 0'}}>
        <ButtonGroup>
          <Button
            type={activeKey === 'DOOR_PASTER_148_210' ? 'primary' : 'ghost'}
            onClick={this.onTemplateSwitch.bind(this, 'DOOR_PASTER_148_210')}
          >台卡  148 x 210mm(大)</Button>
          <Button
            type={activeKey === 'DOOR_PASTER_110_150' ? 'primary' : 'ghost'}
            onClick={this.onTemplateSwitch.bind(this, 'DOOR_PASTER_110_150')}
          >台卡 110 x 150mm(小)</Button>
        </ButtonGroup>
      </Row>
      <Row>
        <Button type="primary" style={{marginRight: 12}} onClick={this.download}>下载后可打印</Button>
        <a href="#" onClick={this.refresh}>看不到二维码？试试刷新图片</a>
      </Row>
    </div>);
  },
});

export default QrcodeModalShop;
