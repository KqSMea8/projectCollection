import React from 'react';
import GoodsListTable from './GoodsListTable';
import GoodsListForm from './GoodsListForm';
import permission from '@alipay/kb-framework/framework/permission';
import NoPermission from 'Library/ErrorPage/NoPermission';

export default class GoodsListV2 extends React.Component {
  state = {
    isSaleStage: true,
    isV2: true,
  }

  onSearch = (params) => {
    this.setState({
      params,
    });
  }

  render() {
    if (!permission('ONLINE_TRADE_PAY_ITEM_QUERY')) {
      return <NoPermission />;
    }
    return (
      <div>
        <div className="app-detail-header">
        查询商品
        </div>
        <div className="app-detail-content-padding">
          <GoodsListForm isV2={this.state.isV2} isServiceStage={false} isOperatingStage={false} onSearch={this.onSearch} />
          <GoodsListTable isV2={this.state.isV2} isSaleStage={this.state.isSaleStage} params={this.state.params} />
        </div>
      </div>
    );
  }
}
