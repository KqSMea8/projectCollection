import ReduceToPromo from './GenericService/ReduceToPromo';
import FullCourtDiscount from './FullCourtDiscount/FullCourtDiscount';
import OffWhenOver from './OffWhenOver/OffWhenOver';
import GoodDetail from './goods/GoodDetail';
import ConfirmChange from './ShelvedGoods/ConfirmChange';
import ShelvedGoodDetail from './ShelvedGoods/GoodDetail';
import ActivityManager from './Activity/ActivityManager';
import SubmitSuccess from './Activity/SubmitSuccess';
import OnlinePurchase from './Catering/OnlinePurchase';
import CateringList from './Catering/CateringList';
import FormItemsTest from './FormItemsTest';
import RepastGoodsDetails from './Catering/RepastGoodsDetails';
import CateringSuccess from './Catering/CateringSuccess';
import CashDiscount from './CashDiscount/CashDiscount';
import DetailForCateringWaiting from './Activity/DetailForCateringWaiting';
import GenericConfirmSuccess from './ShelvedGoods/ConfirmSuccess';

// 商场管理
import Market from './Market/Market';

export default [{
  path: '/oneclickmove-generic/editproduct/:id',
  component: ReduceToPromo,
}, {
  path: '/oneclickmove-generic/fulldiscount',
  component: FullCourtDiscount,
}, {
  path: '/oneclickmove-generic/offWhenOver',
  component: OffWhenOver,
}, {
  path: '/oneclickmove-generic/gooddetail',
  component: GoodDetail,
}, {
  path: '/oneclickmove-generic/activitymanager',
  component: ActivityManager,
}, {
  path: '/oneclickmove-generic/submitsuccess',
  component: SubmitSuccess,
}, {
  path: '/catering/edit',
  component: OnlinePurchase,
}, {
  path: '/catering/new',
  component: OnlinePurchase,
}, {
  path: '/catering/list',
  component: CateringList,
}, {
  path: '/catering/detail',
  component: RepastGoodsDetails,
}, {
  path: '/formitem/test',
  component: FormItemsTest,
}, {
  path: '/catering/success',
  component: CateringSuccess,
}, {
  path: '/catering/discount',
  component: FullCourtDiscount,
}, {
  path: '/catering/offwhenover',
  component: OffWhenOver,
}, {
  path: '/catering/cashdiscount',
  component: CashDiscount,
}, {
  path: '/catering/promodetail',  // 餐饮一键搬家 券详情页
  component: DetailForCateringWaiting,
}, {
  path: '/oneclickmove-generic/confirmchange',
  component: ConfirmChange,
}, {
  path: '/oneclickmove-generic/shelvedgooddetail',
  component: ShelvedGoodDetail,
}, {
  path: '/oneclickmove-generic/confirmsuccess',
  component: GenericConfirmSuccess,
}, {
  path: '/market',
  component: Market,
}];
