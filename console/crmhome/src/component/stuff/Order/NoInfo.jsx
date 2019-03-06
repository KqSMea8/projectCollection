import React, {PropTypes} from 'react';
import {Button} from 'antd';

const Order = React.createClass({
  propTypes: {
    link: PropTypes.string,
  },

  render() {
    const {link} = this.props;
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true';
    if (isParentFrame) {
      return <div style={{textAlign: 'center', padding: 40, color: '#f50'}}>该商户还未订购该应用， 请联系商户去服务市场订购商品管理应用</div>;
    }
    return (<div>
      <div className="stuff-banner-container">
        {link ? <a target="_blank" href={link}><img src="https://zos.alipayobjects.com/rmsportal/bcwJzkNovuGIMEA.jpg" /></a> : <img src="https://zos.alipayobjects.com/rmsportal/bcwJzkNovuGIMEA.jpg" />}
      </div>
      {link ? <div className="stuff-sub-title">订购第三方应用，免费享受在线购买类商品管理及服务<Button size="large" type="primary" onClick={() => { window.open(link, '_blank'); }}>立即订购</Button></div> : null}
    </div>);
  },
});

export default Order;
