import React from 'react';
import CRMTpl from '../../../common/CRMTpl';

const GoodsListPromo = React.createClass({

  render() {
    const params = {
      title: '商家优惠券管理',
      url: window.APP.crmhomeUrl + '/goods/itempromo/index.htm.kb',
      // url: 'http://crmhome.riyu.d8922.alipay.net/goods/itempromo/index.htm.kb',
      autoHeight: 'auto',
    };
    return (
      <CRMTpl params={params}/>
    );
  },
});

export default GoodsListPromo;
