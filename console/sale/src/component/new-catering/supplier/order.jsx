import React from 'react';
import CRMTpl from 'Common/CRMTpl';

class SupplierOrder extends React.Component {

  render() {
    const params = {
      title: '供货订单',
      url: window.APP.crmhomeUrl + '/merchant/supplierOrder.htm.kb',
      pidSelectOptions: {
        roleType: 'SUPPLIER',
      },
    };
    return (
      <CRMTpl params={params}/>
    );
  }
}
export default SupplierOrder;
