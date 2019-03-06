import './common/shop.less';
import ShopList from './ShopList/ShopList';
import MyShopList from './ShopList/MyShopList';
import PosShopList from './ShopList/PosShopList';
import BacklogShopList from './ShopList/BacklogShopList';
// import HistoryShopList from './ShopList/HistoryShopList'; 历史门店下线 暂时保留原文件
import BacklogShopListForService from './ShopList/BacklogShopListForService';
import ShopDetail from './ShopDetail/ShopDetail';
import ShopDetailBase from './ShopDetail/ShopDetailBase';
import ShopDetailGoods from './ShopDetail/ShopDetailGoods';
import ShopDetailMaterial from './ShopDetail/ShopDetailMaterial';
import ShopDetailOrder from './ShopDetail/ShopDetailOrder';
import ShopDetailHistory from './ShopDetail/ShopDetailHistory';
import ShopDetailPunishment from './ShopDetail/ShopDetailPunishment';
import ShopDetailCatering from './ShopDetail/ShopDetailCatering';
import ShopQualityScore from './ShopDetail/ShopQualityScore';
import NewShop from './NewShop/NewShop';
import ShopAllocList from './ShopAlloc/ShopAllocList';
import ToConfirmList from './ShopAlloc/ToConfirmList';
import ManualAllocList from './ShopAlloc/ManualAllocList';
import ManualPosAllocList from './ShopAlloc/ManualPosAllocList';
import ShopAllocBatchLog from './ShopAlloc/ShopAllocBatchLog';
import ShopAuthList from './ShopAuth/ShopAuthList';
import TeamShopList from './TeamShop/TeamShopList';
import TeamPosShopList from './TeamShop/TeamPosShopList';
import TeamShopIndex from './TeamShop/TeamShopIndex';
import TeamShopBatchLog from './TeamShop/TeamShopBatchLog';
import StayOpenShopList from './TeamShop/StayOpenShopList';
import StayOpenShopListDetail from './TeamShop/StayOpenShopListDetail';
import CategorySummary from './common/CategorySummary';
import CityShopIndex from './CityShop/CityShopIndex';
import ShopCorrection from './ShopCorrection/ShopCorrection';
import NameListTab from './NameList/NameListTab';
import NewNameList from './NameList/NewNameList';
import showTrainingTask from '../../common/BindTrainingTask';// 任务绑定
import RateIndex from './QueryBatchList/RateIndex';
import ShopDropList from './ShopAlloc/ShopDropList';
import ShopLogo from './shopLogo';
import BatchProgressTable from './QueryBatchList/BatchProgressTable';

export default [{
  path: 'shop',
  component: ShopList,
  onEnter: showTrainingTask,
  childRoutes: [{
    path: 'my',
    component: MyShopList,
  }, {
    path: 'posShop',
    component: PosShopList,
  }, {
    path: 'backlog',
    component: BacklogShopList,
  }],
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
    path: 'material',
    component: ShopDetailMaterial,
  }, {
    path: 'order',
    component: ShopDetailOrder,
  }, {
    path: 'history',
    component: ShopDetailHistory,
  }, {
    path: 'punishment',
    component: ShopDetailPunishment,
  }, {
    path: 'catering',
    component: ShopDetailCatering,
  },
],
}, {
  path: 'shop/backlog-service',
  onEnter: showTrainingTask,
  component: BacklogShopListForService,
}, {
  path: 'shop/create',
  onEnter: showTrainingTask,
  component: NewShop,
}, {
  path: 'shop/create/:id',
  component: NewShop,
}, {
  path: 'shop/edit/:shopId',
  component: NewShop,
},/* 服务中台跳销售中台修改专用 */{
  path: 'shop/edit-for-support/:shopId',
  component: NewShop,
}, {
  path: 'shop/create/:id/:type',
  component: NewShop,
}, {
  path: 'shop/team',
  onEnter: showTrainingTask,
  component: TeamShopIndex,
  childRoutes: [{
    path: 'team-list',
    component: TeamShopList,
  }, {
    path: 'team-pos-list',
    component: TeamPosShopList,
  }, {
    path: 'stay-open',
    component: StayOpenShopList,
  }],
}, {
  path: 'shop-alloc',
  onEnter: showTrainingTask,
  component: ShopAllocList,
  childRoutes: [{
    path: 'to-confirm',
    component: ToConfirmList,
  }, {
    path: 'manual',
    component: ManualAllocList,
  }, {
    path: 'manual-pos',
    component: ManualPosAllocList,
  }, {
    path: 'shop-drop',
    component: ShopDropList,
  }],
}, {
  path: 'shop-auth',
  onEnter: showTrainingTask,
  component: ShopAuthList,
}, {
  path: 'shop/diary/:shopId/:action',
  component: StayOpenShopListDetail,
}, {
  path: 'shop/category-summary',
  component: CategorySummary,
}, {
  path: '/shop/quality-score/:id/:pid',
  component: ShopQualityScore,
}, {
  path: '/shop-alloc/logs/:bizType',
  component: ShopAllocBatchLog,
}, {
  path: '/shop/team/logs',
  component: TeamShopBatchLog,
}, {
  path: 'shop-correction',
  component: ShopCorrection,
},
/* 我的品牌带参数查询 */{
  path: 'shop/team',
  onEnter: showTrainingTask,
  component: TeamShopIndex,
  childRoutes: [{
    path: 'team-list/:id/:name', // 已弃用
    component: TeamShopList,
  }, {
    path: 'stay-open',
    component: StayOpenShopList,
  }],
}, {
  path: 'shop',
  onEnter: showTrainingTask,
  component: ShopList,
  childRoutes: [{
    path: 'my/:id/:name', // 已弃用
    component: MyShopList,
  }, {
    path: 'backlog',
    component: BacklogShopList,
  }],
}, {
  onEnter: showTrainingTask,
  path: 'shop/cityshop',
  component: CityShopIndex,
}, {
  onEnter: showTrainingTask,
  path: 'shop/NameList(/:tab)',
  component: NameListTab,
}, {
  path: 'shop/NameList/to-edit/:displayCode',
  component: NewNameList,
}, {
  path: 'shop/rate',
  component: RateIndex,
}, {
  path: 'shop/batchprogress',
  component: BatchProgressTable,
}, {
  path: 'kbsales-batchprogress',
  component: BatchProgressTable,
}, {
  path: 'shop/shoplogo',
  component: ShopLogo,
}
];
