import React from 'react';
import fetch from '@alipay/kb-fetch';
import { UserSelect } from '@alipay/kb-biz-components';

// 默认展示自己的选人组件
export default class DefaultSelfUserSelect extends React.Component {
  static propTypes = {
    loadSelf: React.PropTypes.bool,
  };

  static defaultProps = {
    loadSelf: true,
  };

  componentDidMount() {
    if (this.props.loadSelf) {
      fetch({
        url: 'kbsales.operatorService.queryLoginUserRoleV2',
      }).then(res => {
        if (this.props.onChange) {
          this.props.onChange({
            id: res.data.id,
            realName: res.data.realName,
            nickName: res.data.nickName,
            displayName: this.formatUser(res.data),
            isSelf: true,
          });
        }
      });
    }
  }

  formatUser(user) {
    return user.nickName ? `${user.realName}(${user.nickName})` : user.realName;
  }

  render() {
    return (
      <UserSelect
        allowClear
        placeholder="请输入内部小二姓名或花名"
        labelFormatter={this.formatUser.bind(this)}
        {...this.props}
      />
    );
  }
}
