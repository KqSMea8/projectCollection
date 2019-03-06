import React, {PropTypes} from 'react';
import {Button} from 'antd';
import GoodsOfflineModal from './GoodsOfflineModal';
import ActionMixin from '../common/ActionMixin';


const OfflineAction = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  mixins: [ActionMixin],
  onClick() {
    this.setState({showOfflineModal: true});
  },

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <Button type="ghost" style={{marginLeft: 10}} onClick={this.onClick}>下架商品</Button>
        {this.state.showOfflineModal ? <GoodsOfflineModal onOk={this.onOK} onCancel={this.onCancel}/> : null}
      </div>
    );
  },
});

export default OfflineAction;
