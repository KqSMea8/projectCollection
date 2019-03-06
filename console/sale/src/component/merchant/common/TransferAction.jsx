import React, {PropTypes} from 'react';
import {message} from 'antd';
import ajax from 'Utility/ajax';
import TransferModal from './TransferModal';

const TransferAction = React.createClass({
  propTypes: {
    data: PropTypes.any,
    children: PropTypes.any,
    onRefresh: PropTypes.func,
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

  onOk(values) {
    const loader = ajax({
      url: '/sale/merchant/transferMerchant.json',
      method: 'post',
      data: values,
      type: 'json',
    }).then((res) => {
      if (res.status === 'succeed') {
        message.success('转移生效');
        this.setState({
          showModal: false,
        });
        setTimeout(() => {
          this.props.onRefresh(res);
        }, 500);
      } else {
        message.success('转移失败');
      }
      return res;
    }).catch((e) => {
      throw e;
    });

    return loader;
  },

  onCancel() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    return (<span>
      <span onClick={this.onClick}>{this.props.children}</span>
      {this.state.showModal ? <TransferModal onOk={this.onOk} onCancel={this.onCancel} data={this.props.data}/> : null}
    </span>);
  },
});

export default TransferAction;
