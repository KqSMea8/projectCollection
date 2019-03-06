import './common.less';
import 'antd/dist/antd.css';
import fetch from '@alipay/kb-fetch';
import pkg from '../../package.json';
import clue from '@alipay/kb-framework/framework/util/clue';
import 'Utility/ajax'; // config ajax

clue.config({
  uidResolver: () => window.APP.uvUserId, // 获取userid的逻辑
  releaseResolver: () => `${pkg.name}@${pkg.version}`, // 获取版本号的逻辑
});

fetch.setup({
  devServer: [window.APP.kbsalesUrl, window.APP.kbservcenterUrl, window.APP.crmhomeUrl, 'crmhome-zth-18.gz00b.dev.alipay.net'],
  clueReleaseResolver: () => `${pkg.name}@${pkg.version}`, // 获取版本号的逻辑
});
