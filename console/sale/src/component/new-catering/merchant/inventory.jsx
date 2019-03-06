import React from 'react';
import CRMTpl from 'Common/CRMTpl';

class MerchantInventory extends React.Component {

  render() {
    const params = {
      title: '库存管理',
      url: window.APP.crmhomeUrl + '/merchant/merchantInventory.htm.kb',
      pidSelectOptions: {
        roleType: 'PARTNER',
      },
    };
    return (
      <CRMTpl params={params}/>
    );
  }
}
export default MerchantInventory;
