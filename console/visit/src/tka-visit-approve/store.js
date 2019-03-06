import { set } from '@alipay/kobe-store';
import { popPage } from '@alipay/kb-m-biz-util';
import { spmNavBarSubmit } from './spm.config';
import { approve } from './service';

export default {
  initial: {
    valid: true,
    recordId: '',
    invalidReason: '',
    approveRes: null,
  },

  reducers: {
    setRecordId: set('recordId'),
    setValid: set('valid'),
    setInvalidReason: set('invalidReason'),
    approveSuccess(state) {
      return {
        ...state,
        approveRes: 'success',
      };
    },
    approveFail(state) {
      return {
        ...state,
        approveRes: 'fail',
      };
    },
  },

  asyncs: {
    async approve(dispatch, getState) {
      try {
        if (window.Tracert && Tracert.click) Tracert.click(spmNavBarSubmit);
        const state = getState();
        const param = {
          recordId: state.recordId,
          auditResult: state.valid ? 1 : 0,
          invalidReason: state.valid ? '' : state.invalidReason,
        };
        const res = await approve(param);
        dispatch({ type: 'approveSuccess', payload: res });
        kBridge.call('showToast', {
          content: '审阅成功',
          type: 'success',
        }, popPage);
      } catch (err) {
        dispatch({ type: 'approveFail', payload: err });
        kBridge.call('showToast', err);
      }
    },
  },

  async setup(dispatch, getState, { param }) {
    dispatch({ type: 'setRecordId', payload: param.id });
  },
};
