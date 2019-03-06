import SignUp from './SignUp/SignUp';
import ActivityManage from './manage/ActivityManage';
import MarketingCreate from './MarketingActivity/MarketingCreate';
import MarketingDetail from './MarketingActivity/MarketingDetail';
import MarketingActivityManage from './manage/MarketingActivityManage';
import NewMarketingManage from './manage/NewMarketingManage';
import ActivityDetail from './manage/ActivityDetail';
import ActivityDetailBase from './manage/ActivityDetailBase';
import ActivityDetailOperation from './manage/ActivityDetailOperation';
import MemberActivityIndex from './MemberActivity/MemberActivityIndex';
import ThirdPartyMarketingActivityManage from './manage/ThirdPartyMarketingActivityManage';
import MarketingCase from './MarketingCase';
import FundsManage from './FundsManage/FundsManage';
import EnterprisePerksIndex from './EnterprisePerks/EnterprisePerksIndex';// 口碑福利活动
import AddEnterprisePerks from './EnterprisePerks/AddEnterprisePerks';// 新增口碑福利活动
import ActivitiesBill from './ActivitiesBill';
import IframeWrap from './IframeWrap/index';
export default [
  {
    path: 'activity/signup',
    component: SignUp,
  },
  {
    path: 'activity/manage',
    component: ActivityManage,
  },
  {
    path: 'activity/marketingcreate',
    component: MarketingCreate,
  },
  {
    path: 'activity/marketingdetail',
    component: MarketingDetail,
  },
  {
    path: 'activity/marketingmanage',
    component: MarketingActivityManage,
  },
  {
    path: 'activity/newmarketingmanage',
    component: NewMarketingManage,
  },
  {
    path: 'activity/memberactivityindex',
    component: MemberActivityIndex,
  },
  {
    path: 'activity/activitydetail/:merchantId/:campId/:allowKbOffline/:type/:campStatusFlag/:fromSource',
    component: ActivityDetail,
    childRoutes: [{
      path: 'base',
      component: ActivityDetailBase,
    },
    {
      path: 'operation',
      component: ActivityDetailOperation,
    }],
  },
  {
    path: 'activity/manage/thirdParty',
    component: ThirdPartyMarketingActivityManage,
  },
  {
    path: 'activity/manage/marketing/case',
    component: MarketingCase,
  },
  { // 资金池管理
    path: 'activity/manage/funds',
    component: FundsManage,
  },
  { // 企业福利活动
    path: 'activity/enterpriseperks/list',
    component: EnterprisePerksIndex,
  },
  { // 新增企业福利活动
    path: 'activity/enterpriseperks/add',
    component: AddEnterprisePerks,
  },
  {
    path: 'activity/settlement/setting',
    component: ActivitiesBill,
  },
  {
    path: 'marketing-activity/goods/detail/:id/:merchantPid',
    component: IframeWrap,
  }
];
