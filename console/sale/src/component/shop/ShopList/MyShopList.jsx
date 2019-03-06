import React, {PropTypes} from 'react';
import MyShopListForm from './MyShopListForm';
import MyShopListTable from './MyShopListTable';

const MyShopList = React.createClass({
  propTypes: {
    setParams: PropTypes.func,
    initBrand: PropTypes.object,
  },
  getInitialState() {
    return {};
  },

  onSearch(params) {
    this.props.setParams(params);
    this.setState({ params });
  },

  render() {
    return (
      <div>
        <MyShopListForm onSearch={this.onSearch} initBrand={this.props.initBrand}/>
        <MyShopListTable params={this.state.params}/>
      </div>
    );
  },
});

export default MyShopList;
