// multi pages needs some common setting
// src/common/index.js will merge to all entry autoly
import { setPageInfo } from '@alipay/kb-m-biz-util';
import './style.less';
import { page } from '../../kobe.config';

setPageInfo(page);

