import React from 'react';
import GatheringshopForm from './GatheringshopForm';
import GatheringshopTable from './GatheringshopTable';
import ajax from 'Utility/ajax';

const GatheringShop = React.createClass({
  getInitialState() {
    return {
      userType: '',
    };
  },

  componentDidMount() {
    this.fetch();
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  fetch() {
    ajax({
      url: '/manage/queryLoginRole.json',
      method: 'get',
      success: (result) => {
        this.setState({
          userType: result.userChannel,
        });
      },
    });
  },

  render() {
    const {userType} = this.state;
    return (<div>
      <div className="app-detail-header">支付宝收款商户</div>
      <div className="app-detail-content-padding">
        <GatheringshopForm onSearch={this.onSearch} userType={userType}/>
        <GatheringshopTable params={this.state.params}/>
      </div>
    </div>);
  },
});

export default GatheringShop;
