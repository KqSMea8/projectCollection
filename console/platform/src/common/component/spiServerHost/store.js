import { message } from 'antd';
import { queryAppNames } from './service';

export default {
  namespace: 'spiServerHost',

  initial: {
    loading: false,
    serverHostData: [], // 应用名数据
  },

  reducers: {
    getQueryAppNames(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  // async action
  asyncs: {
    // 应用组名称
    async queryAppNames(dispatch, getState, payload) {
      try {
        const res = await queryAppNames();
        if (res.status === 'succeed') {
          dispatch({ type: 'getQueryAppNames', payload: {
            serverHostData: res.data,
          } });
        }
      } catch (err) {
        message.error('系统错误');
      }
    },
  },

  /**
   * 初始化请求
   * @param dispatch
   * @param getState
   * @param params
   * @param params.param url中的查询参数
   * @param params.extra reload时传递的参数
   */
  // async setup(dispatch, getState, { param }) {
  //   const res = await getData(param);
  //   return res.data;
  // },
};
