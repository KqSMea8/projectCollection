import React from 'react';
import ajax from 'Utility/ajax';
import GoodsListTable from './GoodsListTable';
import GoodsListForm from './GoodsListForm';
import {appendOwnerUrlIfDev} from '../../../common/utils';

const GoodsList = React.createClass({

  getInitialState() {
    return {
      isServiceStage: false,
      isOperatingStage: false,
      isSaleStage: false,
    };
  },

  componentWillMount() {
    this.getDomainId();
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },

  // 获取当前所登录的工作台,
  getDomainId() {
    ajax({
      url: appendOwnerUrlIfDev('/queryDomainId.json'),
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed' && result.domainId === 'KOUBEI_SERVICES') {
          this.setState({
            isServiceStage: true,
          });
        } else if (result.status === 'succeed' && result.domainId === 'KOUBEI_OPERATING') {
          this.setState({
            isOperatingStage: true,
          });
        } else if (result.status === 'succeed' && result.domainId === 'KOUBEI_SALESCRM') {
          this.setState({
            isSaleStage: true,
          });
        }
      },
    });
  },

  render() {
    const {isServiceStage, isOperatingStage, isSaleStage} = this.state;
    return (
      <div>
        <div className="app-detail-header">
        查询优惠券/商品
        </div>
        <div className="app-detail-content-padding">
          <GoodsListForm isServiceStage={isServiceStage} isOperatingStage={isOperatingStage} onSearch={this.onSearch}/>
          <GoodsListTable isSaleStage={isSaleStage} params={this.state.params}/>
        </div>
      </div>
    );
  },
});

export default GoodsList;
