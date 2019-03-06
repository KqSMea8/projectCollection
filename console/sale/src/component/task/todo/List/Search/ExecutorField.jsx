import React from 'react';
import PropTypes from 'prop-types';
import {UserByRoleSelect} from '@alipay/kb-framework-components/lib/biz';
import {Checkbox} from 'antd';
import noop from 'lodash/noop';

import { getLoginRole } from '../../../../../common/api';

const UserRole = UserByRoleSelect.UserRole;

const ValueProps = {
  user: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
  }),
  onlySelf: PropTypes.bool,
};

class ExecutorField extends React.Component {
  static propTypes = {
    value: PropTypes.shape(ValueProps),
    defaultValue: PropTypes.shape(ValueProps),
    onChange: PropTypes.func,
  };
  static defaultProps = {
    defaultValue: {
      user: {},
      onlySelf: true,
    },
    onChange: noop
  };
  constructor() {
    super();
    getLoginRole()
      .then(resp => {
        this.setState({
          userRole: resp.data.loginType,
          loading: false,
        });
      });
  }
  state = {
    userRole: window.APP.userType === 'BUC' ? UserRole.BD : 'PROVIDER',
    loading: true,
  };
  handleOnlySelfChange = (e) => {
    this.props.onChange({
      ...this.props.value,
      onlySelf: !e.target.checked
    });
  };
  handleUserChange = (user) => {
    this.props.onChange({
      ...this.props.value,
      user,
    });
  };
  render() {
    const value = this.props.value || this.props.defaultValue;
    const { user, onlySelf = true } = value;
    const { userRole, loading } = this.state;
    let enabledRoles;
    let defaultRole;
    switch (userRole) {
    case UserRole.KA_BD:
      defaultRole = UserRole.KA_BD;
      enabledRoles = [UserRole.KA_BD];
      break;
    default:
    case UserRole.BD:
      defaultRole = UserRole.BD;
      enabledRoles = [UserRole.BD, UserRole.PROVIDER, UserRole.P_STAFF];
      break;
    case UserRole.PROVIDER:
      defaultRole = UserRole.PROVIDER;
      enabledRoles = [UserRole.PROVIDER, UserRole.P_STAFF];
      break;
    case UserRole.P_STAFF:
      defaultRole = UserRole.P_STAFF;
      enabledRoles = [UserRole.PROVIDER, UserRole.P_STAFF];
      break;
    }
    return (
      <div style={{display: 'flex', justifyContent: 'start', alignContent: 'center'}}>
        {loading && <span>正在加载用户角色</span>}
        {loading || <UserByRoleSelect value={user} onChange={this.handleUserChange} style={{minWidth: 312}} defaultRole={defaultRole} enabledRoles={enabledRoles}/>}
        <Checkbox onChange={this.handleOnlySelfChange} checked={!onlySelf} style={{marginLeft: 8}}>含其下属</Checkbox>
      </div>
    );
  }
}

export default ExecutorField;
