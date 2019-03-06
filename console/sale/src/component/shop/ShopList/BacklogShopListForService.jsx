import React from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import BacklogShopList from './BacklogShopList';

const BacklogShopListForService = React.createClass({
  render() {
    if (permission('SHOP_TO_BE_OPENED_SHOP_LIST_4_CUSTOMER_SERVICE')) {
      return (<div>
        <div className="app-detail-header">门店查询</div>
        <div className="kb-list-main">
          <BacklogShopList isService/>
        </div>
      </div>);
    }
    return <ErrorPage type="permission"/>;
  },
});

export default BacklogShopListForService;
