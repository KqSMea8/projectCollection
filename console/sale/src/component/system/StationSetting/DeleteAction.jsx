import React, {PropTypes} from 'react';
import {message} from 'antd';
import ajax from 'Utility/ajax';
import DeleteModal from './DeleteModal';

const DeleteAction = React.createClass({
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

  onOk() {
    const loader = ajax({
      url: '/manage/deleteJobConfig.json',
      method: 'post',
      data: {
        jobId: this.props.data.jobId,
      },
      type: 'json',
    }).then((res) => {
      if (res.status === 'succeed') {
        message.success('删除成功');
        this.setState({
          showModal: false,
        });
        this.props.onRefresh();
      } else {
        message.success('删除失败');
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
      {this.state.showModal ? <DeleteModal onOk={this.onOk} onCancel={this.onCancel} id={this.props.data.jobId}/> : null}
    </span>);
  },
});

export default DeleteAction;
