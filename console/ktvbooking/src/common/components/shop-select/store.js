import { getShops, getShopsByCity } from './service';

export default {
  namespace: 'shop-select',

  initial: {
    citys: null,
    provinceCity: [], // [provinceCode, cityCode]
    shops: [],
    loadingShops: false,
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
    async getShops() {
      try {
        const res = await getShops();
        const { shopCountGroupByCityVO } = res;
        return shopCountGroupByCityVO || [];
      } catch (err) {
        return [];
      }
    },
    async getShopsByCity(dispatch, getState, payload) {
      try {
        dispatch({ type: 'setState', payload: { loadingShops: true } });
        const res = await getShopsByCity(payload);
        const { shopComps } = res;
        return shopComps || [];
      } catch (err) {
        return [];
      } finally {
        dispatch({ type: 'setState', payload: { loadingShops: false } });
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
