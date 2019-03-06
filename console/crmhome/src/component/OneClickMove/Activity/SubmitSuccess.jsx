import React from 'react';
import { Alert, Button, message } from 'antd';
import ajax from '../../../common/ajax';
import { getUriParam } from '../../../common/utils';

class SubmitSuccess extends React.Component {
  state = { tabPosition: 'top', data: {} };
  componentDidMount() {
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leads/confirmorder/checkItemCommodityAuth.json`,
      data: { confirmOrderId: getUriParam('id', this.props.history.search) },
      type: 'json',
      success: res => {
        if (res.status !== 'succeed') {
          message.warn(res.resultMsg || '获取授权信息失败', 3);
        } else {
          this.setState({
            data: res.data,
          });
        }
      },
      error: () => {
        message.warn('获取授权信息失败');
      },
    });
  }
  gotoAuth = () => {
    window.open(this.state.data.authUrl.replace('&amp;', '&'), '_blank');
  }
  render() {
    const { data } = this.state;
    const authorizedDom = (<div style={{ borderTop: '1px dashed #e9e9e9', paddingTop: '8px', marginTop: '8px' }}>
      <p style={{ marginBottom: 8 }}>更多商品相关内容,请到"商品服务"中操作, 常见问题，可参考<a href="https://zos.alipayobjects.com/rmsportal/UHUbpsJIYIqACQzYoUsh.jpg" target="_blank">线上商品指导手册</a></p>
      <p>你还未对口碑服务商有限公司进行管理授权，为了享受更好的服务，请尽快进行授权。</p>
      {data.canAuthorizeItemCommodity === true && <Button size={"large"} type="ghost" style={{ marginRight: 12 }} onClick={this.gotoAuth}>我要授权</Button>}
      <a href="https://e.alipay.com/main.htm#/stuff/order">商品服务</a>
      <span style={{ margin: '0 8px' }}>|</span>
      <a href="/">返回首页</a>
    </div>);
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
        message="提交成功，商品将陆续上架。"
        description={data.canAuthorizeItemCommodity ? authorizedDom : succesedDom}
        type="success"
        showIcon
      />
    </div>);
  }
}

export default SubmitSuccess;
