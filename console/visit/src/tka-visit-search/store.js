import { set } from '@alipay/kobe-store';

export default {
  initial: {
    searchValue: '',
    searchingValue: '',
    listKey: 1,
  },

  reducers: {
    onSearchValueChange: set('searchValue'),
    doSearch(state, searchingValue) {
      return {
        ...state,
        searchingValue,
        listKey: state.listKey + 1,
      };
    },
  },
};
