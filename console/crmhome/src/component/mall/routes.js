import MallDetail from './MallDetail/MallDetail';
import MallDetailBase from './MallDetail/MallDetailBase';
import MallDetailHistory from './MallDetail/MallDetailHistory';
import MallList from './MallList/MallList';
import FlowDetail from './MallDetail/FlowDetail';
import AddShop from './AddShop/AddShop';
import ActivityDetail from './ActivityDetail.jsx';

export default [
  {
    path: 'mall/detail/:mallId',
    component: MallDetail,
    childRoutes: [{
      path: 'base',
      component: MallDetailBase,
    }, {
      path: 'history',
      component: MallDetailHistory,
    }],
  },
  {
    path: 'mall/list/:mallId',
    component: MallList,
    childRoutes: [{
      path: 'unconfirmed',
      component: MallList,
    }],
  },
  {
    path: 'mall/flow-detail/:orderId/:action',
    component: FlowDetail,
  },
  {
    path: 'mall/add-shop/:mallId',
    component: AddShop,
  },
  {
    path: 'mall/activity/:campId',
    component: ActivityDetail,
  },
];
