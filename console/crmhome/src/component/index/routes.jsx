import FramePage from './FramePage';
import Index from './Index';
import PayeeIndex from './PayeeIndex';
import MallIndex from './Mall/Index';
import MiddleFrame from './MiddleFrame';
import FrameInfo from './FrameInfo';
import FrameConfirm from './FrameConfirm';
import AuthorizeConfirm from './Mall/dataConfirm';
import './index.less';

export default [{
  path: '/',
  component: Index,
}, {
  path: '/payeeIndex',
  component: PayeeIndex,
}, {
  path: '/mall',
  component: MallIndex,
}, {
  path: '/framePage',
  component: MiddleFrame,
}, {
  path: '/promote/cent(/:category)',
  component: FrameInfo,
}, {
  path: '/promote/cent/confirm/:applicationId',
  component: FrameConfirm,
}, {
  path: '/framePage/:commodityId',
  component: FramePage,
}, {
  path: '/framePage/:commodityId/:redirectUrl',
  component: FramePage,
}, {
  path: '/authorizeConfirm/:id/:shopId/:type',
  component: AuthorizeConfirm,
}];
