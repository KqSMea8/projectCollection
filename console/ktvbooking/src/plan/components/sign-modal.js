import React, { PureComponent } from 'react';
import { Modal, Alert, Checkbox, Button } from 'antd';
import { func, object } from 'prop-types';
import history from '@alipay/kobe-history';

import Block from '../../common/components/block';

import './sign-modal.less';

export default class SignModal extends PureComponent {
  static propTypes = {
    signed: object,
    dispatch: func,
  }

  state = {
    checked: false,
    loading: false,
  }

  onChange = (e) => {
    this.setState({ checked: e.target.checked });
  }

  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'createMerchantSign', payload: {} }).catch(() => {
      this.setState({ loading: false });
    });
  }

  handleCancel = () => {
    history.goBack();
  }

  render() {
    const { signed } = this.props;
    const { checked, loading } = this.state;
    const visible = signed && (!signed.kbktvbooking || !signed.onlinepay);
    if (!visible) {
      return null;
    }
    const footer = (
      <Button type="primary" loading={loading} disabled={!checked} onClick={this.handleOk}>立即开通服务</Button>
    );
    return (
      <Modal className="sign-modal" title="开通口碑KTV在线预订服务" visible={visible}
        onCancel={this.handleCancel} footer={footer} width={550}>
        <Alert message="预订方案创建前，请先签约口碑KTV在线预订服务协议" type="info" showIcon />
        <div className="p-30">
          <Block title="签约规则">
            <span className="c-red">口碑KTV在线预订服务协议必须为商户主账号签约。</span>
          </Block>
          <Block title="服务规则">
            口碑KTV在线预订服务仅针对KTV类目商户开通。
          </Block>
          <Block title="费率收取">
            自本服务开通之日起至<span className="c-red">2019年5月31日</span>，优惠服务费率为<span className="c-red">0</span>；优惠期届满后，口碑将按照不高于8%的费率收取服务费。
          </Block>
          <Checkbox checked={checked} onChange={this.onChange}>
            阅读并同意
            {!signed.onlinepay && <a href="https://render.alipay.com/p/f/fd-iuid3m48/index.html" target="_blank" rel="noopener noreferrer">《在线购买服务协议》</a>}
            <a href="https://render.alipay.com/p/f/jg334uvt/index.html" target="_blank" rel="noopener noreferrer">《口碑KTV在线预订服务协议》</a>
          </Checkbox>
        </div>
      </Modal>
    );
  }
}
