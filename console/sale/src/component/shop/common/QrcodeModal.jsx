import React, {PropTypes} from 'react';
import {Modal, Tabs, Spin} from 'antd';
import QrcodeModalPay from './QrcodeModalPay';
import QrcodeModalShop from './QrcodeModalShop';
import QrcodeModalPropaganda from './QrcodeModalPropaganda';
import QrcodeModalMerchant from './QrcodeModalMerchant';
import QrcodeModalSMS from './QrcodeModalSMS';
import ajax from 'Utility/ajax';

const TabPane = Tabs.TabPane;

// 商户码Tab  1。快消行业（商超类目）显示商户码  2。非快消行业（商超类目）仍是老的商户码（宣传码）
const QrcodeModalMerchantWrap = React.createClass({
  getInitialState() {
    return {
      isRetailShop: null,
      loading: true,
    };
  },
  componentDidMount() {
    if (window.Tracker && window.Tracker.custom) {
      window.Tracker.custom('biz-kb-shop-qrcode-modal-tab-merchant', {});
    }
    ajax({
      url: window.APP.crmhomeUrl + '/shop/isRetailShop.json.kb',
      data: { shopId: this.props.shopId },
      success: (res) => {
        this.setState({
          loading: false,
          isRetailShop: res.data,
        });
        if (res.data) {
          if (window.Tracker && window.Tracker.custom) {
            window.Tracker.custom('biz-kb-shop-qrcode-modal-tab-merchant-retail', {});
          }
        }
      },
      error: () => {
        this.setState({
          loading: false,
          isRetailShop: false, // 接口挂了则默认展示非快消的二维码
        });
      },
    });
  },
  render() {
    if (this.state.loading) {
      return (<div style={{paddingTop: 100, textAlign: 'center', minHeight: 483, fontSize: 14}}><Spin/><br/><br/>请稍候...</div>);
    }
    if (this.state.isRetailShop) {
      return <QrcodeModalMerchant {...this.props} />;
    }
    return <QrcodeModalPropaganda {...this.props} enableKeys={['merchant', 'keyword']}/>;
  },
});

// 门店码Tab  1。支付类目等不支持的类目显示原门店宣传码  2。支持的类目显示口碑门店码
const QrcodeModalShopWrap = React.createClass({
  getInitialState() {
    return {
      needBuildKbShopCode: null,
      loading: true,
    };
  },
  componentDidMount() {
    if (window.Tracker && window.Tracker.custom) {
      window.Tracker.custom('biz-kb-shop-qrcode-modal-tab-shop', {});
    }
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/needBuildKbShopCode.json',
      data: { shopId: this.props.shopId },
      success: (res) => {
        this.setState({
          loading: false,
          needBuildKbShopCode: res.data,
        });
        if (res.data) {
          if (window.Tracker && window.Tracker.custom) {
            window.Tracker.custom('biz-kb-shop-qrcode-modal-tab-shop-kb', {});
          }
        }
      },
      error: () => {
        this.setState({
          loading: false,
          needBuildKbShopCode: false, // 若接口挂了则默认展示原门店宣传码
        });
      },
    });
  },
  render() {
    if (this.state.loading) {
      return (<div style={{paddingTop: 100, textAlign: 'center', minHeight: 483, fontSize: 14}}><Spin/><br/><br/>请稍候...</div>);
    }
    if (this.state.needBuildKbShopCode) {
      return <QrcodeModalShop {...this.props} />;
    }
    return <QrcodeModalPropaganda {...this.props} enableKeys={['shop']}/>;
  }
});

const QrcodeModal = React.createClass({
  propTypes: {
    id: PropTypes.string,
    onCancel: PropTypes.func,
    shopName: PropTypes.string,
    shopType: PropTypes.string,
    partnerId: PropTypes.string,
  },

  componentDidMount() {
    if (window.Tracker && window.Tracker.custom) {
      window.Tracker.custom('biz-kb-shop-qrcode-modal', {});
    }
  },

  render() {
    const items = [];
    const {id, partnerId, shopName} = this.props;
    if (this.props.shopType !== 'MALL') {
      items.push(
        <TabPane tab="门店码" key="3"><QrcodeModalShopWrap shopId={id} partnerId={partnerId} shopName={shopName}/></TabPane>,
        <TabPane tab="商户码" key="2"><QrcodeModalMerchantWrap shopId={id} partnerId={partnerId} shopName={shopName}/></TabPane>,
        <TabPane tab="收款二维码" key="0"><QrcodeModalPay id={id}/></TabPane>,
        <TabPane tab="收款短信管理" key="1"><QrcodeModalSMS id={id}/></TabPane>);
    } else {
      items.push(<TabPane tab="宣传二维码" key="2"><QrcodeModalPropaganda shopId={id} shopType="mall_info"/></TabPane>);
    }
    return (<Modal title="门店二维码" visible
      width={770}
      onCancel={this.props.onCancel}
      footer={''}>
      <Tabs destroyInactiveTabPane>
        {items}
      </Tabs>
    </Modal>);
  },
});

export default QrcodeModal;
