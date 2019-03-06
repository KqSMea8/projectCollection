import React from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import StayOpenShopListForm from './StayOpenShopListForm';
import StayOpenShopListTable from './StayOpenShopListTable';

const StayOpenShopList = React.createClass({
  getInitialState() {
    return {};
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },
  render() {
    if (permission('SHOP_TO_BE_OPENED_SHOP_TEAM_LIST')) {
      return (<div>
        <div className="kb-list-main" style={{position: 'relative'}}>
          <StayOpenShopListForm onSearch={this.onSearch}/>
          <StayOpenShopListTable params={this.state.params}/>
        </div>
      </div>);
    }
    return <ErrorPage type="permission"/>;
  },
});

export default StayOpenShopList;
