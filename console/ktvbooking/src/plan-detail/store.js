import { message, Modal } from 'antd';
import history from '@alipay/kobe-history';

import { queryReservationPlanDetail, switchReservationPlan } from './service';

export default {
  namespace: 'plan-detail',

  initial: {
    loading: true,
    listErr: false,
    shopId: '', // 门店ID
    hasPlan: null, // 是否设置过方案

    planStatus: null, // 状态，OPEN（已上架）CLOSED(已下架)
    resourceList: [], // 包厢信息
    timeList: [], // 时段信息
    packageList: [], // 套餐列表
    cyclePriceList: [], // 周期价格列表+特殊日期
    unReservationDayList: [], // 不可预约日历列表

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
    async queryReservationPlanDetail(dispatch, getState) {
      try {
        dispatch({ type: 'setState', payload: { loading: true, listErr: false } });
        const { shopId } = getState();
        const { data } = await queryReservationPlanDetail({ shopId });
        const { resultCode, planStatus, resourceList, timeList, packageList,
          cyclePriceList, unReservationDayList, spiResultCode } = data;
        if (spiResultCode === '112001') {
          Modal.error({
            title: '您没有该菜单的权限操作，请联系管理员添加',
            onOk() {
              history.goBack();
            },
          });
          return;
        }
        if (resultCode === 'RESERVATIONPLAN_ISNOT_EXIST') { // 显示NoPlan引导组件
          dispatch({ type: 'setState', payload: {
            loading: false,
            hasPlan: false,
          } });
        } else {
          dispatch({ type: 'setState', payload: {
            loading: false,
            hasPlan: true,
            planStatus,
            resourceList,
            timeList,
            packageList,
            cyclePriceList,
            unReservationDayList,
          } });
        }
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false, hasPlan: null, listErr: true } });
      }
    },
    async switchReservationPlan(dispatch, getState, payload) {
      try {
        dispatch({ type: 'setState', payload: { loading: true } });
        const { showSwitch } = payload;
        const { shopId } = getState();
        await switchReservationPlan({ shopId, showSwitch });
        const { content, planStatus } = {
          OPEN: { content: '上架成功', planStatus: 'OPEN' },
          CLOSED: { content: '下架成功', planStatus: 'CLOSED' },
        }[showSwitch];
        message.success(content);
        dispatch({ type: 'setState', payload: {
          loading: false,
          planStatus,
        } });
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
  // dispatch({ type: 'queryReservationPlanDetail', payload: { } });
  // },
};
