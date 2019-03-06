import React, {PropTypes} from 'react';
import {Button, message} from 'antd';
import ajax from '../../../common/ajax';

const AgreeFlow = React.createClass({
  propTypes: {
    id: PropTypes.string,
    action: PropTypes.string,
    buttonText: PropTypes.string,
    disabled: PropTypes.bool,
  },

  getInitialState() {
    return {
      showModal: false,
    };
  },

  onClick(e) {
    e.preventDefault();
    this.postData();
  },

  postData() {
    const {id, action} = this.props;
    // 创建综合体
    if (action === 'CREATE_SHOP') {
      ajax({
        url: '/shop/confirmRelationMerchant.json',
        method: 'post',
        data: {
          orderId: id,
          confirmAction: 'PASS',
        },
        success: (result)=> {
          if (result.status === 'failed') {
            message.error('操作失败，请重试');
            return;
          }
          message.success('操作成功，请耐心等待审核结果');
          window.location.reload();
        },
      });
      return;
    }
    // 圈店、移店
    ajax({
      url: '/shop/confirmShopRelation.json',
      method: 'post',
      data: {
        orderId: id,
        operateType: 'PASS',
        sourceType: action,
      },
      success: (result)=> {
        if (result.status === 'failed') {
          message.error('操作失败，请重试');
          return;
        }
        message.success('操作成功');
        window.location.reload();
      },
    });
  },

  render() {
    return (<div style={{display: 'inline-block', marginRight: 12}}>
      <Button size="large" type="primary" onClick={this.onClick} disabled={this.props.disabled}>{this.props.buttonText}</Button>
    </div>);
  },
});

export default AgreeFlow;
