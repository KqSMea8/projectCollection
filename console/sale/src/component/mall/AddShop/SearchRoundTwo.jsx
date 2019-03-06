import React, {PropTypes} from 'react';
import ShopListTable from './ShopListTable';
import ShopListForm from './AddShopForm';

const SeachRoundOne = React.createClass({
  propTypes: {
    mallId: PropTypes.any,
    rangeType: PropTypes.any,
  },
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
      <div style={{margin: '16px 0'}}>
        <ShopListForm onSearch={this.onSearch} />
        <ShopListTable defaultData ="roundTwo" mallId={this.props.mallId} rangeType={this.props.rangeType} params={this.state.params}/>
      </div>
    );
  },
});

export default SeachRoundOne;
