import React, {PropTypes} from 'react';
import {Button, message} from 'antd';
import ajax from 'Utility/ajax';
import fetch from '@alipay/kb-fetch';
import ShopAllocModal from './ShopAllocModal';
import ShopAllocPosModal from './ShopAllocPosModal';
import ErrorModal from './ErrorModal';
import {remoteLog} from '../../../common/utils';

export function postAllocData(isManual, selectedRows, values, onSuccess, onError) {
  let targetOpId = '';
  let isProvider = false;
  if (values.bucUser) {
    targetOpId = values.bucUser.loginName;
  } else if (values.alipayUser) {
    targetOpId = values.alipayUser.partnerId;
    isProvider = true;
  }
  const data = {
    targetOpId,
    userType: values.userType,
    isProvider,
  };
  let url;
  if (isManual) {
    url = window.APP.crmhomeUrl + '/shop/koubei/manualAssign.json';
    data.shopIds = selectedRows.map(r => r.shopId).join(',');
    data.assignedPrincipalIds = selectedRows.map(r => r.assignedPrincipalId).join(',');
  } else {
    url = window.APP.crmhomeUrl + '/shop/koubei/reAssign.json';
    data.orderIds = selectedRows.map(r => r.orderId).join(',');
  }
  ajax({
    url,
    method: 'post',
    data,
    success: onSuccess,
    error: onError,
  });
}

const ShopAlloc = React.createClass({
  propTypes: {
    selectedRows: PropTypes.array,
    type: PropTypes.string,
    buttonText: PropTypes.string,
    isManual: PropTypes.bool,
    onEnd: PropTypes.func,
    isPosSale: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      type: 'button', // button or text
      buttonText: '分配',
    };
  },

  getInitialState() {
    return {
      showModal: false,
      showErrorModal: false,
      errorData: [],
      confirmLoading: false,
    };
  },

  onClick(e) {
    e.preventDefault();
    if (this.props.isManual) {
      remoteLog(this.props.type === 'text' ? 'SHOP_MANUAL_ALLOC' : 'SHOP_MANUAL_BATCH_ALLOC');
    } else {
      remoteLog(this.props.type === 'text' ? 'SHOP_REALLOC' : 'SHOP_BATCH_REALLOC');
    }
    this.setState({
      showModal: true,
    });
  },

  postData(values) {
    if (this.props.selectedRows.length > 100) {
      return message.warn('最多选择100家门店');
    }
    this.setState({
      confirmLoading: true,
    });
    if (this.props.isPosSale) {
      fetch({
        url: 'kbsales.shopAllocateService.allocatePosSaleShop',
        errorMessenger: null,
        param: [
          this.props.selectedRows.map(r => r.shopId),
          { targetId: values.bucUser.id },
        ],
      }).then(() => {
        this.setState({ confirmLoading: false });
        message.success('操作成功');
        this.closeModal();
        this.props.onEnd();
      }).catch(e => {
        this.setState({ confirmLoading: false });
        if (e.res && e.res.data && e.res.data.data) { // 有详细的报错信息
          this.setState({
            showErrorModal: true,
            errorData: e.res.data.data,
          });
        } else {
          message.error(e.message);
        }
      });
      return null;
    }
    postAllocData(this.props.isManual, this.props.selectedRows, values, (result) => {
      this.setState({
        confirmLoading: false,
      });
      if (result.status === 'failed') {
        this.showError(result);
        return;
      }
      message.success('操作成功');
      this.closeModal();
      this.props.onEnd();
    }, this.showError);
  },

  showError(result) {
    this.setState({
      confirmLoading: false,
    });
    if (!result) {
      message.error('加载出错');
      return;
    }
    if (!result.data) {
      message.error(result.resultMsg);
      return;
    }
    this.setState({
      showErrorModal: true,
      errorData: result.data,
    });
  },

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  closeErrorModal() {
    this.setState({
      showErrorModal: false,
    });
  },

  render() {
    const {selectedRows, type, buttonText, isPosSale} = this.props;
    const allowModal = isPosSale
      ? <ShopAllocPosModal onOk={this.postData} onCancel={this.closeModal} confirmLoading={this.state.confirmLoading} />
      : <ShopAllocModal onOk={this.postData} onCancel={this.closeModal} confirmLoading={this.state.confirmLoading} />;
    return (<div style={{display: 'inline-block', marginRight: 12}}>
      {type === 'button' && <Button type="primary" onClick={this.onClick} disabled={selectedRows.length === 0}>{buttonText}</Button>}
      {type === 'text' && <a href="#" onClick={this.onClick}>{buttonText}</a>}
      {this.state.showModal ? allowModal : null}
      {this.state.showErrorModal ? <ErrorModal title="分配失败" data={this.state.errorData} onOk={this.closeErrorModal} onCancel={this.closeErrorModal}/> : null}
    </div>);
  },
});

export default ShopAlloc;
