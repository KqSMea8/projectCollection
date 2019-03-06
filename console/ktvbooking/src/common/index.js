/**
 * multi pages needs some common setting
 */
import { getEnv } from '@alipay/kobe-util';
import fetch from '@alipay/kobe-fetch';

import clueTrackerInit from './ClueTracker';

const env = getEnv();
if (env === 'dev' || env === 'local') {
  fetch.setup({
    devServer: ['kbservindustryprod-ztt-1.gz00b.dev.alipay.net'],
  });
}

clueTrackerInit();
