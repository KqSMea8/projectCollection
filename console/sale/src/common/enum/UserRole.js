const UserRole = {
  BD: 'BD',
  PROVIDER: 'PROVIDER',
  P_STAFF: 'P_STAFF',
  KA_BD: 'KA_BD'
};
const UserRoleText = {
  [UserRole.BD]: 'BD',
  [UserRole.PROVIDER]: '服务商',
  [UserRole.P_STAFF]: '服务商员工',
  [UserRole.KA_BD]: 'KA BD'
};

export default {
  UserRole, UserRoleText
};
