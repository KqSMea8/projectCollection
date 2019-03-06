import React, {PropTypes} from 'react';
import {message, Modal, Button} from 'antd';
import ajax from '../../../../common/ajax';
import {getMerchantId} from '../../common/utils';

const confirm = Modal.confirm;

const DishRemoveAction = React.createClass({
  propTypes: {
    refresh: PropTypes.func,
    dishId: PropTypes.string,
    reviewState: PropTypes.string,
    batchMode: PropTypes.bool,
    dishIdList: PropTypes.array,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {};
  },
  showConfirm() {
    const {reviewState} = this.props;
    const {remove} = this;
    if (reviewState !== '0') {
      confirm({
        title: '是否删除',
        content: '若该菜品已被配置在菜单中，则删除后将同步删除菜单中的该菜品。',
        okText: '是',
        cancelText: '否',
        onOk() {
          remove();
        },
      });
    } else {
      remove();
    }
  },
  remove() {
    const {dishId, refresh, batchMode, dishIdList} = this.props;
    ajax({
      url: '/shop/deleteShopGoodsPics.json',
      method: 'post',
      data: { lists: dishId, op_merchant_id: this.merchantId },
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('删除成功');
          refresh('remove', batchMode ? dishIdList.length : 1);
        } else {
          message.error(result.resultMsg);
        }
      }, error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  render() {
    const {batchMode, dishIdList} = this.props;
    return (batchMode ? <Button disabled={!dishIdList.length} onClick={this.showConfirm}>删除</Button> : <Button size="small" onClick={this.showConfirm}>删除</Button>);
  },
});

export default DishRemoveAction;
