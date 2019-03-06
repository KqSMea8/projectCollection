import ajax from '../../common/ajax';
import { getOrigin } from './util';

const origin = getOrigin();

const serviceWrapper = (params = {}) => {
  return (opts = {}) => ajax({
    ...params,
    ...opts,
    data: {
      ...(params.data || {}),
      ...(opts.data || {}),
      _t: + new Date(), // 清除缓存
    },
  });
};

// 获取用户信息
const fetUserInfo = serviceWrapper({
  url: `${origin}/merchant/queryWeiboUserInfo.json`,
  method: 'GET',
});

// 解绑
const fechUnBind = serviceWrapper({
  url: `${origin}/merchant/unbindWeibo.json`,
  method: 'GET',
});

export {
  fetUserInfo,
  fechUnBind,
};
