import React from 'react';
import CRMTpl from '../../../common/CRMTpl';

const MarketingActivityManage = React.createClass({

  render() {
    const params = {
      title: '营销方案管理',
      url: window.APP.crmhomeUrl + '/main.htm.kb',
      hash: '#/marketing/retailers/manage/makertingPlan/isKbservLogin',
    };
    return (
      <CRMTpl params={params}/>
    );
  },
});

export default MarketingActivityManage;
