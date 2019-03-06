import React from 'react';
import {Modal, Checkbox, message, Button} from 'antd';

import './modal-authorization.less';

export default class ModalAuthorization extends React.Component {
  static defaultProps = {
    isAuthorized: false,
    authorizationVisible: false,
  };

  state = {
    authorizationVisible: this.props.authorizationVisible,
    acceptPolicy: false,
    submitting: false,
  }

  componentWillReceiveProps(nextProps) {
    const {submitting} = this.state;
    const {isAuthorized: isAuthorizedPrev} = this.props;
    const {isAuthorized, authorizationVisible} = nextProps;

    const state = {
      submitting: false,
      authorizationVisible,
    };
    if (submitting) {
      state.authorizationVisible = false;
    }
    this.setState(state);

    if (submitting) {
      if (isAuthorizedPrev === isAuthorized) {
        message.error('授权失败');
      } else {
        message.success('授权成功');
      }
    }
  }

  onChange = (e) => {
    this.setState({
      acceptPolicy: e.target.checked,
    });
  }

  handleOk = () => {
    const {acceptPolicy} = this.state;
    const {triggerRequestAuthorization, isvAppId, mainConsumerId, operaterId} = this.props;

    if (!acceptPolicy) {
      message.info('请同意并勾选协议');
      return;
    }

    this.setState({submitting: true});

    triggerRequestAuthorization({
      isvAppId,
      mainConsumerId,
      operaterId,
    });
  }

  handleCancel = () => {
    const {setDataAuthorization} = this.props;
    this.setState({
      authorizationVisible: false,
    });
    setDataAuthorization({
      authorizationVisible: false,
    });
  }

  render() {
    const {authorizationVisible, acceptPolicy, submitting} = this.state;
    const {isvAppId, mainConsumerId, operaterId} = this.props;

    return (
      <Modal
          visible={authorizationVisible}
          title="授权合作"
          onCancel={this.handleCancel}
          wrapClassName="boh-modal-authorization"
          footer={[
            <Button key="back" disabled={submitting} onClick={this.handleCancel}>拒绝</Button>,
            <Button key="submit" type="primary" loading={submitting} onClick={this.handleOk}>同意</Button>,
          ]}
        >
          <h3 className="policy-title">该服务由雅座提供，授权后，雅座将获得以下权限或信息：</h3>
          <ol className="policy-content">
            <li>1. 组织人员信息和配置权限</li>
            <li>2. 菜品、桌台、库存、配送等门店的营运信息和配置权限</li>
            <li>3. 支付方式、打印机等信息和配置权限</li>
            <li>4. 门店的基础信息</li>
          </ol>
          <Checkbox className="policy-accept" onChange={this.onChange} checked={acceptPolicy}>
            同意
            <a href="https://render.alipay.com/p/s/pc_authorization/agreement" target="_blank">《授权及产品使用协议》</a>
            <a href={`https://render.alipay.com/p/s/pc_authorization/index?operatorId=${operaterId}&consumerCardNo=${mainConsumerId}&isvAppId=${isvAppId}`} target="_blank">《一体机服务授权明细》</a>
          </Checkbox>
        </Modal>
    );
  }
}
