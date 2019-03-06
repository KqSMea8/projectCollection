import ExclusiveSale from './ExclusiveSale/ExclusiveSale';
import OperationLog from './OperationLog/OperationLog';
import CorporatePolicy from './CorporatePolicy';

export default [
  {
    path: 'exclusivesale',
    component: ExclusiveSale,
  }, {
    path: 'contractoperationlog',
    component: OperationLog,
  }, {
    path: 'corporate-policy/:id',
    component: CorporatePolicy,
  },
];
