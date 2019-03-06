import { set } from '@alipay/kobe-store';
import { getParam } from '@alipay/kobe-util';
import { popPage } from '@alipay/kb-m-biz-util';
import { addSubCompany } from './service';
import watchStoreChange from '../../../../common/watchStoreChange';

function fixPromiseThenMayNotTrigger() {
  try {
    //  Promise.then 偶尔不能回调的 bug，排查发现 Promise 依赖的 MutationObserver 没有触发回调导致，这里强制触发
    const observer = new MutationObserver(() => {
      // kBridge.call('showToast', 'ok');
    });
    const node = document.createTextNode('');
    observer.observe(node, { characterData: true });
    node.data = 1;
  } catch (e) {
    // noop
  }
}

const store = {
  initial: {
    content: '', // 输入的分公司名称
  },
  reducers: {
    onContentChange: set('content'),
  },
  asyncs: {
    async doAddItem(dispatch, getState) {
      const content = getState().content;
      if (!content || content.length > 50) {
        kBridge.call('showToast', '请输入分公司的全称(小于50字)');
      } else {
        try {
          kBridge.call('showLoading');
          fixPromiseThenMayNotTrigger();
          await addSubCompany(getParam().merchantId, content);
          kBridge.call('hideLoading');
          popPage(true);
        } catch (err) {
          kBridge.call('hideLoading');
          kBridge.call('showToast', err.message);
        }
      }
    },
  },
};

export default watchStoreChange(store);
