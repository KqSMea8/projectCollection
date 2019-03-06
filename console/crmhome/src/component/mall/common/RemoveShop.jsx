import React, {PropTypes} from 'react';
import {Modal, Button, message} from 'antd';
import ajax from '../../../common/ajax';

const RemoveShop = React.createClass({
  propTypes: {
    mallId: PropTypes.string,
    selectedIds: PropTypes.array,
    type: PropTypes.string,
    buttonText: PropTypes.string,
    onEnd: PropTypes.func,
    deletMapShopId: PropTypes.func,
  },

  getInitialState() {
    return {};
  },

  onClick(e) {
    e.preventDefault();
    Modal.confirm({
      title: '你确定移出当前选择的门店吗？',
      content: '请确定门店确实不在本综合体里',
      okText: '确定',
      cancelText: '取消',
      onOk: this.postData,
    });
  },

  postData() {
    const {mallId, selectedIds} = this.props;
    const params = {};
    params.mallId = mallId;
    params.operateType = 'REMOVE_SHOP';
    params.source = 'crm_home';
    params.relateShopId = selectedIds.join(',');
    ajax({
      url: '/shop/surroundShop.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status) {
          message.success('操作成功');
          this.props.deletMapShopId(params);
          this.props.onEnd();
        }
      },
      error: (e) => {
        message.error(e.resultMsg || '系统繁忙，请稍后再试', 3);
      },
    });
  },

  render() {
    const {selectedIds, type, buttonText} = this.props;
    return (<div style={{display: 'inline-block', marginRight: 12}}>
      {type === 'button' && <Button type="primary" onClick={this.onClick} disabled={selectedIds.length === 0}>{buttonText}</Button>}
      {type === 'text' && <a href="#" onClick={this.onClick}>{buttonText}</a>}
    </div>);
  },
});

export default RemoveShop;
