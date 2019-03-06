import MallList from './MallList/MallList';
import AddShop from './AddShop/AddShop';
import NewMall from './NewMall/NewMall';
import MallDetail from './MallDetail/MallDetail';
import MallDetailBase from './MallDetail/MallDetailBase';
import MallDetailOrder from './MallDetail/MallDetailOrder';
import MallDetailHistory from './MallDetail/MallDetailHistory';

export default [
  {
    path: 'mall',
    component: '',
    childRoutes: [ {
      path: 'list/:mallId',
      component: MallList,
    },
  ],
  },
  {
    path: 'mall/detail/:shopId',
    component: MallDetail,
    childRoutes: [{
      path: 'base',
      component: MallDetailBase,
    }, {
      path: 'order',
      component: MallDetailOrder,
    }, {
      path: 'history',
      component: MallDetailHistory,
    },
  ],
  },
  {
    path: 'mall/add-shop/:mallId',
    component: AddShop,
  },
  {
    path: 'mall/create',
    component: NewMall,
  },
  {
    path: 'mall/edit/:shopId',
    component: NewMall,
  },
  {
    path: 'mall/create/:orderId',
    component: NewMall,
  },
];
