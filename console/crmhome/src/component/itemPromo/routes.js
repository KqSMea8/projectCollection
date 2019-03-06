import MainRedirect from './MainRedirect';
import OtherRedirect from './OtherRedirect';

export default [{
  // 活动列表
  path: 'item-promo',
  component: MainRedirect,
}, {
  path: 'item-promo/detail/goods',
  component: OtherRedirect,
}, {
  path: 'item-promo/new',
  component: OtherRedirect,
}, {
  // 商品活动报名
  path: 'item-promo/new/goods',
  component: OtherRedirect,
}, {
  path: 'item-promo/edit',
  component: OtherRedirect,
}, {
  path: 'item-promo/detail',
  component: OtherRedirect,
}];
