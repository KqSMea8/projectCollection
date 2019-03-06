import React from 'react';
import fetch from '@alipay/kobe-fetch';
import { getSystemUrl } from '@alipay/kb-systems-config';
import { UserSelect } from '@alipay/kb-biz-components';

export default class InnerUserSelect extends React.Component {
  static propTypes = {
    loadSelf: React.PropTypes.bool,
  };

  static defaultProps = {
    loadSelf: true,
  };

  componentDidMount() {
    if (this.props.loadSelf) {
      fetch.ajax({
        url: `${getSystemUrl('buserviceUrl')}/pub/getLoginUser.json`,
        data: {
          userDefineSourceUrl: window.location.href,
        },
        type: 'jsonp',
      }).then(res => {
        if (this.props.onChange) {
          const nameShow = res.data.nickName ? `${res.data.realName}(${res.data.nickName})` : res.data.realName;
          this.props.onChange({
            id: res.data.operatorName,
            chosenName: `${res.data.realName}(${res.data.operatorName})`,
            realName: res.data.realName,
            nickName: res.data.nickName,
            displayName: `${nameShow}${res.data.operatorName}`,
          });
        }
      });
    }
  }

  render() {
    return (
      <UserSelect.BuserviceUserSelect allowClear
        placeholder="请输入姓名或花名"
        buserviceUrl={getSystemUrl('buserviceUrl')}
        {...this.props} />
    );
  }
}
