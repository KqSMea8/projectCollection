import { call, put, take } from 'redux-saga/effects';
import {message} from 'antd';

import { fetchShopList, requestAllActivation, requestActivation, requestSetMainPOS } from './service';

const pagination = {};

export default {
  initial: {
    loading: true,
    shopList: {
      total: 0,
      current: 1,
      pageSize: 20,
      data: [],
    },
    shopDeviceList: {},
  },
  actions: {
    // 触发器，获取门店列表
    triggerFetchShopList: (state, payload) => {
      const {shopList} = state;
      pagination.current = payload.current || shopList.current;
      pagination.pageSize = payload.pageSize || shopList.pageSize;

      return {
        ...state,
        loading: true,
        shopList: {
          ...shopList,
          ...pagination,
        },
      };
    },
    // 触发器，刷新激活码
    triggerRequestActivation: state => state,
    // 触发器，设置主POS
    triggerRequestSetMainPOS: state => state,

    // 设置门店列表数据
    setDataShopList(state, payload) {
      const {total = 0, data = []} = payload;

      const shopDeviceList = {};
      data.forEach((item) => {
        const {shopId, deviceList: posList = []} = item;
        const deviceList = posList.map(device => {
          device.shopId = shopId;
          return device;
        });
        shopDeviceList[shopId] = deviceList;
      });

      return {
        ...state,
        loading: false,
        shopList: {
          ...state.shopList,
          total,
          data,
        },
        shopDeviceList,
      };
    },
    // 设置为主POS
    setDataShopMainPOS(state, payload) {
      const {shopId, deviceSn: posSn} = payload;
      const {shopDeviceList} = state;

      const shopDevices = shopDeviceList[shopId].slice(0);
      const mainPos = shopDevices.find(item => item.mainDvFlag);
      if (mainPos) {
        mainPos.mainDvFlag = false;
      }
      const pos = shopDevices.find((item) => item.posSn === posSn);
      if (pos) {
        pos.mainDvFlag = true;
      }

      return {
        ...state,
        shopDeviceList: {
          ...shopDeviceList,
          [shopId]: shopDevices,
        },
      };
    },
  },
  sagas: {
    // 获取门店列表数据
    * fetchShopList() {
      while (true) {
        const opts = (yield take('triggerFetchShopList')).payload;
        const {current: pageStart, pageSize} = opts;
        try {
          const data = (yield call(fetchShopList, { data: {pageStart, pageSize} }));
          yield put(this.setDataShopList(data));
        } catch (error) {} // eslint-disable-line
      }
    },
    // 获取激活码
    * requestActivation() {
      while (true) {
        const opts = (yield take('triggerRequestActivation')).payload;
        try {
          if (opts) {
            yield call(requestActivation, {data: opts});
          } else {
            yield call(requestAllActivation, {data: opts});
          }
          message.success('激活码获取成功');
          // 刷新门店列表数据
          yield put(this.triggerFetchShopList(pagination));
        } catch (error) {} // eslint-disable-line
      }
    },
    // 设置为主POS
    * requestSetMainPOS() {
      while (true) {
        const opts = (yield take('triggerRequestSetMainPOS')).payload;
        try {
          yield call(requestSetMainPOS, { data: opts });
          message.success('设置为主POS成功');
          // 仅更新门店设备列表数据
          yield put(this.setDataShopMainPOS(opts));
        } catch (error) {} // eslint-disable-line
      }
    },
  },
};
