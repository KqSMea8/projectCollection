import React, {PropTypes} from 'react';
import {message, Modal, Button} from 'antd';
import ajax from '../../../../common/ajax';
import {getMerchantId} from '../../common/utils';

const confirm = Modal.confirm;

const EnvironmentRemoveAction = React.createClass({
  propTypes: {
    refresh: PropTypes.func,
    environmentId: PropTypes.string,
    batchMode: PropTypes.bool,
    environmentIdList: PropTypes.array,
    reviewState: PropTypes.string,
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
    const {environmentId, refresh, batchMode, environmentIdList} = this.props;
    const params = {
      lists: batchMode ? environmentIdList : environmentId,
      op_merchant_id: this.merchantId,
    };
    if (this.merchantId) params.merchantId = this.merchantId;
    ajax({
      url: '/shop/kbshopenv/delete.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          refresh('remove', batchMode ? environmentIdList.length : 1);
        } else {
          message.error(result.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  render() {
    const {batchMode, environmentIdList} = this.props;
    return (batchMode ? <Button disabled={!environmentIdList.length} onClick={this.showConfirm}>删除</Button> : <Button size="small" onClick={this.showConfirm}>删除</Button>);
  },
});

export default EnvironmentRemoveAction;
