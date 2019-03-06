import Merchant from './index';

export default [
  {
    path: '/tka/merchant',
    onEnter: (state, replace) => {
      replace(null, '/tka/merchant/list');
    }
  },
  {
    path: '/tka/merchant/list',
    component: Merchant.List
  },
  {
    path: '/tka/merchant/detail/:pid', // 商户管理 > 商户详情
    component: Merchant.Detail
  },
  {
    path: '/tka/merchant/summary-manage', // 待审批（已审批）的数据小结 主管可见
    component: Merchant.Summary.Manage
  },
  {
    path: '/tka/merchant/summary-upload/:id', // 数据小节上传 非主管
    component: Merchant.Summary.Upload
  },
];
