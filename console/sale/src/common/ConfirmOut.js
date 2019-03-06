import {Lifecycle} from 'react-router';
import {Modal} from 'antd';

let forceGoto = false;
let showModal = true;

export default {
  mixins: [Lifecycle],

  routerWillLeave(nextLocation) {
    this.nextPath = nextLocation.pathname;
    if (this.noConfirmOut) {
      return true;
    }
    if (showModal) {
      Modal.confirm({
        title: '二次确认',
        content: '确定离开当前编辑嘛？当前并不保存草稿',
        onOk: () => {
          forceGoto = true;
          window.location.hash = this.nextPath;
        },
        onCancel: () => {
          showModal = true;
        },
      });
      showModal = false;
    }
    return forceGoto;
  },
};
