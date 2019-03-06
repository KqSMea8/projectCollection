import { set } from '@alipay/kobe-store';
import { getSubCompany } from './service';

export default {
  initial: {
    chooseId: '', // 已选中的分公司id
    merchantId: '', // 选中的商户id
  },

  reducers: {
    setChooseId: set('chooseId'),
    setMerchantId: set('merchantId'),
  },

  asyncs: {
    async reloadList(dispatch, getState, payload) {
      try {
        kBridge.call('showLoading');
        const merchantId = getState().merchantId;
        const res = await getSubCompany(merchantId);
        dispatch({ type: 'setInitData', payload: { list: res.data || [] } });
        kBridge.call('hideLoading');
      } catch (e) {
        kBridge.call('hideLoading');
        kBridge.call('showToast', e.message);
      }
    },
  },

  async setup(dispatch, getState, { param }) {
    dispatch({ type: 'setChooseId', payload: param.id });
    dispatch({ type: 'setMerchantId', payload: param.merchantId });
    const res = await getSubCompany(param.merchantId);
    if (!res.data) throw new Error('数据异常');
    return { list: res.data };
  },
};
