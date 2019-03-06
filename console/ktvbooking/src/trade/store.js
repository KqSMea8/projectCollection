import { Modal } from 'antd';
import history from '@alipay/kobe-history';
import moment from 'moment';

import { queryExpenseAndRefundInfoDetail } from './service';

const todayDate = moment().format('YYYY-MM-DD');

export default {
  namespace: 'trade',

  initial: {
    loading: false,
    hasPlan: null, // 是否设置过方案， null：未知
    shopId: '', // 店铺ID
    startDate: todayDate, // 开始日期
    endDate: todayDate, // 结束时间
    tradeTotalData: { // 交易总计
      netAmountTotal: '--', // 净收
      refundTotalMoney: '--', // 退款总金额
      refundOrderTotality: '--', // 退款总单数
      chargeAmount: '--', // 服务费
      incomeTotality: '--', // 收入总金额
      spendOrderTotality: '--', // 消费总单数
    },
    pageInfo: { // 分页信息
      pageNo: 1, // 当前页数
      pageSize: 10, // 每页大小
      pages: 0, // 总页数
      totalCount: 0, // 总记录数
    },
    expenseAndRefundInfos: [], // 消费及退款列表
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
    async queryExpenseAndRefundInfoDetail(dispatch, getState, payload) {
      try {
        dispatch({ type: 'setState', payload: {
          loading: true, ...payload,
        } });
        const { shopId, startDate, endDate, pageInfo } = getState();
        const { pageNo: currentPage, pageSize } = pageInfo;

        const { data, spiResultCode } = await queryExpenseAndRefundInfoDetail({
          shopId, startDate, endDate, currentPage, pageSize,
        });
        if (spiResultCode === '112001') {
          Modal.error({
            title: '您没有该菜单的权限操作，请联系管理员添加',
            onOk() {
              history.goBack();
            },
          });
          return;
        }
        const {
          resultCode,
          chargeAmount, incomeTotality, netAmountTotal,
          refundOrderTotality, refundTotalMoney, spendOrderTotality,
          pageInfo: rawPageInfo, expenseAndRefundInfos,
        } = (data && data[0]) || {};
        if (resultCode === 'RESERVATIONPLAN_ISNOT_EXIST') {
          dispatch({ type: 'setState', payload: { loading: false, hasPlan: false } });
        } else {
          dispatch({ type: 'setState', payload: {
            loading: false,
            hasPlan: true,
            tradeTotalData: {
              chargeAmount, incomeTotality, netAmountTotal,
              refundOrderTotality, refundTotalMoney, spendOrderTotality,
            },
            pageInfo: rawPageInfo,
            expenseAndRefundInfos,
          } });
        }
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false, hasPlan: true } });
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
  //   dispatch({ type: 'getList', payload: param });
  // },
};
