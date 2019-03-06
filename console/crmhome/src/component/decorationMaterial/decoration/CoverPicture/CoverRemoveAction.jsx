import React, {PropTypes} from 'react';
import {message, Modal} from 'antd';
import ajax from '../../../../common/ajax';
import {kbScrollToTop} from '../../../../common/utils';

const confirm = Modal.confirm;

const CoverRemoveAction = React.createClass({
  propTypes: {
    refresh: PropTypes.func,
    fileGroupId: PropTypes.string,
  },
  getInitialState() {
    return {};
  },
  showConfirm() {
    kbScrollToTop();
    const {remove} = this;
    confirm({
      title: '是否删除',
      content: '删除后，将使用门店相册的图片进行替代',
      okText: '是',
      cancelText: '否',
      onOk() {
        remove();
      },
    });
  },
  remove() {
    const {fileGroupId, refresh} = this.props;
    const params = {
      fileGroupId: fileGroupId,
    };
    ajax({
      url: '/shop/shopsurface/delete.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          refresh('remove', 1);
        } else {
          message.error(result.resultMsg);
          kbScrollToTop();
        }
      },
      error: (_, msg) => {
        message.error(msg);
        kbScrollToTop();
      },
    });
  },
  render() {
    return <a onClick={() => this.showConfirm()}>删除</a>;
  },
});

export default CoverRemoveAction;
