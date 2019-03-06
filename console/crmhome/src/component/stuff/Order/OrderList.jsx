import React from 'react';
import {Button} from 'antd';
import { urlDecode } from '../../../common/utils';

const Order = React.createClass({
  goTo(link, commodityId) {
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true';
    let goToLink = link;
    if (isParentFrame) {
      const anchor = document.createElement('a');
      anchor.href = goToLink;
      const merchantId = this.props.location && this.props.location.query.op_merchant_id || urlDecode().op_merchant_id;
      if (anchor.pathname === '/main.htm') {
        goToLink = merchantId ? `#/goods/goodsservice/servicedetail?commodityId=${commodityId}&op_merchant_id=${merchantId}` : `#/goods/goodsservice/servicedetail?commodityId=${commodityId}`;
        goToLink = `${window.parent.location.origin}${window.parent.location.pathname}${goToLink}`;
      } else {
        goToLink = goToLink.replace('getAuthLink.htm?', 'getAuthLink.htm.kb?');
        goToLink = merchantId ? `${goToLink}&op_merchant_id=${merchantId}` : goToLink;
      }
      window.parent.open(goToLink);
    } else {
      window.open(goToLink, '_blank');
    }
  },

  render() {
    const {list} = this.props;
    return (<div className="stuff-list">
      {list.map((item, index) => {
        return (<div className="stuff-item" key={`${item.appId}${index}`}>
          <img src={item.logoUrl} />
          <div className="stuff-item-middle">
            <div className="stuff-title">{item.title}</div>
            <div className="stuff-desc">{item.subTitle}</div>
          </div>
          <Button type="ghost" onClick={() => { this.goTo(item.vistorUrl, item.commodityId); }}>进入服务</Button>
        </div>);
      })}
    </div>);
  },
});

export default Order;
