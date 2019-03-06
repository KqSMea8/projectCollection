import React from 'react';
import PurchaseStorageForm from './PurchaseStorageForm';
import PurchaseStorageTable from './PurchaseStorageTable';

const PurchaseStorage = React.createClass({
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
      <div className="app-detail-content-padding">
        <PurchaseStorageForm onSearch={this.onSearch}/>
        <PurchaseStorageTable params={this.state.params}/>
      </div>
    );
  },
});
export default PurchaseStorage;
