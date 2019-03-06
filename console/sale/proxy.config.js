/* eslint-disable */
var leads = require('./mocks/leads/');
var merchant = require('./mocks/merchant/');
var material = require('./mocks/material/');
var shop = require('./mocks/shop/');
var system = require('./mocks/system/');
var index = require('./mocks/index/');
var common = require('./mocks/common/');
var goods = require('./mocks/goods/');
var notification = require('./mocks/notification/');
var decoration = require('./mocks/decoration/');
var cityarea = require('./mocks/cityarea/');
var intelligentgoods = require('./mocks/intelligentgoods/');

module.exports = Object.assign({}, leads, shop, merchant, common, index, system, goods, material, notification, decoration, cityarea, intelligentgoods);
