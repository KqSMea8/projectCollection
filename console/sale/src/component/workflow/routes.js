import ApprovalFlow from './ApprovalFlow/ApprovalFlow';
import ShopCreateOrModify from './ApprovalFlow/ShopCreateOrModify';
import ShopAllocOrAuth from './ApprovalFlow/ShopAllocOrAuth';
import FlowDetailComplex from './ApprovalFlow/FlowDetailComplex';
import SurroundDetail from './ApprovalFlow/SurroundDetail';

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
  }, {
    path: 'approval-flow/complex/:id/:action',
    component: FlowDetailComplex,
  },
  {
    path: 'approval-flow/surroundDetail/:id/:action',
    component: SurroundDetail,
  },
];
