import { message, Modal } from 'antd';
import history from '@alipay/kobe-history';

import { querySevenDaysInventoryInfo, modifyRoomStatusAndInventory } from './service';

export default {
  namespace: 'status',

  initial: {
    loading: false,
    listErr: false,
    shopId: '', // 门店ID
    hasPlan: null, // 是否设置过方案

    activeIndex: null, // 当期选中库存列表索引
    inventoryList: [], // 七日库存信息
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
    async querySevenDaysInventoryInfo(dispatch, getState) {
      try {
        dispatch({ type: 'setState', payload: { loading: true, listErr: false } });
        const { shopId, activeIndex: currActiveIndex } = getState();
        const { data, spiResultCode } = await querySevenDaysInventoryInfo({ shopId });
        if (spiResultCode === '112001') {
          Modal.error({
            title: '您没有该菜单的权限操作，请联系管理员添加',
            onOk() {
              history.goBack();
            },
          });
          return;
        }
        if (data.resultCode === 'RESERVATIONPLAN_ISNOT_EXIST') {
          dispatch({ type: 'setState', payload: {
            loading: false,
            hasPlan: false,
          } });
        } else {
          const inventoryList = (data || [])
            .sort((a, b) => +(a.date > b.date) || +(a.date === b.date) - 1); // 从小到大的日期排序
          let activeIndex = currActiveIndex;
          if (activeIndex === null ||
            !inventoryList[activeIndex] || // 当前库存信息不存在
            !!inventoryList[activeIndex].unReservationDay) { // 当前库存信息是不可预约日期
            activeIndex = inventoryList.findIndex(inventory => !inventory.unReservationDay); // 重置选中
          }
          dispatch({ type: 'setState', payload: {
            loading: false,
            hasPlan: true,
            inventoryList,
            activeIndex,
          } });
        }
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false, hasPlan: null, listErr: true } });
      }
    },
    async modifyRoomStatusAndInventory(dispatch, getState, payload) {
      try {
        dispatch({ type: 'setState', payload: { loading: true } });
        const { shopId } = getState();
        await modifyRoomStatusAndInventory({ shopId, ...payload });
        message.success('修改成功');
        dispatch({ type: 'querySevenDaysInventoryInfo', payload: {} });
      } catch (err) {
        dispatch({ type: 'setState', payload: { loading: false } });
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
  // dispatch({ type: 'querySevenDaysInventoryInfo', payload: { } });
  // },
};
