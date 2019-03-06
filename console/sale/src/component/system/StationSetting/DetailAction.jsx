import React, {PropTypes} from 'react';
import DetailModal from './DetailModal';

const DetailAction = React.createClass({
  propTypes: {
    data: PropTypes.any,
    children: PropTypes.any,
  },

  getInitialState() {
    return {
      showModal: false,
    };
  },

  onClick() {
    this.setState({
      showModal: true,
    });
  },

  onOk() {
    this.setState({
      showModal: false,
    });
  },

  onCancel() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    return (<span>
      <span onClick={this.onClick}>{this.props.children}</span>
      {this.state.showModal ? <DetailModal onOk={this.onOk} onCancel={this.onCancel} data={this.props.data}/> : null}
    </span>);
  },
});

export default DetailAction;
