import React from 'react';
import CRMTpl from 'Common/CRMTpl';

class MerchantOrder extends React.Component {

  render() {
    const params = {
      title: '采购订单',
      url: window.APP.crmhomeUrl + '/merchant/merchantOrder.htm.kb',
      pidSelectOptions: {
        roleType: 'PARTNER',
      },
    };
    return (
      <CRMTpl params={params}/>
    );
  }
}
export default MerchantOrder;
