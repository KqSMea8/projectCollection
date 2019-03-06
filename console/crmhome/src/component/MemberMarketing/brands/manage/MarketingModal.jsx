import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, Row, Col, message} from 'antd';
import ajax from '../../../../common/ajax';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

const MarketingModal = React.createClass({
  propTypes: {
    item: PropTypes.object,
    show: PropTypes.bool,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    return {
      schemeUrl: '',
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.getScheme();
    }
  },

  componentDidUpdate() {
    const qr = ReactDOM.findDOMNode(this.refs.qrCode);

    if (qr) {
      const image = qr.toDataURL('image/png').replace('image/png', 'image/octet-stream');

      ReactDOM.findDOMNode(this.refs.download).href = image;
    }
  },

  onCopy() {
    message.success('复制成功！');
  },

  getScheme() {
    ajax({
      url: 'promo/brand/scheme.json',
      method: 'get',
      type: 'json',
      data: {
        planId: this.props.item.planId,
        activityId: this.props.item.activityId,
      },
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            schemeUrl: res.schemeUrl,
          });
        } else {
          message.error(res.errorMsg || '获取推广信息失败');
        }
      },
    });
  },

  config() {
    location.href = 'https://fuwu.alipay.com/platform/sendMessage.htm';  // eslint-disable-line no-location-assign
  },

  render() {
    const { schemeUrl } = this.state;
    const { item } = this.props;

    if (schemeUrl !== '') {
      return (
        <Modal title={'活动推广'}
               width= {650}
               visible={this.props.show}
               onCancel={this.props.onCancel}
               maskClosable={false}
               footer={[]}
        >
          <p style={{marginBottom: 20, fontSize: 16}}>
            【{item.activityName}】 你可以通过以下形式推广该活动：
          </p>

          <div>
            <Row>
              <Col span={6} style={{width: 200, height: 230, padding: 10, textAlign: 'center'}}>
                <h4>活动二维码</h4>
                <QRCode value={schemeUrl} size={128} ref="qrCode"/>
                <Button type="primary"><a download="qrCode.png" ref="download">下载</a></Button>
              </Col>
              <Col span={6} style={{width: 200, height: 230, padding: 10, textAlign: 'center'}}>
                <h4>优惠券领取地址</h4>
                <p style={{wordBreak: 'break-all', height: 130, padding: 10}}>{schemeUrl}</p>
                <CopyToClipboard text={schemeUrl} onCopy={this.onCopy}>
                  <Button type="primary">复制</Button>
                </CopyToClipboard>
              </Col>
              <Col span={6} style={{width: 200, height: 230, padding: 10, textAlign: 'center'}}>
                <h4>配置服务窗消息</h4>
                <Button type="primary" onClick={this.config}>去配置</Button>
              </Col>
            </Row>
          </div>
        </Modal>
      );
    }

    return (<div></div>);
  },
});

export default MarketingModal;
