import React, {PropTypes} from 'react';
import ShopListTable from './ShopListTable';

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
        <ShopListTable mallId={this.props.mallId} rangeType={this.props.rangeType} params={this.state.params}/>
      </div>
    );
  },
});

export default SeachRoundOne;
