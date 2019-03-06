import React from 'react';
import { Alert, Button } from 'antd';
import { getUriParam, customLocation } from '../../../common/utils';

export default class CateringSuccess extends React.Component {
  shopManage = () => {
    this.props.history.push('/catering/list');
  }
  backHome = () => {
    this.props.history.push('/');
  }
  goToEditCert = () => {
    const firstNoLicenseShopId = getUriParam('firstNoLicenseShopId');
    customLocation(`/shop.htm?mode=modify#/shop/edit/${firstNoLicenseShopId}`);
  }
  render() {
    const hasNoCertShop = getUriParam('firstNoLicenseShopId');
    const succesedDom = hasNoCertShop
      ?
      (<div style={{ borderTop: '1px dashed #e9e9e9', paddingTop: '8px', marginTop: '8px' }}>
        <p>为了更好地运营口碑门店，请在试运营期间<span style={{color: '#f60'}}>及时完善证照资料；</span></p>
        <p>如逾期未完善，口碑有权在试运营期间届满后关闭您的“在线购买”相关服务。</p>
        <p>更多商品相关内容，请到“商品管理”中操作。常见问题，可参考<a href="https://zos.alipayobjects.com/rmsportal/UHUbpsJIYIqACQzYoUsh.jpg" target="_blank">线上商品指导手册</a></p>
        <p>
          <Button type="default" size="large" onClick={this.goToEditCert}>立即完善证照</Button>
           <span style={{ margin: '0 8px' }}></span>
          <a onClick={this.shopManage}>商品管理</a>
          <span style={{ margin: '0 8px' }}>|</span>
          <a onClick={this.backHome}>返回首页</a>
        </p>
      </div>)
      :
      (<div style={{ borderTop: '1px dashed #e9e9e9', paddingTop: '8px', marginTop: '8px' }}>
        <p>更多商品相关内容，请到“商品管理”中操作。常见问题，可参考<a href="https://zos.alipayobjects.com/rmsportal/UHUbpsJIYIqACQzYoUsh.jpg" target="_blank">线上商品指导手册</a></p>
        <p>
          <a onClick={this.shopManage}>商品管理</a>
          <span style={{ margin: '0 8px' }}>|</span>
          <a onClick={this.backHome}>返回首页</a>
        </p>
      </div>);
    const type = hasNoCertShop ? 'warning' : 'success';
    const message = hasNoCertShop ? <p>提交成功，商品将陆续上架。您拥有<span style={{color: '#f60'}}>90天</span>“在线购买”服务的试运营机会。</p> : '提交成功，商品将陆续上架。';
    return (<div className="kb-detail-main">
      <Alert
        message={message}
        description={succesedDom}
        type={type}
        showIcon
      />
      <a style={{ display: 'block' }} target="_blank" href="https://render.alipay.com/p/f/fd-j9zb6mdt/index.html">
        <img src="https://gw.alipayobjects.com/zos/rmsportal/EQXzIDXCVnkJORXWqzbY.png" width="100%"/>
      </a>
    </div>);
  }
}
