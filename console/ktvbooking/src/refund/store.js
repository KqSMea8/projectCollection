import { Modal } from 'antd';
import history from '@alipay/kobe-history';

import { queryMerchantOrderByOrderId, refundBookingOrder } from './service';

export default {
  namespace: 'refund',

  initial: {
    loading: false,
    hasPlan: null, // 是否设置过方案， null：未知
    shopId: '', // 店铺ID
    orderId: '', // 订单ID
    list: [], // 退款订单列表
  },

  reducers: {
    setState(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  // async action
  asyncs: {
    async queryMerchantOrderByOrderId(dispatch, getState, payload) {
      try {
        const { shopId, orderId } = payload;
        dispatch({ type: 'setState', payload: { loading: true, shopId, orderId } });
        const { data, spiResultCode } = await queryMerchantOrderByOrderId({ shopId, orderId });
        const { resultCode } = (data && data[0]) || {};
        if (spiResultCode === '112001') {
          Modal.error({
            title: '您没有该菜单的权限操作，请联系管理员添加',
            onOk() {
              history.goBack();
            },
          });
          return;
        }
        if (resultCode === 'RESERVATIONPLAN_ISNOT_EXIST') {
          dispatch({ type: 'setState', payload: { loading: false, hasPlan: false } });
        } else {
          dispatch({ type: 'setState', payload: {
            loading: false,
            hasPlan: true,
            list: data,
          } });
        }
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false } });
      }
    },
    async refundBookingOrder(dispatch, getState) {
      try {
        const { shopId, orderId } = getState();
        await refundBookingOrder({ shopId, orderId });
        dispatch({ type: 'queryMerchantOrderByOrderId', payload: { shopId, orderId } });
      } catch (err) {
        throw err;
      }
    },
  },

  /**
  * 初始化请求
  * @param {object}
  * @property param param from url and startParams
  * @property extra extra arguments when reload
  * @return {any}
  */
  // async setup(dispatch, getState, { param }) {
  // async setup() {
  // dispatch({ type: 'queryMerchantSign' });
  // dispatch({ type: 'getList', payload: {param} });
  // },
};
