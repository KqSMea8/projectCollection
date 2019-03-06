import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';

/**
     * 用户搜索
     *
     * @param modelMap
     * @param request
     * @param keywords       关键字（必选）
     * @param type           用户类型（user，group，all）（必选）
     * @param userChannelKey 用户渠道（inner_user_channels，outter_user_channels），如果为空则搜索所有渠道（可选）
     * @param searchScope    搜索类型（可选）
     *                       global:全局搜索，忽略scopeTarget，若userChannelKey不为空，则只搜索该渠道下的用户，否则搜索所有渠道
     *                       job_scope：搜索指定岗位下的用户
     *                       provider_scope:搜索服务商下的用户
     * @param scopeTarget    当searchScope=job_scope时，为岗位路径，多岗位用逗号分隔（可选）
     *                       当searchScope=provider_scope时，为服务商id（可选）
     */
class UserSelect extends React.Component {
  static propTypes = {
    searchScope: PropTypes.string,
  };
  render() {
    let searchScope = this.props.searchScope || (window.APP.jobPath ? 'job_scope' : 'global');
    const props = Object.assign({
      ajax,
      channel: window.APP.userType === 'BUC' ? 'inner_user_channels' : 'outter_user_channels',
      buserviceUrl: window.APP.buserviceUrl,
      style: {width: '100%'},
      searchScope,
      scopeTarget: window.APP.jobPath,
    }, this.props);
    // Bugfix：channel为outter_user_channels时，searchScope传global搜索结果为空
    if (window.APP.userType !== 'BUC') {
      searchScope = 'job_scope';
      props.searchScope = searchScope;
    }
    return (<BuserviceUserSelect {...props}/>);
  }
}

export default UserSelect;
