import React, {PropTypes} from 'react';
import {Tooltip, message} from 'antd';
import ajax from 'Utility/ajax';
import ShopAuthModal from './ShopAuthModal';
import {remoteLog} from '../../../common/utils';

const ShopAuth = React.createClass({
  propTypes: {
    id: PropTypes.string,
    shopName: PropTypes.string,
    shopStatus: PropTypes.string,
    onEnd: PropTypes.func,
  },

  getInitialState() {
    return {
      showModal: false,
    };
  },

  onClick(e) {
    e.preventDefault();
    remoteLog('SHOP_AUTH');
    this.setState({
      showModal: true,
    });
  },

  postData(values) {
    const {id} = this.props;
    if (values.user) {
      values.targetOpId = values.user.id;
    }
    delete values.user;
    if (values.authTypes) {
      values.authTypes = 'DATA_VIEW,AGENT_OPERATION';
    } else {
      values.authTypes = 'DATA_VIEW';
    }
    values.userType = window.APP.userType;
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/grantAuthorization.json',
      method: 'post',
      data: {
        shopId: id,
        ...values,
      },
      success: (result)=> {
        if (result.status === 'failed') {
          message.error('操作失败，请重试');
          return;
        }
        message.success('操作成功');
        this.closeModal();
        this.props.onEnd();
      },
    });
  },

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    const {shopName, shopStatus} = this.props;
    return (<div style={{display: 'inline-block', marginRight: 12}}>
      {
        shopStatus === 'CLOSED' ?
        <Tooltip placement="top" title={<div style={{width: 140}}>不能授权给已关闭的门店</div>}><span style={{color: '#ccc'}}>授权</span></Tooltip> :
        <a href="#" onClick={this.onClick}>授权</a>
      }
      {this.state.showModal ? <ShopAuthModal shopName={shopName} onOk={this.postData} onCancel={this.closeModal}/> : null}
    </div>);
  },
});

export default ShopAuth;
