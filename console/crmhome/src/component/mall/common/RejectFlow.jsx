import React, {PropTypes} from 'react';
import {Button, message} from 'antd';
import ajax from '../../../common/ajax';
import RejectFlowModal from './RejectFlowModal';

const RejectFlow = React.createClass({
  propTypes: {
    id: PropTypes.string,
    action: PropTypes.string,
    buttonText: PropTypes.string,
  },

  getInitialState() {
    return {
      showModal: false,
    };
  },

  onClick(e) {
    e.preventDefault();
    this.setState({
      showModal: true,
    });
  },

  postData(values) {
    const {id, action} = this.props;
    const reasonList = values.reason.map((reason) => {
      return reason === '其他原因' ? values.memo : reason;
    });
    const self = this;
    // 创建综合体
    if (action === 'CREATE_SHOP') {
      ajax({
        url: '/shop/confirmRelationMerchant.json',
        method: 'post',
        data: {
          orderId: id,
          confirmAction: 'REJECT',
          reason: JSON.stringify(reasonList),
        },
        success: (result)=> {
          if (result.status === 'failed') {
            message.error('操作失败，请重试');
            return;
          }
          self.closeModal();
          message.success('操作成功');
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
        operateType: 'REJECT',
        reason: JSON.stringify(reasonList),
        sourceType: action,
      },
      success: (result)=> {
        if (result.status === 'failed') {
          message.error('操作失败，请重试');
          return;
        }
        self.closeModal();
        message.success('操作成功');
        window.location.reload();
      },
    });
  },

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    return (<div style={{display: 'inline-block', marginRight: 12}}>
      <Button size="large" type="ghost" onClick={this.onClick}>{this.props.buttonText}</Button>
      {this.state.showModal ? <RejectFlowModal action={this.props.action} onOk={this.postData} onCancel={this.closeModal}/> : null}
    </div>);
  },
});

export default RejectFlow;
