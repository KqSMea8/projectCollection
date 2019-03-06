import React, {PropTypes} from 'react';
import GoodsCodeModal from './GoodsCodeModal';

const GoodsCodeLabel = React.createClass({
  propTypes: {
    goodsCodeList: PropTypes.array,
  },

  getInitialState() {
    return {
      showGoodsCodeModal: false,
    };
  },

  onCancel() {
    this.setState({showGoodsCodeModal: false});
  },

  onClick(e) {
    e.preventDefault();
    this.setState({showGoodsCodeModal: true});
  },

  render() {
    return (<div style={{display: 'inline-block'}}>
      <a onClick = {this.onClick}>{this.props.goodsCodeList.length}个编码</a>
      {this.state.showGoodsCodeModal ? <GoodsCodeModal goodsCodeList={this.props.goodsCodeList} onCancel={this.onCancel}/> : null}
    </div>);
  },
});

export default GoodsCodeLabel;
