import React, {PropTypes} from 'react';
import {Menu, Popconfirm, message} from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import ShopAllocModal from '../common/ShopAllocModal';
import {postAllocData} from '../common/ShopAlloc';
import ListAction from '../../../common/ListAction';
import {remoteLog} from '../../../common/utils';

const ToConfirmAction = React.createClass({
  propTypes: {
    row: PropTypes.object,
    onConfirmAlloc: PropTypes.func,
    onEnd: PropTypes.func,
  },

  getInitialState() {
    return {
      modalType: '',
      confirmLoading: false,
    };
  },

  onClick({key}, e) {
    if (e) {
      e.preventDefault();
    }
    if (key === 'detail') {
      window.open('#/shop/detail/' + this.props.row.shopId);
      return;
    }
    if (key === 'alloc') {
      remoteLog('SHOP_REALLOC');
    }
    this.setState({
      modalType: key,
    });
  },

  onOk() {

  },

  closeModal() {
    this.setState({
      modalType: '',
    });
  },

  postData(key, values) {
    if (key === 'alloc') {
      this.setState({
        confirmLoading: true,
      });
      postAllocData(false, [{...this.props.row}], values, (result) => {
        this.setState({
          confirmLoading: false,
        });
        if (result.status === 'failed') {
          message.error(result.resultMsg || '操作失败，请重试');
          return;
        }
        message.success('操作成功');
        this.closeModal();
        this.props.onEnd();
      }, (result) => {
        this.setState({
          confirmLoading: false,
        });
        message.error(result.resultMsg || '操作失败，请重试');
      });
    }
  },

  render() {
    const modalType = this.state.modalType;
    const actionList = [];
    const allocPermission = ['OPEN', 'PAUSED'].indexOf(this.props.row.shopStatusCode) >= 0;
    if (allocPermission) {
      if (permission('SHOP_CONFIRM_ASSIGN')) {
        actionList.push({
          link: <Popconfirm placement="top" title="确定生效吗？" onConfirm={this.props.onConfirmAlloc}><a href="#">确认生效</a></Popconfirm>,
          menu: null,
        });
      }
      if (permission('SHOP_REASSIGN')) {
        actionList.push({
          link: <a href="#" onClick={this.onClick.bind(this, {key: 'alloc'})}>重新分配</a>,
          menu: <Menu.Item key="alloc">重新分配</Menu.Item>,
        });
      }
    }
    if (permission('SHOP_DETAIL')) {
      actionList.push({
        link: <a href="#" onClick={this.onClick.bind(this, {key: 'detail'})}>查看详情</a>,
        menu: <Menu.Item key="detail">查看详情</Menu.Item>,
      });
    }
    return (<span>
      <ListAction actionList={actionList} onMenuClick={this.onClick}/>
      {modalType === 'alloc' && <ShopAllocModal onOk={this.postData.bind(this, 'alloc')} onCancel={this.closeModal} confirmLoading={this.state.confirmLoading}/>}
      </span>);
  },
});

export default ToConfirmAction;
