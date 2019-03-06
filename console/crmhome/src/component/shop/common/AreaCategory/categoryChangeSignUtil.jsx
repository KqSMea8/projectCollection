import React from 'react';
import ajax from '../../../../common/ajax';
import {Modal} from 'antd';

let changeSignConfirmedCategoryId = null;
let changeSignCacheValidateData = null;
const Util = {
  /**
   * 检查是否需要改签
   */
  checkChangeSign(config = {}) {
    const { partnerId, categoryId, shouldChangeSign, cantChangeSign, alreadySign, error } = config;

    ajax({
      url: window.APP.crmhomeUrl + '/shop/signValidate.json',
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
  clearChangeSignConfirmedFlag() {
    changeSignCacheValidateData = null;
    changeSignConfirmedCategoryId = null;
  },
  showCantChangeSignAlert() {
    Modal.info({
      title: '该品类需商户账号改签',
      content: '该支付宝账户已签约的当面付暂不支持此品类开店，请联系口碑小二进行改签',
    });
  },
  showShouldChangeSignConfirmWithCheckConfirmed(config) {
    const { categoryId, okCallback } = config || {};
    if (changeSignConfirmedCategoryId && changeSignConfirmedCategoryId === categoryId) {
      if (okCallback) okCallback();
      return;
    }
    this.showShouldChangeSignConfirm(config);
  },
  showShouldChangeSignConfirm(config) {
    const { categoryId, checkSignApiData = changeSignCacheValidateData, okText, okCallback, cancelCallback } = config || {};
    this.clearChangeSignConfirmedFlag();

    Modal.confirm({
      title: '改签提示',
      content: (
        <div>
          <p>如需在口碑开店，您需根据下方提示改签至口碑（增加开店协议，返佣不变）。请注意，同意改签后才能继续开店。</p>
          <br />
          <p>
            改签内容：我同意终止与支付宝（中国）网络技术有限公司或口碑（上海）网络技术有限公司已经签署的关于当面付服务的《支付宝商家服务协议》（或《口碑商户服务协议》）
            { checkSignApiData.orderNum ? `（合同编号为：${checkSignApiData.orderNum}）` : ''}
            且同意口碑和支付宝为我名下支付宝账户
            { checkSignApiData.alipayAccount ? `（账户：${checkSignApiData.alipayAccount}）` : ''}
            开通口碑和新当面付服务。
          </p>
          <br />
          <p>改签成功后，口碑将按以下费率收取服务费：</p>
          <p>超市便利店：每笔交易的0.38%；</p>
          <p>非超市便利店：每笔交易的0.6%<span style={{ color: '#F90' }}>（改签之日起至2018年12月31日，口碑仅收取每笔交易的0.55%）</span></p>
        </div>
      ),
      okText: okText || '同意改签',
      cancelText: '不同意',
      onOk() {
        changeSignConfirmedCategoryId = categoryId;
        changeSignCacheValidateData = checkSignApiData;
        if (okCallback) okCallback(checkSignApiData);
      },
      onCancel() {
        if (cancelCallback) cancelCallback();
      },
    });
  },
};

export default Util;
