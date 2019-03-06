const mock = require('mockjs').mock;

const solution = require('./solution.json');
const shopList = require('./shop-list');

const STATUS_SUCCEED = {status: 'succeed'};

module.exports = {
  'GET /kb-crmhome-data/boh/solution-h5data.json': (req, res) => {
    res.json({
      ...STATUS_SUCCEED,
      ...solution,
    });
  },
  'GET /goods/deviceMng/queryAuthorizeInfo.json': (req, res) => {
    res.json({
      ...STATUS_SUCCEED,
      isAuthorized: false,
    });
  },
  'POST /goods/deviceMng/authorizeMerchantDeviceMng.json': (req, res) => {
    res.json({
      ...STATUS_SUCCEED,
    });
  },
  'GET /goods/deviceMng/queryDeviceInfoList.json': (req, res) => {
    res.json(mock({
      ...STATUS_SUCCEED,
      'hasActivated|1': true,
      'total': 100,
      'data|0-20': shopList,
    }));
  },
  'POST /goods/deviceMng/createShopActivationCode.json': (req, res) => {
    res.json({
      ...STATUS_SUCCEED,
    });
  },
  'POST /goods/deviceMng/updateShopActivationCode.json': (req, res) => {
    res.json({
      ...STATUS_SUCCEED,
    });
  },
  'POST /goods/deviceMng/setMainPos.json': (req, res) => {
    res.json({
      ...STATUS_SUCCEED,
    });
  },
};
