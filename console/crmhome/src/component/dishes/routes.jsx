import dishMarketing from './marketing';
import qrOrder from './qrOrder';

export default [{
  path: 'qrOrder',
  component: qrOrder,
}, {
  path: 'qrOrder/:id(/:url)',
  component: qrOrder,
}, {
  path: 'dishMarketing',
  component: dishMarketing,
}, {
  path: 'dishMarketing/:id(/:url)',
  component: dishMarketing,
}];
