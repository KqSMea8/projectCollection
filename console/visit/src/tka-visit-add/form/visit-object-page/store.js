import { set } from '@alipay/kobe-store';
import { popPage } from '@alipay/kb-m-biz-util';
import { getVisitObject, deleteVisitObject } from './service';
import watchStoreChange from '../../../common/watchStoreChange';

const store = {
  initial: {
    choose: {}, // {id: {name, id, job, phone}}
  },

  reducers: {
    setChoose: set('choose'),
    addChoose(state, chooseItem) {
      return {
        ...state,
        choose: {
          ...state.choose,
          [chooseItem.id]: chooseItem,
        },
      };
    },
    removeChoose(state, id) {
      const choose = state.choose;
      delete choose[id];
      return {
        ...state,
        choose: { ...choose },
      };
    },
    addGroupChoose(state, job) {
      const { initData, choose } = state;
      Object.keys(initData).forEach(key => {
        initData[key].forEach(item => {
          if (item.job === job) {
            choose[item.id] = item;
          }
        });
      });
      return {
        ...state,
        choose: { ...choose },
      };
    },
    removeGroupChoose(state, job) {
      const { choose } = state;
      Object.keys(choose).forEach(id => {
        const item = choose[id];
        if (item.job === job) {
          delete choose[id];
        }
      });
      return {
        ...state,
        choose: { ...choose },
      };
    },
    addItem(state, newItem) {
      const initData = state.initData;
      const jobList = initData[newItem.job] || [];
      initData[newItem.job] = jobList;
      jobList.push(newItem);
      return {
        ...state,
        initData: {
          ...initData,
        },
      };
    },
    deleteItem(state, itemId) {
      const initData = state.initData;
      const newData = {};
      Object.keys(initData).forEach(key => {
        const newList = [];
        initData[key].forEach(item => {
          if (item.id !== itemId) {
            newList.push(item);
          }
        });
        if (newList.length > 0) {
          newData[key] = newList;
        }
      });
      return {
        ...state,
        initData: newData,
      };
    },
    modifyItem(state, { origin, modify }) {
      let newState = this.deleteItem(state, origin.id);
      newState = this.addItem(newState, modify);
      // 保留选中
      if (newState.choose[origin.id]) {
        delete newState.choose[origin.id];
        newState.choose[modify.id] = modify;
      }
      return newState;
    },
  },

  asyncs: {
    async doDeleteItem(dispatch, getState, item) {
      try {
        kBridge.call('showLoading');
        await deleteVisitObject(item.id);
        dispatch({ type: 'removeChoose', payload: item.id });
        dispatch({ type: 'deleteItem', payload: item.id });
        kBridge.call('hideLoading');
        kBridge.call('showToast', '删除成功');
      } catch (err) {
        kBridge.call('hideLoading');
        kBridge.call('showToast', `删除失败:${err.message}`);
      }
    },
    async clickFinish(dispatch, getState) {
      const choose = getState().choose;
      const chooseIds = Object.keys(choose);
      let hasPhone = false;
      const popResult = chooseIds.map(id => {
        const item = choose[id];
        if (item.phone) hasPhone = true;
        return item;
      });
      if (!hasPhone) {
        kBridge.call('showToast', '至少要有一个拜访对象的电话');
      } else {
        popPage(popResult);
      }
    },
  },

  async setup(dispatch, getState, { param }) {
    const data = param.data && JSON.parse(param.data);
    const chooseIds = data ? data.map(item => item.id) : [];

    const res = await getVisitObject(param.merchantId);
    if (!res.data) throw new Error('数据异常');
    const initData = {}; // {job: [{name, id, job, phone}]}
    if (res.data) {
      const chooseItems = {};
      res.data.forEach(item => {
        const jobList = initData[item.job] || [];
        initData[item.job] = jobList;
        jobList.push(item);

        if (chooseIds.indexOf(item.id) !== -1) {
          chooseItems[item.id] = item;
        }
      });
      dispatch({ type: 'setChoose', payload: chooseItems });
    }

    return initData;
  },
};

export default watchStoreChange(store);
