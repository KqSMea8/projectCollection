import React, {PropTypes} from 'react';
import ShopListDialog from './ShopListDialog';

const ShopListLabel = React.createClass({
  propTypes: {
    shopList: PropTypes.array,
    shopLen: PropTypes.number,
  },

  getInitialState() {
    return {
      showShopListDialog: false,
    };
  },

  onCancel() {
    this.setState({showShopListDialog: false});
  },

  onClick(e) {
    e.preventDefault();
    this.setState({showShopListDialog: true});
  },

  render() {
    const {shopLen} = this.props;
    return (<div style={{display: 'inline-block'}}>
      <a onClick = {this.onClick}>{shopLen}个门店</a>
      {this.state.showShopListDialog ? <ShopListDialog shopList={this.props.shopList} onCancel={this.onCancel}/> : null}
    </div>);
  },
});

export default ShopListLabel;
