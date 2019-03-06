import GoodsList from './GoodsList/GoodsList';
import CreateGoods from './GoodsCreate/CreateGoods';
import ModifyGoods from './GoodsCreate/ModifyGoods';
import DiscountDetail from './GoodsDetail/DiscountDetail';
import ExchangeDiscountDetail from './GoodsDetail/ExchangeDiscountDetail';
import SingleDiscountDetail from './GoodsDetail/SingleDiscountDetail';
import SingleVouchersDetail from './GoodsDetail/SingleVouchersDetail';
import SubsidyCouponDetail from './GoodsDetail/SubsidyCouponDetail';
import ExclusiveSalesCouponDetail from './GoodsDetail/ExclusiveSalesCouponDetail';
import OperationLog from './common/OperationLog';
import WhiteList from './TestWhiteList/WhiteList';
import StoredValueCardDetail from './GoodsDetail/StoredValueCardDetail';
import StoredValueCardInfo from './GoodsDetail/StoredValueCardInfo';
import StoredValueCardOrder from './GoodsDetail/StoredValueCardOrder';
import StreamStoredValueCardInfo from './GoodsDetail/StreamStoredValueCardInfo';
import StoredValueCardLog from './common/StoredValueCardLog';
import NormalVouchersDetail from './GoodsDetail/NormalVouchersDetail';
import GoodsServiceIndex from './GoodsService/GoodsServiceIndex';
import GoodsServiceDetail from './GoodsService/GoodsServiceDetail';
import ShelfGoodsDetail from './GoodsDetail/ShelfGoodsDetail';
import OneClickMoveCRMIframe from './GoodsDetail/OneClickMoveCRMIframe';
import Buyvouchersdetail from './GoodsDetail/Buyvouchersdetail';
import GoodsListV2 from './GoodsList/GoodsListV2';
import Itempromo from './GoodsList/GoodsListPromo';

export default [
  {
    path: 'goods/create',
    component: CreateGoods,
  },
  {
    path: 'goods/modify/:itemId/:opMerchantId/:discountType',
    component: ModifyGoods,
  },
  {
    path: 'goods/whitelist',
    component: WhiteList,
  },
  {
    path: 'goods/itempromo',
    component: Itempromo,
  },
  {
    path: 'goods/operationlog',
    component: OperationLog,
  },
  {
    path: 'goods/list',
    component: GoodsList,
  },
  {
    path: 'goods/listV2',
    component: GoodsListV2,
  },
  {
    path: 'goods/discount/:itemId',
    component: DiscountDetail,
  },
  {
    path: 'goods/singlediscount/:itemId',
    component: SingleDiscountDetail,
  },
  {
    path: 'goods/singlevouchers/:itemId',
    component: SingleVouchersDetail,
  },
  {
    path: 'goods/exchangediscount/:itemId',
    component: ExchangeDiscountDetail,
  },
  {
    path: 'goods/subsidycoupon/:itemId',
    component: SubsidyCouponDetail,
  },
  {
    path: 'goods/exclusivesalescoupon/:itemId',
    component: ExclusiveSalesCouponDetail,
  },
  {
    path: 'goods/normalvouchersdetail/:itemId',
    component: NormalVouchersDetail,
  },
  {
    path: 'goods/buyvouchersdetail/:itemId',
    component: Buyvouchersdetail,
  },
  {
    path: 'goods/storedvaluecarddetail/:itemId',
    component: StoredValueCardDetail,
    childRoutes: [{
      path: 'cardInfo',
      component: StoredValueCardInfo,
    }, {
      path: 'cardOrder',
      component: StoredValueCardOrder,
    }, {
      path: 'cardLog',
      component: StoredValueCardLog,
    }],
  },
  {
    path: 'goods/streamstoredvaluecardinfo/:itemId/:logId',
    component: StreamStoredValueCardInfo,
  }, { // 商品服务
    path: 'goods/goodsservice',
    component: GoodsServiceIndex,
  }, { // 商品服务>服务详情
    path: 'goods/goodsservice/servicedetail',
    component: GoodsServiceDetail,
  }, { // 货架商品详情
    path: 'goods/shelfgoodsdetail/:itemId',
    component: ShelfGoodsDetail,
  },
  { // 一键搬家 crmhome 用 iframe (generic)
    path: 'goods/oneclickmove',
    component: OneClickMoveCRMIframe,
  },
  { // 一键搬家 crmhome 用 iframe (catering)
    path: '/catering/oneclickmove',
    component: OneClickMoveCRMIframe,
  },
];
