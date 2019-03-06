import { set } from '@alipay/kobe-store';
import { openPage } from '@alipay/kb-m-biz-util';
import { spmNavBarApprove } from './spm.config';
import { getData } from './service';

export default {
  initial: {
    digitalFeedback: null,
  },
  reducers: {
    setDigitalFeedback: set('digitalFeedback'), // 数字化程度反馈
  },
  async setup(dispatch, getState, { param }) {
    const res = await getData(param.id);
    dispatch({ type: 'setDigitalFeedback', payload: res.data.digitalFeedBack });
    if (res.data && res.data.isAudit === '1') {
      kBridge.call('setOptionButton', {
        items: [
          {
            title: '审阅',
          },
        ],
        onClick() {
          if (window.Tracert && Tracert.click) Tracert.click(spmNavBarApprove);
          openPage(`./tka-visit-approve.html?id=${param.id}`, () => {
            kBridge.call('setOptionButton', { items: [] });
            window.location.reload();
          });
        },
      });
    } else {
      kBridge.call('setOptionButton', { items: [] });
    }
    return res.data;
  },
};
