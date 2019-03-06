import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';
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

  componentWillMount() {
    this.queryLoginRole();
  },

  onSearch(params) {
    this.setState({ params });
  },

  queryLoginRole() {
    // 查询访客角色
    ajax({
      url: appendOwnerUrlIfDev('/sale/visitrecord/queryLoginRole.json'),
      success: (result) => {
        if (result.status === 'succeed') {
          const items = result.data;
          for (let i = 0; i < items.length; i++) {
            if (items[i] === 'bd') {
              this.setState({
                isBd: true,
              });
            } else if (items[i] === 'kaBd') {
              this.setState({
                isKaBd: true,
              });
            }
          }
        }
      },
      error: () => {},
    });
  },

  render() {
    if (permission('SHOP_TEAM_SHOP_LIST')) {
      return (<div>
        <div className="kb-list-main" style={{position: 'relative'}}>
          <TeamShopListForm onSearch={this.onSearch} initBrand={this.props.initBrand}/>
          <TeamShopListTable params={this.state.params} isBd={this.state.isBd} />
        </div>
      </div>);
    }
    return <ErrorPage type="permission"/>;
  },
});

export default TeamShopList;
