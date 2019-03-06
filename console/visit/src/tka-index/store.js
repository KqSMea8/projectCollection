import { set } from '@alipay/kobe-store';
import { openPage } from '@alipay/kb-m-biz-util';
import { spmTabMyNavBarSearch, spmTabMyNavBarAdd, spmTabTeamNavBarAdd } from './spm.config';

const TabTitle = {
  my: '我的拜访',
  team: '团队拜访',
};

export default {
  initial: {
    loading: false,
    selectedTab: 'my', // my, team
  },

  reducers: {
    changeTab: set('selectedTab'),
  },

  asyncs: {
    async doChangeTab(dispatch, getState, payload) {
      dispatch({ type: 'changeTab', payload });
      kBridge.call('setNavigationBar', TabTitle[payload]);
      if (payload === 'my') {
        const items = [
          { title: '搜索', url: './tka-visit-search.html', spm: spmTabMyNavBarSearch },
          { title: '╋', url: './tka-visit-add.html', spm: spmTabMyNavBarAdd },
        ];
        kBridge.call('setOptionButton', {
          items,
          onClick: (data) => {
            if (window.Tracert && Tracert.click) Tracert.click(items[data.index].spm);
            openPage(items[data.index].url, (result) => {
              if (result) window.location.reload();
            });
          },
        });
      } else if (payload === 'team') {
        const items = [{ title: '╋', url: './tka-visit-add.html', spm: spmTabTeamNavBarAdd }];
        kBridge.call('setOptionButton', {
          items,
          onClick: (data) => {
            if (window.Tracert && Tracert.click) Tracert.click(items[data.index].spm);
            openPage(items[data.index].url, (result) => {
              if (result) window.location.reload();
            });
          },
        });
      }
    },
  },

  async setup(dispatch, getState, { param }) {
    dispatch({ type: 'doChangeTab', payload: param.tab || 'my' });
  },
};
