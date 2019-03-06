import React from 'react';
import CRMTpl from 'Common/CRMTpl';

class SupplierInventory extends React.Component {

  render() {
    const params = {
      title: '库存管理',
      url: window.APP.crmhomeUrl + '/merchant/supplierInventory.htm.kb',
      pidSelectOptions: {
        roleType: 'SUPPLIER',
      },
    };
    return (
      <CRMTpl params={params}/>
    );
  }
}
export default SupplierInventory;
