import history from '@alipay/kobe-history';
import { createList, getOrderOwnerId, getModifyReport, getRight, getPemission, createModifyReport } from './service';

export default {
  namespace: 'managereport',
  initial: {
    loading: false,
    agree: false,
    permission: {},
    result: null,
    owner: [],
    param: {},
    error: {},
    list: {},
    create: {},
    modifyreport: {},
    formData: {},
    fileList: [],
  },

  reducers: {
    // 获取列表
    getListStart(state, payload) {
      return {
        ...state,
        loading: true,
        list: {},
        error: {},
        param: {
          ...payload,
        },
      };
    },
    getListEnd(state, payload) {
      let { list } = state;
      if (payload) {
        list = {
          ...list,
          ...payload,
        };
      }
      return {
        ...state,
        list,
        loading: false,
      };
    },
    getListFail(state, payload) {
      let { error } = state;
      if (payload) {
        error = {
          ...error,
          ...payload,
        };
      }
      return {
        ...state,
        error,
        loading: false,
      };
    },
    // 获取销售人
    getOwnerStart(state, payload) {
      return {
        ...state,
        owner: [],
        error: {},
        param: {
          ...payload,
        },
      };
    },
    getOwnerEnd(state, payload) {
      let { owner } = state;
      if (payload) {
        owner = [...owner, ...payload];
      }
      return {
        ...state,
        owner,
      };
    },
    getOwnerFail(state) {
      return {
        ...state,
        owner: [],
      };
    },
    // 新增报单
    createListStart(state, payload) {
      return {
        ...state,
        loading: true,
        create: {},
        error: {},
        formData: {
          ...payload,
        },
      };
    },
    createListEnd(state, payload) {
      let { create } = state;
      if (payload) {
        create = {
          ...create,
          ...payload,
        };
      }
      return {
        ...state,
        create,
        loading: false,
      };
    },
    createFail(state, payload) {
      let { error } = state;
      if (payload) {
        error = { ...error, ...payload };
      }
      return {
        ...state,
        error,
        loading: false,
      };
    },
    // 创建修改报单
    createModifyReportStart(state, payload) {
      return {
        ...state,
        loading: true,
        modifyreport: {},
        error: {},
        param: {
          ...payload,
        },
      };
    },
    createModifyReportEnd(state, payload) {
      let { modifyreport } = state;
      if (payload) {
        modifyreport = {
          ...modifyreport,
          ...payload,
        };
      }
      return {
        ...state,
        modifyreport,
        loading: false,
      };
    },
    createModifyReportFail(state, payload) {
      let { error } = state;
      if (payload) {
        error = { ...error, ...payload };
      }
      return {
        ...state,
        error,
        loading: false,
      };
    },
    // 权限验证
    getRightStart(state, payload) {
      return {
        ...state,
        isErr: true,
        error: {},
        agree: false,
        param: {
          ...payload,
        },
      };
    },
    getRightEnd(state, payload) {
      return {
        ...state,
        agree: payload,
        isErr: false,
      };
    },
    getRightFail(state, payload) {
      let { error } = state;
      if (payload) {
        error = { ...error, ...payload };
      }
      return {
        ...state,
        error,
        isErr: false,
      };
    },
    // 获取取消权限码配置情况
    getPemissionStart(state, payload) {
      return {
        ...state,
        permission: {},
        param: {
          ...payload,
        },
      };
    },
    getPemissionEnd(state, payload) {
      return {
        ...state,
        permission: payload,
      };
    },
    getPemissionFail(state) {
      return {
        ...state,
        permission: {},
      };
    },
  },


  // async action
  asyncs: {
    async createList(dispatch, getState, payload) {
      try {
        dispatch({ type: 'createListStart', payload });
        const { formData } = getState();
        const res = await createList(formData);
        dispatch({ type: 'createListEnd', payload: res });
        history.push(`/managereport/report-success/${res.data}`);
      } catch (err) {
        dispatch({ type: 'createFail', payload: err });
      }
    },
    async getOrderOwnerId(dispatch, getState, payload) {
      try {
        dispatch({ type: 'getOwnerStart', payload });
        const { param } = getState();
        const res = await getOrderOwnerId(param);
        dispatch({ type: 'getOwnerEnd', payload: res.data });
      } catch (err) {
        dispatch({ type: 'getOwnerFail', payload: err });
      }
    },
    async getModifyReport(dispatch, getState, payload) {
      try {
        dispatch({ type: 'getListStart', payload });
        const { param } = getState();
        const res = await getModifyReport(param);
        dispatch({ type: 'getListEnd', payload: res.data });
      } catch (err) {
        dispatch({ type: 'getListFail', payload: err });
      }
    },
    async getRight(dispatch, getState, payload) {
      try {
        dispatch({ type: 'getRightStart', payload });
        const { param } = getState();
        const res = await getRight(param);
        dispatch({ type: 'getRightEnd', payload: res.data });
      } catch (err) {
        dispatch({ type: 'getRightFail', payload: err });
      }
    },
    async getPemission(dispatch, getState, payload) {
      try {
        dispatch({ type: 'getPemissionStart', payload });
        const { param } = getState();
        const res = await getPemission(param.code);
        dispatch({ type: 'getPemissionEnd', payload: res.data });
      } catch (err) {
        dispatch({ type: 'getPemissionFail', payload: null });
      }
    },
    async createModifyReport(dispatch, getState, payload) {
      try {
        dispatch({ type: 'createModifyReportStart', payload });
        const { param } = getState();
        const res = await createModifyReport(param);
        res.orderId = param.orderId;
        dispatch({ type: 'createModifyReportEnd', payload: res });
        history.push(`/managereport/report-success/${res.orderId}`);
      } catch (err) {
        dispatch({ type: 'createModifyReportFail', payload: err });
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

  // },
};
