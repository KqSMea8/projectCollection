import React from 'react';
import BrandListTable from './BrandListTable';
import BrandListForm from './BrandListForm';

const BrandList = React.createClass({

  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  render() {
    return (
      <div>
        <div className="app-detail-header">
          查询活动
        </div>
        <div className="app-detail-content-padding">
          <BrandListForm onSearch={this.onSearch}/>
          <BrandListTable params={this.state.params}/>
        </div>
      </div>
    );
  },
});

export default BrandList;
