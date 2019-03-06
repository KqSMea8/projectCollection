import RolePermissionView from './rolePermissionView';
import OperatorPermissionView from './operatorPermissionView';
import ProdAuthOperatorListView from './prodAuthOperatorListView';

export default [{
  path: 'rolePermissionView/:roleId/:roleName/:roleCode(/:desc)',
  component: RolePermissionView,
}, {
  path: 'operatorPermissionView/:operatorId',
  component: OperatorPermissionView,
}, {
  path: 'prodAuthOperatorListView/:roleId(/:roleCode)',
  component: ProdAuthOperatorListView,
}];
