import React from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import ShopAuthListForm from './ShopAuthListForm';
import ShopAuthListTable from './ShopAuthListTable';

const ShopAuthList = React.createClass({
  getInitialState() {
    return {};
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  render() {
    if (permission('SHOP_AUTH_LIST')) {
      return (<div>
        <div className="app-detail-header">授权记录</div>
        <div className="kb-list-main">
          <ShopAuthListForm onSearch={this.onSearch}/>
          <ShopAuthListTable params={this.state.params}/>
        </div>
      </div>);
    }
    return <ErrorPage type="permission"/>;
  },
});

export default ShopAuthList;
