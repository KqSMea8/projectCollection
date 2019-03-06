import React, {PropTypes} from 'react';
import {Button, message} from 'antd';
import ajax from 'Utility/ajax';
import GoodsOfflineModal from './GoodsOfflineModal';

const OfflineShelfGoods = React.createClass({
  propTypes: {
    params: PropTypes.object,
    text: PropTypes.string,
    isV2: PropTypes.bool,
  },

  getInitialState() {
    return {
      showOfflineModal: false,
    };
  },
  onClick() {
    this.setState({showOfflineModal: true});
  },

  onOK(value) {
    const {itemId, opMerchantId} = this.props.params;
    this.setOffline({itemId: itemId, op_merchant_id: opMerchantId, memo: value});
  },

  onCancel() {
    this.setState({
      showOfflineModal: false,
    });
  },

  setOffline(reqParam = {}) {
    const url = window.APP.crmhomeUrl + `/goods/koubei/${this.props.isV2 ? 'buyItemOfflineForSale' : 'tradeVoucherItemOffline'}.json`;
    ajax({
      url: url,
      method: 'post',
      data: reqParam,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status === 'succeed') {
          this.props.params.callback();
          this.setState({
            showOfflineModal: false,
          });
          message.success('操作成功', 3);
        } else {
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <Button type="ghost" style={{marginLeft: 10}} onClick={this.onClick}>{this.props.text || '商品下架'}</Button>
        {this.state.showOfflineModal ? <GoodsOfflineModal title={this.props.text} onOk={this.onOK} onCancel={this.onCancel}/> : null}
      </div>
    );
  },
});

export default OfflineShelfGoods;
