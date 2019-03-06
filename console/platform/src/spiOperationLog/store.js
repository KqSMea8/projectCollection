import { message } from 'antd';
import { queryLogList } from './service';

export default {
  namespace: 'operationLog',

  initial: {
    loading: false,
    logListData: {
      bizLog: [],
      bizType: '',
    }, // 操作日志列表数据
  },

  reducers: {
    getQueryLogList(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  // async action
  asyncs: {
    // 操作日志列表
    async queryLogList(dispatch, getState, payload) {
      try {
        const res = await queryLogList(payload);
        if (res.status === 'succeed') {
          dispatch({ type: 'getQueryLogList', payload: {
            logListData: {
              bizLog: res.data.bizLog,
              bizType: res.data.bizType,
            },
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
