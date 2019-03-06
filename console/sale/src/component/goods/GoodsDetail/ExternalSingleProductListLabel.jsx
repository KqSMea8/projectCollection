import React, {PropTypes} from 'react';
import ExternalSingleProductListModal from './ExternalSingleProductListModal';

const ExternalSingleProductListLabel = React.createClass({
  propTypes: {
    singleProductList: PropTypes.array,
  },

  getInitialState() {
    return {
      showSingleProductListModal: false,
    };
  },

  onCancel() {
    this.setState({showSingleProductListModal: false});
  },

  onClick(e) {
    e.preventDefault();
    this.setState({showSingleProductListModal: true});
  },

  render() {
    return (<div style={{display: 'inline-block'}}>
      <a onClick = {this.onClick}>{this.props.singleProductList.length}个单品</a>
      {this.state.showSingleProductListModal ? <ExternalSingleProductListModal singleProductList={this.props.singleProductList} onCancel={this.onCancel}/> : null}
    </div>);
  },
});

export default ExternalSingleProductListLabel;
