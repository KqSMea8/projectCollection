import React from 'react';
import CRMTpl from '../../../common/CRMTpl';

const MarketingActivityManage = React.createClass({

  render() {
    const params = {
      title: '查询营销活动',
      url: window.APP.crmhomeUrl + '/goods/itempromo/activityList.htm.kb',
    };
    return (
      <CRMTpl params={params}/>
    );
  },
});

export default MarketingActivityManage;
