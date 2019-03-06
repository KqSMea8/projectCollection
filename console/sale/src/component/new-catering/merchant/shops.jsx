import React from 'react';
import CRMTpl from 'Common/CRMTpl';

class MerchantShops extends React.Component {

  render() {
    const params = {
      title: '新餐饮服务管理',
      url: window.APP.crmhomeUrl + '/p/kb-catering/index.htm',
      hash: '#/merchant/shops',
      pidSelectOptions: {
        roleType: 'PARTNER',
      },
    };
    return (
      <CRMTpl params={params}/>
    );
  }
}
export default MerchantShops;
