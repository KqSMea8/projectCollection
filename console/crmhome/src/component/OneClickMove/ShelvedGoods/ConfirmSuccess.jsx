import React from 'react';
import { Alert } from 'antd';

class ConfirmSuccess extends React.Component {
  render() {
    const succesedDom = (<div style={{ borderTop: '1px dashed #e9e9e9', paddingTop: '8px', marginTop: '8px' }}>
      <p>更多商品相关内容,请到"商品服务"中操作, 常见问题，可参考<a href="https://zos.alipayobjects.com/rmsportal/UHUbpsJIYIqACQzYoUsh.jpg" target="_blank">线上商品指导手册</a></p>
      <p>
        <a href="https://e.alipay.com/main.htm#/stuff/order">商品服务</a>
        <span style={{ margin: '0 8px' }}>|</span>
        <a href="/">返回首页</a>
      </p>
    </div>);
    return (<div className="kb-detail-main">
      <Alert
        message="提交成功，商品信息将及时更新。"
        description={succesedDom}
        type="success"
        showIcon
      />
    </div>);
  }
}

export default ConfirmSuccess;
