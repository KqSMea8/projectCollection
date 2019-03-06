import React, {PropTypes} from 'react';
import {remoteLog} from '../../../common/utils';

const ShopList = React.createClass({
  propTypes: {
    id: PropTypes.any,
  },
  getInitialState() {
    return {
      bankCardNo: '',
      receiveUserId: '',
    };
  },
  onAgainShop() {
    remoteLog('SHOP_BACKLOG_EDIT');
    window.open('#/shop/create/' + this.props.id + '/again');
  },
  render() {
    return (<a onClick={this.onAgainShop} >重新开店</a>);
  },
});

export default ShopList;
