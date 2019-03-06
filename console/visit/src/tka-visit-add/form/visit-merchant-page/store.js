import { set } from '@alipay/kobe-store';
import PageList from 'rmc-pagelist/Antm2PageList';
import { setSpm } from '@alipay/kobe-util';
import { loadMyMerchant, loadUnderMerchant } from './service';
import spmConfig from './spm.config';

const noop = () => {};

export default {
  initial: {
    chooseMerchantId: '',
    tabIndex: 0,
    myMerchantData: [], // [ { 接口返回的数据格式 } ]
    myMerchantSearch: '',
    originUnderMerchantData: null,
    underMerchantData: {}, // { group: [ { 接口返回的数据格式 } ]}
    underMerchantDataGroups: [], // ['A', 'B', 'G']
    underMerchantSearch: '',
  },

  reducers: {
    setChooseMerchantId: set('chooseMerchantId'),
    setTabIndex: set('tabIndex'),
    setMyMerchantData: set('myMerchantData'),
    onMyMerchantSearchChange: set('myMerchantSearch'),
    setOriginUnderMerchantData: set('originUnderMerchantData'),
    setUnderMerchantData: set('underMerchantData'),
    setUnderMerchantDataGroups: set('underMerchantDataGroups'),
    onUnderMerchantSearchChange: set('underMerchantSearch'),
  },

  asyncs: {
    async loadMyMerchantData(dispatch, getState, payload) {
      const { resolve = noop, reject = noop } = payload;

      // 拉接口数据
      const state = getState();
      const { myMerchantSearch } = state;
      try {
        const res = await loadMyMerchant(myMerchantSearch);
        if (!res.data) throw new Error('数据异常');
        const data = (res.data && res.data.visitObjList) || [];
        dispatch({ type: 'setMyMerchantData', payload: data });
        if (data.length === 0) {
          reject(myMerchantSearch ? '未搜索到数据，请更换关键字再试' : PageList.EmptyDataError);
        } else {
          resolve(false); // 不分页，没有更多了
          setTimeout(() => setSpm(spmConfig), 300); // 手动更新 spm
        }
      } catch (e) {
        reject(e.message);
      }
    },
    async loadUnderMerchantData(dispatch, getState, payload) {
      const { resolve = noop, reject = noop } = payload;

      // 拉接口数据
      const state = getState();
      const { underMerchantSearch } = state;
      try {
        const res = await loadUnderMerchant(underMerchantSearch);
        if (!res.data) throw new Error('数据异常');
        const underMerchantList = (res.data && res.data.visitObjList) || [];
        const underMerchantData = {};
        const underMerchantDataGroups = [];
        underMerchantList.forEach(item => {
          const itemList = underMerchantData[item.spell] || [];
          underMerchantData[item.spell] = itemList;
          itemList.push(item);
          if (underMerchantDataGroups.indexOf(item.spell) === -1) {
            underMerchantDataGroups.push(item.spell);
          }
        });
        underMerchantDataGroups.sort();

        dispatch({ type: 'setUnderMerchantData', payload: underMerchantData });
        dispatch({ type: 'setUnderMerchantDataGroups', payload: underMerchantDataGroups });
        if (underMerchantList.length === 0) {
          reject(underMerchantSearch ? '未搜索到数据，请更换关键字再试' : PageList.EmptyDataError);
        } else {
          resolve(false); // 不分页，没有更多了
          setTimeout(() => setSpm(spmConfig), 300); // 手动更新 spm
        }
      } catch (e) {
        reject(e.message);
      }
    },
  },
  async setup(dispatch, getState, { param }) {
    if (param.merchantId) {
      dispatch({ type: 'setChooseMerchantId', payload: param.merchantId });
    }
  },
};
