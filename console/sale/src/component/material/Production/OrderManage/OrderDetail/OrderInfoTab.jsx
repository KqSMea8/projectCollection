import React, { Component } from 'react';
import { BlockTitle } from 'Library/PageLayout';
import PurchaseInfo from '../common/PurchaseInfo';
import TemplateInfo from '../common/TemplateInfo';
import SupplierInfo from '../common/SupplierInfo';

import './style.less';

export default class OrderInfoTab extends Component {
  constructor() {
    super();
  }
  render() {
    const { data } = this.props;
    return (
      data && <div className="order-info">
        <BlockTitle title="采购单基本信息"/>
        <PurchaseInfo data={data}/>
        <TemplateInfo data={data}/>
        <BlockTitle title="采购供应商信息"/>
        <SupplierInfo data={data}/>
      </div>
    );
  }
}

