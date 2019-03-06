import './common/shop.less';
import ShopList from './ShopList/ShopList';
import ShopDetail from './ShopDetail/ShopDetail';
import ShopDetailBase from './ShopDetail/ShopDetailBase';
import ShopDetailGoods from './ShopDetail/ShopDetailGoods';
import ShopDetailHistory from './ShopDetail/ShopDetailHistory';
import ShopDetailPunishment from './ShopDetail/ShopDetailPunishment';
import NewShop from './NewShop/NewShop';
import StayOpenShopListDetail from './TeamShop/StayOpenShopListDetail';
import ShopQualityScoreDetail from './ShopQualityMark/ShopQualityScoreDetail';
import ShopMap from './ShopMap/index';

export default [{
  path: 'shop(/:key)',
  component: ShopList,
}, {
  path: 'shop/detail/:shopId',
  component: ShopDetail,
  childRoutes: [{
    path: 'base',
    component: ShopDetailBase,
  }, {
    path: 'goods',
    component: ShopDetailGoods,
  }, {
    path: 'history',
    component: ShopDetailHistory,
  }, {
    path: 'punishment',
    component: ShopDetailPunishment,
  }],
}, {
  path: 'shop/create',
  component: NewShop,
}, {
  path: 'shop/create/:id',
  component: NewShop,
}, {
  path: 'shop/edit(/:shopId)',
  component: NewShop,
}, {
  path: 'shop/reopen(/:historyShopId)',
  component: NewShop,
}, {
  path: 'shop/quality-score/:shopId',
  component: ShopQualityScoreDetail,
}, {
  path: 'shop/diary/:shopId/:action',
  component: StayOpenShopListDetail,
}, {
  path: 'shop/map',
  component: ShopMap,
}, {
  path: 'shop/map/:buildingId/:shopId',
  component: ShopMap,
}, {
  path: 'shop/map/:buildingId',
  component: ShopMap,
},
];
