import BrandsIndex from './brands/index/Index';
import BrandsMainIndex from './brands/index/BrandIndex';
import BrandsThirdParty from './brands/index/thirdParty';
import BrandsGroupsAdd from './brands/groups/add';
import BrandsGroupsView from './brands/groups/view';
import BrandsActivityCreate from './brands/activity/ActivityCreate';
import BrandsActivityCopy from './brands/activity/ActivityCopy';
import BrandsActivityEdit from './brands/activity/ActivityEdit';
import BrandsActivitySuccess from './brands/activity/ActivitySuccess';
import BrandsActivityTestSuccess from './brands/activity/ActivityTestSuccess';
import BrandsActivityManage from './brands/manage/ManageList';
import BrandsActivityView from './brands/view/ActivityView';
import ActivityRedirect from './brands/activityRedirect';
import ValidationSKU from './ValidationSKU/Index';

// import GiftIndex from './brands/gift/GiftIndex';
// import BargainIndex from './brands/bargain/Index';

import RetailersIndex from './retailers/index/Index';
import RetailersActivityDetail from './retailers/detail/DetailIndex';
import ModifyIndex from './retailers/detail/ModifyIndex';
import RetailersGroupsAdd from './retailers/groups/add';
import RetailersGroupsAddCate7 from './retailers/groups/AddCate7';
import RetailersGroupsView from './retailers/groups/view';
import RetailersGroupsViewCate7 from './retailers/groups/ViewCate7';
import RetailersActivityCreate from './retailers/activity/ActivityCreate';
import RetailersActivityEdit from './retailers/activity/ActivityEdit';
import RetailersActivitySuccess from './retailers/activity/ActivitySuccess';
import RetailersActivityManage from './retailers/manage/ManageList';
import RetailersActivityView from './retailers/view/ActivityView';
import RetailersToBrandsActivityView from './retailers/view/BrandActivityView';
import AllActivityView from './retailers/view/AllActivityView';
import ExternalActivityView from './retailers/view/ExternalActivityView';
import VoucherCancel from './vouchers/cancel';
import VouchersCheckTable from './vouchers/VouchersCheckTable';
import HuaBei from './huabei/';
import RetailerWelfareDetail from './retailers/view/RetailerWelfareDetail';
import ServerWelfareDetail from './retailers/view/ServerWelfareDetail';
import AllActivityViewForChange from './retailers/view/AllActivityViewForChange';


export default [{
  path: 'marketing/brands',
  component: BrandsIndex,
}, {
  path: 'marketing/third-party',
  component: BrandsThirdParty,
}, {
  path: 'marketing/brands-index',
  component: BrandsMainIndex,
}, {
  path: 'marketing/brands/groups-add',
  component: BrandsGroupsAdd,
}, {
  path: 'marketing/brands/groups-view/:id',
  component: BrandsGroupsView,
}, {
  path: 'marketing/brands/activity-create(/:mode)',
  component: BrandsActivityCreate,
}, {
  path: 'marketing/brands/activity-copy/:id',
  component: BrandsActivityCopy,
}, {
  path: 'marketing/brands/activity-edit/:id',
  component: BrandsActivityEdit,
}, {
  path: 'marketing/brands/activity-success/:id',
  component: BrandsActivitySuccess,
}, {
  path: 'marketing/brands/test-success',
  component: BrandsActivityTestSuccess,
}, {
  path: 'marketing/brands/manage',
  component: BrandsActivityManage,
}, {
  path: 'marketing/brands/detail/:smartPromoId(/:btn)',
  component: RetailersActivityDetail,
}, {
  path: 'marketing/brands/detailmodify/:smartPromoId(/:btn)',
  component: ModifyIndex,
}, {
  path: 'marketing/brands/activity-view/:activityId',
  component: BrandsActivityView,
}, {
  path: 'marketing/brands/gift/:mode(/:id)',
  component: ActivityRedirect,
}, {
  path: 'marketing/brands/bargain/:mode(/:id)',
  component: ActivityRedirect,
}, {
  path: 'marketing/retailers/all-activity-view/:campId',
  component: AllActivityView,
}, {
  path: 'marketing/retailers',
  component: RetailersIndex,
}, {
  path: 'marketing/retailers/groups-add',
  component: RetailersGroupsAdd,
}, {
  path: 'marketing/retailers/top7/groups-add',
  component: RetailersGroupsAddCate7,
}, {
  path: 'marketing/retailers/groups-view/:id',
  component: RetailersGroupsView,
}, {
  path: 'marketing/retailers/top7/groups-view/:id',
  component: RetailersGroupsViewCate7,
}, {
  path: 'marketing/retailers/activity-create',
  component: RetailersActivityCreate,
}, {
  path: 'marketing/retailers/activity-edit/:id',
  component: RetailersActivityEdit,
}, {
  path: 'marketing/retailers/activity-success/:id',
  component: RetailersActivitySuccess,
}, {
  path: 'marketing/retailers/activity-view/:campId',
  component: RetailersActivityView,
}, {
  path: 'marketing/retailers/brands-activity-view/:orderId(/:cancel)',
  component: RetailersToBrandsActivityView,
}, {
  path: 'marketing/retailers/manage/:type',
  component: RetailersActivityManage,
}, {
  path: 'marketing/retailers/manage/:type/:name',
  component: RetailersActivityManage,
}, {
  path: 'marketing/retailers/external-activity-view/:planId',
  component: ExternalActivityView,
}, {
  path: 'marketing/retailers/external-activity-view-camp/:campId(/:merchantId)',
  component: ExternalActivityView,
}, {
  // 验券
  path: 'marketing/vouchers/cancel',
  component: VoucherCancel,
}, {
  // 验券记录
  path: '/marketing/vouchers/checkrecord',
  component: VouchersCheckTable,
}, {
  path: 'marketing/huabei',
  component: HuaBei,
}, {
  path: 'marketing/retailers/welfare/:orderId',
  component: RetailerWelfareDetail,
}, {
  path: 'marketing/servers/welfare/:campId',
  component: ServerWelfareDetail,
}, {
  path: 'marketing/retailers/all-activity-view-change/:campId',
  component: AllActivityViewForChange,
}, {
  path: 'ValidationSKU',
  component: ValidationSKU,
}];
