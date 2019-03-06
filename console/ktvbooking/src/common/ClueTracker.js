import Tracker from '@ali/tracker';
import pkg from '../../package.json';

function init(options = {}) {
  try {
    const tracker = new Tracker({
      pid: 'kb-middle-platform',
      uidResolver: () => window.APP.uvUserId, // 获取userid的逻辑
      releaseResolver: () => pkg.version, // 获取版本号的逻辑
      ignoredQueries: ['_k'], // 过滤url中query的_k参数
      ...options,
    });
    window._clue_tracker = tracker; // eslint-disable-line
    tracker.onGlobalError(); // 监听全局 JS 异常
  } catch (error) {
    console.warn(error); // eslint-disable-line
  }
}

export default init;
