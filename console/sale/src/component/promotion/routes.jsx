import OrderPromotion from './service/OrderPromotion';
import ClaimPromotion from './service/ClaimPromotion';
import MyPromotion from './service/MyPromotion';
import MyPromotionDetail from './service/MyPromotionDetail';
import PromotionBill from './service/PromotionBill';

import './common.less';

export default [{ // 选购推广服务
  path: 'promotion/list',
  component: OrderPromotion,
}, {  // 认领推广服务
  path: 'promotion/claim/:taskId',
  component: ClaimPromotion,
}, {  // 我的推广服务
  path: 'promotion/myOrder',
  component: MyPromotion,
}, { // 我的推广服务详情
  path: 'promotion/myOrder/detail/:taskId',
  component: MyPromotionDetail,
}, { // 推广服务账单
  path: 'promotion/bill',
  component: PromotionBill,
}];
