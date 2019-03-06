import { call, put, take } from 'redux-saga/effects';

import { fetchSolutionList, fetchAuthorization, requestAuthorization } from './service';

export default {
  initial: {
    isAuthorized: false,
    authorizationVisible: false,
    // 行业解决方案
    solutions: [],
    // 案例
    demos: [],
    // 购买链接
    purchases: [],
  },
  actions: {
    // 触发器，获取解决方案信息
    triggerFetchSolutionList: state => state,
    // 触发器，获取授权信息
    triggerFetchAuthorization: state => state,
    // 触发器，同意授权
    triggerRequestAuthorization: state => state,

    // 设置门店列表数据
    setDataSolutionList(state, payload) {
      const {solutions, demos, purchases} = payload;
      return {
        ...state,
        solutions,
        demos,
        purchases,
      };
    },
    // 设置授权信息
    setDataAuthorization(state, payload) {
      const {isAuthorized = state.isAuthorized,
        isvAppId = state.isvAppId, mainConsumerId = state.mainConsumerId,
        operaterId = state.operaterId, authorizationVisible = state.authorizationVisible} = payload;
      return {
        ...state,
        isAuthorized,
        isvAppId,
        mainConsumerId,
        operaterId,
        authorizationVisible,
      };
    },
  },
  sagas: {
    // 获取解决方案信息
    * fetchSolutionList() {
      while (true) {
        const opts = (yield take('triggerFetchSolutionList')).payload;
        try {
          const data = (yield call(fetchSolutionList, { data: opts }));
          yield put(this.setDataSolutionList(data));
        } catch (error) {} // eslint-disable-line
      }
    },
    // 获取授权信息
    * fetchAuthorization() {
      while (true) {
        const opts = (yield take('triggerFetchAuthorization')).payload;
        try {
          const data = (yield call(fetchAuthorization, { data: opts }));
          yield put(this.setDataAuthorization(data));
        } catch (error) {} // eslint-disable-line
      }
    },
    // 同意授权
    * requestAuthorization() {
      while (true) {
        const opts = (yield take('triggerRequestAuthorization')).payload;
        try {
          yield call(requestAuthorization, {data: opts});
          // 刷新门店列表数据
          yield put(this.setDataAuthorization({
            isAuthorized: true,
            authorizationVisible: false,
          }));
        } catch (error) {
          yield put(this.setDataAuthorization({
            isAuthorized: false,
            authorizationVisible: false,
          }));
        }
      }
    },
  },
};
