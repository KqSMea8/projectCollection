import ajax from 'Utility/ajax';
import {message} from 'antd';

export default {
  getInitialState() {
    return {
      showOfflineModal: false,
      loading: false,
      visible: false,
    };
  },

  onOK(value) {
    const {itemId, opMerchantId} = this.props.params;
    this.makeGoodsOffline({itemId: itemId, op_merchant_id: opMerchantId, memo: value});
  },

  onCancel() {
    this.setState({
      showOfflineModal: false,
    });
  },

  makeGoodsOffline(reqParam = {}) {
    const url = window.APP.crmhomeUrl + '/goods/koubei/itemOffline.json';
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

  makeGoodsOnline(reqParam = {}) {
    const url = window.APP.crmhomeUrl + '/goods/itempromo/testModifyList.json.kb';
    ajax({
      url: url,
      method: 'post',
      data: reqParam,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.result === 'succeed') {
          message.success('操作成功', 3);
          this.props.params.callback();
        } else {
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          } else {
            message.error('操作失败', 3);
          }
        }
      },
    });
  },
};
