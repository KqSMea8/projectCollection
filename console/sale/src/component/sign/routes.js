import SignConfirm from './PurePay/SignConfirm';
import RenewContract from './RenewContract/index';

export default [
  {
    path: 'sign/purepay',
    component: SignConfirm,
  }, {
    path: 'sign/renew-contract',
    component: RenewContract,
  },
];
