import { getList } from './service';

export default {
  namespace: 'index',

  initial: {
    loading: false,
    agree: false,
    result: null,
    list: [],
    param: {},
  },

  reducers: {
    getListStart(state, payload) {
      return {
        ...state,
        loading: true,
        list: [],
        param: {
          ...state.param,
          ...payload,
        },
      };
    },
    getListEnd(state, payload) {
      let { list } = state;
      if (payload) {
        list = [...list, ...payload];
      }
      return {
        ...state,
        loading: false,
        list,
      };
    },
  },

  // async action
  asyncs: {
    async getList(dispatch, getState, payload) {
      try {
        dispatch({ type: 'getListStart', payload });
        const { param } = getState();
        const res = await getList(param);
        dispatch({ type: 'getListEnd', payload: res.data });
      } catch (err) {
        dispatch({ type: 'getListEnd', payload: null });
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
  async setup(dispatch, getState, { param }) {
    dispatch({ type: 'getList', payload: param });
  },
};
