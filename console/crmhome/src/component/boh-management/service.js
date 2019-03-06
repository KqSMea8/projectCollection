import ajax from '../../common/ajax';

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

// 获取门店列表
const fetchShopList = serviceWrapper({
  url: '/goods/deviceMng/queryDeviceInfoList.json',
  method: 'GET',
});
// 批量生成激活码
const requestAllActivation = serviceWrapper({
  url: '/goods/deviceMng/createShopActivationCode.json',
  method: 'POST',
});
// 获取激活码，支持单个和所有
const requestActivation = serviceWrapper({
  url: '/goods/deviceMng/updateShopActivationCode.json',
  method: 'POST',
});
// 设置为主POS
const requestSetMainPOS = serviceWrapper({
  url: '/goods/deviceMng/setMainPos.json',
  method: 'POST',
});

export {
  fetchShopList,
  requestAllActivation,
  requestActivation,
  requestSetMainPOS,
};
