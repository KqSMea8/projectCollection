import React, {PropTypes} from 'react';
import {Button} from 'antd';
import ActionMixin from '../common/ActionMixin';


const OnlineAction = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  mixins: [ActionMixin],
  onClick() {
    const {itemId, opMerchantId} = this.props.params;
    this.makeGoodsOnline({itemId: itemId, op_merchant_id: opMerchantId});
  },
  render() {
    return (<Button type="ghost" style={{marginLeft: 10}} onClick={this.onClick}>正式上架</Button>);
  },
});

export default OnlineAction;
