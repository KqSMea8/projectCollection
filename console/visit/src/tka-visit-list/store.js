import { openPage } from '@alipay/kb-m-biz-util';
import { spmNavBarSearch } from './spm.config';

export default {
  initial: {
  },

  async setup(dispatch, getState, { param }) {
    kBridge.call('setNavigationBar', param.visitorName || '拜访');

    const items = [{ title: '搜索', url: './tka-visit-search.html', spm: spmNavBarSearch }];
    kBridge.call('setOptionButton', {
      items,
      onClick: (data) => {
        if (window.Tracert && Tracert.click) Tracert.click(items[data.index].spm);
        openPage(items[data.index].url);
      },
    });
  },
};
