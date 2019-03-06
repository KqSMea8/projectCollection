import React from 'react';
import AutoFrame from '../../../index/AutoFrame';

const thirdParty = React.createClass({
  render() {
    return (<div>
      <AutoFrame target={'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2016081801768158&scope=auth_base&redirect_uri=https://koubei.sweetmartmarketing.com/KBBrandMarketing/oauth/sysOauth.do'} />
    </div>);
  },
});

export default thirdParty;
