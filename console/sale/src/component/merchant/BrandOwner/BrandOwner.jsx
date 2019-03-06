import React from 'react';
import BrandOwnerForm from './BrandOwnerForm';
import BrandOwnerTable from './BrandOwnerTable';

const BrandOwner = React.createClass({
  getInitialState() {
    return {};
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  render() {
    return (<div>
      <div className="app-detail-header">品牌商</div>
      <div className="app-detail-content-padding">
        <BrandOwnerForm onSearch={this.onSearch}/>
        <BrandOwnerTable params={this.state.params}/>
      </div>
    </div>);
  },
});

export default BrandOwner;
