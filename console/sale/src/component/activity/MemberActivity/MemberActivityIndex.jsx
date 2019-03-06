import React from 'react';
import CRMTpl from '../../../common/CRMTpl';

const MarketingActivityManage = React.createClass({

  render() {
    const params = {
      title: '会员营销',
      url: window.APP.crmhomeUrl + '/main.htm.kb',
      hash: '#/framePage',
    };
    return (
      <CRMTpl params={params}/>
    );
  },
});

export default MarketingActivityManage;
