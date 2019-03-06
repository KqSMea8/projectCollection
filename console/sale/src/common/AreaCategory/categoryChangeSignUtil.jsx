import ajax from 'Utility/ajax';
import {Modal} from 'antd';

let ChangeSignConfirmedCategoryId;
const Util = {
  /**
   * 检查是否需要改签
   */
  checkChangeSign(config = {}) {
    const { partnerId, categoryId, shouldChangeSign, cantChangeSign, alreadySign, error } = config;

    ajax({
      url: window.APP.crmhomeUrl + '/shop/signValidate.json.kb',
      method: 'post',
      withCredentials: true,
      crossOrigin: true,
      data: {
        _input_charset: 'utf-8',
        partnerId: partnerId,
        categoryId: categoryId,
      },
      success: (result) => {
        switch (result.data && result.data.signType) {
        case 'SIGN_MODIFY_TO_KOUBEI': // 商家需要改签
          if (shouldChangeSign) shouldChangeSign(result.data);
          break;
        case 'MERCHANT_CAN_NOT_SIGN_KOUBEI': // 商家自己不能改签
          if (cantChangeSign) cantChangeSign();
          break;
        case 'SIGN': // 无需签约 / 已改签
          if (alreadySign) alreadySign();
          break;
        default:
          if (error) error('改签校验接口异常');
        }
      },
      error: (result, errorMsg) => {
        if (error) error(errorMsg || '请求出错');
      },
    });
  },
  /**
   * 清除已确认提示的变量记录
   * 在 品类发生改动 和 提交按钮的时候，都会触发提示。但是品类改动的提示触发确认后，提交按钮的提示不再触发。
   */
  clearRememberChangeSignConfirmedFlag() {
    ChangeSignConfirmedCategoryId = null;
  },
  showCantChangeSignAlert() {
    Modal.info({
      title: '该品类需商户账号改签',
      content: '该支付宝账户已签约的当面付暂不支持此品类开店，请联系口碑小二进行改签',
    });
  },
  showShouldChangeSignConfirmWithCheckConfirmed(config) {
    const { categoryId, okCallback } = config || {};
    if (categoryId && categoryId === ChangeSignConfirmedCategoryId) { // 用户已经同意了提示了
      if (okCallback) okCallback();
    } else {
      Util.showShouldChangeSignConfirm(config);
    }
  },
  showShouldChangeSignConfirm(config) {
    const { categoryId, okText, okCallback, cancelCallback } = config || {};
    Modal.confirm({
      title: '该品类需商户账号改签',
      content: '该支付宝账户已签约的当面付不可开此类目的门店，将在提交后自动改签口碑当面付，请联系商家在商家中心e.alipay.com中进行改签确认',
      okText: okText || '确定',
      cancelText: '取消',
      onOk() {
        ChangeSignConfirmedCategoryId = categoryId;
        if (okCallback) okCallback();
      },
      onCancel() {
        ChangeSignConfirmedCategoryId = null;
        if (cancelCallback) cancelCallback();
      },
    });
  },
};

export default Util;
