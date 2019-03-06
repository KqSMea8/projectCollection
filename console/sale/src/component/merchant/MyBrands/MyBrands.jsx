import React from 'react';
import MyBrandsForm from './MyBrandsForm';
import MyBrandsTable from './MyBrandsTable';

const MyBrands = React.createClass({
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
          我的品牌
        </div>
        <div className="app-detail-content-padding">
          <MyBrandsForm onSearch={this.onSearch}/>
          <MyBrandsTable params={this.state.params}/>
        </div>
      </div>
    );
  },
});

export default MyBrands;
