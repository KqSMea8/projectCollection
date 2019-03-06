import React from 'react';
import CRMTpl from '../../../common/CRMTpl';

const ActivityManage = React.createClass({

  render() {
    const params = {
      title: '活动管理',
      url: window.APP.crmhomeUrl + '/goods/itempromo/recruitOrderQueryInit.htm.kb',
    };
    return (
      <CRMTpl params={params}/>
    );
  },
});

export default ActivityManage;
