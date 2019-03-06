import React from 'react';
import NewMarketingManageForm from './NewMarketingManageForm';
import NewMarketingManageTable from './NewMarketingManageTable';
import { getQueryFromURL } from 'Common/utils';

const NewMarketingManage = React.createClass({
  getInitialState() {
    const {campId, merchantId} = getQueryFromURL(location.href.split('?')[1]);
    return {
      params: {
        campId,
        merchantId
      }
    };
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  render() {
    const { params } = this.state;
    return (
      <div>
        <div className="app-detail-header">营销活动
        </div>
        <div>
          <NewMarketingManageForm initial={params} onSearch={this.onSearch}/>
          <NewMarketingManageTable params={params}/>
        </div>
      </div>
    );
  },
});

export default NewMarketingManage;
