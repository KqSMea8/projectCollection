import { itemKeyMap2 } from '../../config/GroupItem';

const convert = values => {
  const res = {};
  res.third = {};
  res.activityType = 'none';
  values.map(({ tagCode, value, op }) => {
    if (tagCode.startsWith('pam_')) {
      let key = tagCode.slice(4);

      key = itemKeyMap2[key] || key;

      // 人群行为 需根据 OP 来判断
      if (tagCode === 'pam_apply_voucher_cnt' || tagCode === 'pam_verify_voucher_cnt') {
        res[key] = op;
      } else {
        res[key] = value;
      }
      if (tagCode === 'pam_first_link_date') {
        res[key] = op + ',' + value;
      }
      if (tagCode === 'pam_range_city_code') {
        res.activityType = 'city';
      }
      if (tagCode === 'pam_range_shop_code') {
        res.activityType = 'shop';
      }
    } else {
      res.third[tagCode] = value;
    }
  });

  return res;
};

export default convert;
