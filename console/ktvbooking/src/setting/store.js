import { message, Modal } from 'antd';
import history from '@alipay/kobe-history';

import { getEditData, saveData } from './service';

export default {
  namespace: 'setting',

  initial: {
    loading: false,
    editData: {},
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
    async getEditData(dispatch, getState, payload) {
      try {
        dispatch({ type: 'setState', payload: { loading: true } });
        const { data, spiResultCode } = await getEditData(payload);
        if (spiResultCode === '112001') {
          Modal.error({
            title: '您没有该菜单的权限操作，请联系管理员添加',
            onOk() {
              history.goBack();
            },
          });
          return;
        }
        dispatch({ type: 'setState', payload: { loading: false, editData: data } });
      } catch (err) { // status: failed
        dispatch({ type: 'setState', payload: { loading: false } });
      }
    },
    async saveData(dispatch, getState, payload) {
      try {
        dispatch({ type: 'setState', payload: { loading: true } });
        await saveData(payload);
        message.success('提交成功', 3);
      } catch (err) {
        throw err;
      } finally {
        dispatch({ type: 'setState', payload: { loading: false } });
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
  //   console.log(param)
  //   // dispatch({ type: 'queryMerchantSign' });
  //   // dispatch({ type: 'getList', payload: param });
  // },
};
