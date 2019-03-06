const common = require('./mocks/common/');
const report = require('./mocks/report/');
const shop = require('./mocks/shop');
const MemberMarketing = require('./mocks/MemberMarketing');
const MarketingActivity = require('./mocks/MarketingActivity');
const decorationMaterial = require('./mocks/decorationMaterial');
const Huabei = require('./mocks/huabei/');
const stuff = require('./mocks/stuff/');
const itempromo = require('./mocks/itempromo');
const vouchers = require('./mocks/vouchers');
const boh = require('./mocks/boh');

module.exports = Object.assign({}, common, report, shop, MemberMarketing, MarketingActivity,
  decorationMaterial, Huabei, stuff, itempromo, vouchers, boh);
