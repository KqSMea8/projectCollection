import { itemKeyMap, itemOpMap, ageRangeMap, activityTimeMap } from '../../config/GroupItem';
import moment from 'moment';
const convert = values => {
  const { trade, tradeAmountMin, tradeAmountMax, tradeCountMin, tradeCountMax, tradePerPriceMin,
    tradePerPriceMax, firstLinkDate } = values;
  if (trade) {
    if (tradeAmountMin !== undefined && tradeAmountMax !== undefined) {
      values.tradeAmount = [tradeAmountMin * 100, tradeAmountMax * 100];
    }
    if (tradeCountMin !== undefined && tradeCountMax !== undefined) {
      values.tradeCount = [tradeCountMin, tradeCountMax];
    }
    if (tradePerPriceMin !== undefined && tradePerPriceMax !== undefined) {
      values.tradePerPrice = [tradePerPriceMin * 100, tradePerPriceMax * 100];
    }
  }
  if (firstLinkDate) {
    values.firstLinkDate = moment(firstLinkDate).format('YYYYMMDD');
  }
  return Object.keys(values).
    filter(key => itemKeyMap.hasOwnProperty(key) || key.startsWith('_')).
    map(key => {
      let value = values[key];
      let tagCode = `pam_${itemKeyMap[key]}`;
      let op = itemOpMap[key];
      if (key === 'age') {
        const [min, max] = value;
        const keys = Object.keys(ageRangeMap);
        let range = [];
        for (let i = keys.indexOf(String(min)) + 1; i <= keys.indexOf(String(max)); i++) {
          range = range.concat(ageRangeMap[keys[i]]);
        }
        value = range;
      }
      console.log(key);
      if (key === 'applyVoucher') {
        value = '0';
      }

      if (key === 'verifyVoucher' && values.applyVoucher === '1') {
        op = 'LTEQ';
      }
      if (key === 'firstLinkDate' && values.firstLink === 'GTEQ') {
        op = 'GTEQ';
      }
      if (key === 'userIdVoucher') {
        op = 'EQ';
      }

      const prefix = values.activityShopType === 'city' ? 'pam_range_city_' : 'pam_range_shop_';
      if (key === 'activityTime') {
        tagCode = `${prefix}${itemKeyMap[key]}`;
        value = value.map(v => activityTimeMap[v]);
      }
      if (key === 'activityLbs') {
        tagCode = `${prefix}${itemKeyMap[key]}`;
      }
      if (key === 'activityScope') {
        tagCode = `${prefix}${itemKeyMap[key]}`;
      }
      if (key.startsWith('_')) {
        const [ op2, value2 ] = value.split(',');
        op = op2;
        value = value2;
        tagCode = `${key.slice(1)}`;
      }
      return { tagCode, op, value };
    });
};

export default convert;
