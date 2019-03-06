import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import TeamShopListForm from './TeamShopListForm';
import TeamShopListTable from './TeamShopListTable';

const TeamShopList = React.createClass({
  propTypes: {
    initBrand: PropTypes.object,
  },
  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({ params });
  },
  render() {
    if (permission('SHOP_TEAM_POS_SALE_SHOP_LIST')) {
      return (<div>
        <div className="kb-list-main" style={{position: 'relative'}}>
          <TeamShopListForm onSearch={this.onSearch} initBrand={this.props.initBrand} isPosSale />
          <TeamShopListTable params={this.state.params} isPosSale />
        </div>
      </div>);
    }
    return <ErrorPage type="permission"/>;
  },
});

export default TeamShopList;
