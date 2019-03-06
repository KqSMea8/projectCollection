import ajax from '../../common/ajax';
import getJSON from './ajax';

const serviceWrapper = (params = {}) => {
  return (opts = {}) => ajax({
    ...params,
    ...opts,
    data: {
      ...(params.data || {}),
      ...(opts.data || {}),
      _t: (new Date()).getTime(), // 清除缓存
    },
  });
};

// 获取行业解决方案
const fetchSolutionList = () => getJSON({
  url: 'https://render.alipay.com/p/s/h5data/prod/kb-crmhome-data/boh/solution-h5data.json',
});
// 获取授权信息
const fetchAuthorization = serviceWrapper({
  url: '/goods/deviceMng/queryAuthorizeInfo.json',
  method: 'GET',
});
// 提交授权
const requestAuthorization = serviceWrapper({
  url: '/goods/deviceMng/authorizeMerchantDeviceMng.json',
  method: 'POST',
});

export {
  fetchSolutionList,
  fetchAuthorization,
  requestAuthorization,
};
