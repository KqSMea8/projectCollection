import React, {PropTypes} from 'react';
import {message, Modal} from 'antd';
import ajax from '../../../../common/ajax';
import {getMerchantId} from '../../common/utils';

const confirm = Modal.confirm;

const MenuRemoveAction = React.createClass({
  propTypes: {
    refresh: PropTypes.func,
    menuId: PropTypes.string,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {};
  },
  showConfirm() {
    const {remove} = this;
    confirm({
      title: '是否删除',
      okText: '是',
      cancelText: '否',
      onOk() {
        remove();
      },
    });
  },
  remove() {
    const {menuId, refresh} = this.props;
    const params = {
      menuId,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbmenu/delete.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'success') {
          message.success('删除成功');
          refresh('remove', 1);
        } else {
          message.error(result.resultMsg);
        }
      },
      error: (_, msg) => {
        if (_.resultCode === 'MENU_PROCESS_DELETE_FAILD') {
          Modal.info({
            title: msg,
          });
        } else {
          message.error(msg);
        }
      },
    });
  },
  render() {
    return (<a onClick={this.showConfirm}>删除</a>);
  },
});

export default MenuRemoveAction;
