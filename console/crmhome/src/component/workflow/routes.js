import ApprovalFlow from './ApprovalFlow/ApprovalFlow';
import ShopCreateOrModify from './ApprovalFlow/ShopCreateOrModify';
import ShopAllocOrAuth from './ApprovalFlow/ShopAllocOrAuth';

export default [
  {
    path: 'approval-flow/:orderId/:action',
    component: ApprovalFlow,
    childRoutes: [{
      path: 'shop-create',
      component: ShopCreateOrModify,
    }, {
      path: 'shop-alloc',
      component: ShopAllocOrAuth,
    }],
  },
];
