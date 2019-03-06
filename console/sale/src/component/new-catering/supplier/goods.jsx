import React from 'react';
import CRMTpl from 'Common/CRMTpl';

class SupplierGoods extends React.Component {
  render() {
    const params = {
      title: '货品档案',
      url: window.APP.crmhomeUrl + '/merchant/supplierGoods.htm.kb',
      pidSelectOptions: {
        roleType: 'SUPPLIER',
      },
    };
    return (
      <CRMTpl params={params}/>
    );
  }
}
export default SupplierGoods;
