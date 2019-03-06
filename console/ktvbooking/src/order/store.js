import history from '@alipay/kobe-history';
import { Modal, message } from 'antd';

import { getList, confirmOrder, rejectOrder, consumeOrder, queryWaitConfirmOrderCount } from './service';
import { statusToTab } from './constants';

export default {
  namespace: 'order',

  initial: {
    loading: false,
    hasPlan: null,
    pages: { // {orderStatus: pageInfo}
      WAIT_CONFIRM: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
      WAIT_CONSUME: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
      CONSUMED: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
      REFUND: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
      },
    },
    list: [],
    orderId: '', // 订单号
    newMessageCount: 0, // 待接单的条数，用于在待接单tab上显示
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
    async getList(dispatch, getState, payload) {
      try {
        const { orderStatus, ...other } = payload;
        dispatch({ type: 'setState', payload: {
          loading: true, ...other,
        } });
        const { shopId, pages, orderId } = getState();
        const { currentPage, pageSize } = pages[orderStatus];
        const { data, spiResultCode } =
          await getList({ shopId, orderStatus, currentPage, pageSize, orderId });
        if (spiResultCode === '112001') {
          Modal.error({
            title: '您没有该菜单的权限操作，请联系管理员添加',
            onOk() {
              history.goBack();
            },
          });
          return;
        }
        const { list, page: { pageNo, pageSize: rawPageSize, totalCount } } = data;
        if (orderId && Array.isArray(list) && list.length === 1) { // 根据订单查询
          const order = list[0];
          history.replace(`/order/${statusToTab[order.orderStatus]}`);
        }
        dispatch({ type: 'setState', payload: {
          loading: false,
          list: list || [],
          pages: {
            ...pages,
            [orderStatus]: {
              currentPage: pageNo,
              pageSize: rawPageSize,
              totalCount,
            },
          },
        } });
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false } });
      }
    },
    async queryWaitConfirmOrderCount(dispatch, getState, payload) { // 查询待接单数量
      try {
        const { shopId } = payload;
        const { data } = await queryWaitConfirmOrderCount({ shopId });
        const { resultCode, count } = data;
        if (resultCode === 'RESERVATIONPLAN_ISNOT_EXIST') {
          dispatch({ type: 'setState', payload: {
            hasPlan: false,
          } });
        } else {
          dispatch({ type: 'setState', payload: {
            hasPlan: true,
            newMessageCount: count,
          } });
        }
      } catch (err) {
        dispatch({ type: 'setState', payload: { hasPlan: true } });
      }
    },
    async confirmOrder(dispatch, getState, payload) {
      try {
        const { shopId } = getState();
        const { orderId } = payload;
        await confirmOrder({ shopId, orderId });
        message.success('已确认接单', 3);
      } catch (err) {
        throw err;
      }
    },
    async rejectOrder(dispatch, getState, payload) {
      try {
        const { shopId } = getState();
        const { orderId } = payload;
        await rejectOrder({ shopId, orderId });
        message.success('已拒绝接单', 3);
      } catch (err) {
        throw err;
      }
    },
    async consumeOrder(dispatch, getState, payload) {
      try {
        const { shopId, orderId, remark, voucherCode } = payload;
        await consumeOrder({ shopId, orderId, remark, voucherCode });
        message.success('核销成功', 3);
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
  //   console.log(param);
  //   // dispatch({ type: 'getList', payload: param });
  // },
};
