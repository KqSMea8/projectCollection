import MyMerchant from './MyMerchant/MyMerchant';
import ServiceConfig from './ServiceConfig/ServiceConfig';
import MerchantDetail from './MerchantDetail/MerchantDetail';
import MerchantInfo from './MerchantDetail/MerchantInfo';
import MerchantOrder from './MerchantDetail/MerchantOrder';
import MerchantLog from './MerchantDetail/MerchantLog';
import MyBrands from './MyBrands/MyBrands';
import BrandOwner from './BrandOwner/BrandOwner';
import BrandOwnerDetail from './BrandOwner/BrandOwnerDetail';
import BrandOwnerInfo from './BrandOwner/BrandOwnerInfo';
import BrandOwnerOrder from './BrandOwner/BrandOwnerOrder';
import BrandOwnerLog from './BrandOwner/BrandOwnerLog';
import ManageBrandOwner from './BrandOwner/ManageBrandOwner';
import GatheringShop from './GatheringShop/GatheringShop';

export default [
  {
    path: 'merchant',
    component: MyMerchant,
  },
  {
    path: 'mybrands',
    component: MyBrands,
  },
  {
    path: 'merchant/config/:pid',
    component: ServiceConfig,
  },
  {
    path: 'merchant/detail/:pid',
    component: MerchantDetail,
    childRoutes: [{
      path: 'info',
      component: MerchantInfo,
    }, {
      path: 'order',
      component: MerchantOrder,
    }, {
      path: 'log',
      component: MerchantLog,
    }],
  },
  { // 品牌商
    path: 'merchant/brandOwner',
    component: BrandOwner,
  },
  { // 品牌商详情
    path: 'merchant/brandOwner/detail/:pid',
    component: BrandOwnerDetail,
    childRoutes: [{
      path: 'info',
      component: BrandOwnerInfo,
    }, {
      path: 'order',
      component: BrandOwnerOrder,
    }, {
      path: 'log',
      component: BrandOwnerLog,
    }],
  },
  { // 管理品牌商
    path: 'merchant/brandOwner/manageBrandOwner',
    component: ManageBrandOwner,
  },
  { // 支付宝收款商户
    path: 'paymerchant',
    component: GatheringShop,
  },
];
