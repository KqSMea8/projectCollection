import { set } from '@alipay/kobe-store';
import { popPage } from '@alipay/kb-m-biz-util';
import { loadWithPeople } from './service';

const ChooseHistoryKey = 'TKAVisitAddVisitWithPeopleHistory';
function getChooseHistory() { // [{ name, id }]
  const jsonStr = localStorage.getItem(ChooseHistoryKey);
  try {
    return JSON.parse(jsonStr) || [];
  } catch (e) {
    return [];
  }
}
function addChooseListToHistory(choose) { // [{ name, id }]
  let chooseList = getChooseHistory();
  const newIds = choose.map(item => item.id);
  chooseList = chooseList.filter(item => newIds.indexOf(item.id) === -1); // 删除老的相同条目
  chooseList.unshift(...choose); // 添加新条目
  chooseList = chooseList.slice(0, 10); // 取前10个
  localStorage.setItem(ChooseHistoryKey, JSON.stringify(chooseList));
}

export default {
  initial: {
    inputSearchValue: '',
    searchingKey: '',
    list: [], // [{ name, id }]
    headChoose: [], // {id: { name, id }} 展示在头部的
    choose: {}, // {id: { name, id }}
  },

  reducers: {
    setList: set('list'),
    setChoose: set('choose'),
    onSearchInput: set('inputSearchValue'),
    setSearch(state, searchingKey) {
      return {
        ...state,
        inputSearchValue: searchingKey,
        searchingKey,
        list: [],
        headChoose: {
          ...state.choose,
        },
      };
    },
    addChoose(state, item) {
      return {
        ...state,
        choose: {
          ...state.choose,
          [item.id]: item,
        },
      };
    },
    removeChoose(state, itemId) {
      const newChoose = { ...state.choose };
      delete newChoose[itemId];
      return {
        ...state,
        choose: newChoose,
      };
    },
  },

  asyncs: {
    async doSearch(dispatch, getState, searchingKey) {
      dispatch({ type: 'setSearch', payload: searchingKey });
      if (!searchingKey) {
        kBridge.call('showToast', '请输入小二真名或花名');
      } else {
        try {
          kBridge.call('showLoading');
          const list = await loadWithPeople(searchingKey);
          kBridge.call('hideLoading');
          if (!list.length) {
            kBridge.call('showToast', '未搜索到结果，请更换关键字搜索');
          } else {
            dispatch({ type: 'setList', payload: list });
          }
        } catch (err) {
          kBridge.call('hideLoading');
          kBridge.call('showToast', err.message);
        }
      }
    },
    async clickFinish(dispatch, getState) {
      const { choose } = getState();
      if (!choose || choose.length === 0) {
        kBridge.call('showToast', '请选择陪访人');
      } else {
        const chooseList = Object.keys(choose).map(id => choose[id]);
        addChooseListToHistory(chooseList);
        popPage(chooseList);
      }
    },
  },
  async setup(dispatch, getState, { param }) {
    const data = param.data && JSON.parse(param.data); // [{ name, id }]
    if (data) {
      const choose = {};
      data.forEach(item => {
        choose[item.id] = item;
      });
      dispatch({ type: 'setChoose', payload: choose });
    }
    const historyList = getChooseHistory();
    if (historyList && historyList.length) {
      dispatch({ type: 'setList', payload: historyList });
    }
  },
};
