import OperatorDialog from './OperatorDialog';
import RoleUnAuthDialog from './RoleUnAuthDialog';
import RoleDialog from './RoleDialog';
import DealResult from './DealResult';
import OperatorUnAuthDialog from './OperatorUnAuthDialog';
// 几个安全服务化页面都得重新做路由
// modals里的内容最终通过entry中的emeberdialog生效。

export default [{
  path: '/',
  component: DealResult,
}, {
  path: 'operatorDialog/:operatorId(/:roleCode)',
  component: OperatorDialog,
}, {
  path: 'operatorUnAuthDialog/:operatorId/:deleteItems/:featureDelete',
  component: OperatorUnAuthDialog,
}, {
  path: 'roleDialog/:roleId(/:roleCode)',
  component: RoleDialog,
}, {
  path: 'RoleUnAuthDialog/:roleId/:deleteItems/:featureDelete',
  component: RoleUnAuthDialog,
}];
