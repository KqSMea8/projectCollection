/**
 * 口碑福利资金池管理
 * #/activity/manage/funds
 */

import React from 'react';
import {Button, Modal, Icon} from 'antd';
import ajax from 'Utility/ajax';
import FundsSearchForm from './FundsSearchForm';
import FundsTable from './FundsTable';
import FundsCreateModal from './FundsCreateModal';
import FundsDetailModal from './FundsDetailModal';
import FundsRechargeModal from './FundsRechargeModal';
import FundsWarnModal from './FundsWarnModal';
import './FundsManage.less';

const msgType = {
  success: {
    icon: 'check-circle',
    color: '#008000',
  },
  fail: {
    icon: 'cross-circle',
    color: '#FF0000',
  },
  warn: {
    icon: 'exclamation-circle',
    color: '#ffbf00',
    titleColor: '#666',
  },
};

const FundsManage = React.createClass({
  getInitialState() {
    return {
      loading: false,
      user: { },

      message: {
        status: '',
        title: '',
        content: '',
      },

      modal: {
        message: false, // 操作反馈
        create: false, // 创建浮层
        detail: false, // 详情浮层
        recharge: false, // 充值浮层
        warn: false, // 设置预警浮层
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        poolId: '',
        poolName: '',
      },
      total: 0,
      list: [],
      currentItem: {},
    };
  },

  componentDidMount() {
    this.fetch({});

    ajax({
      url: '/sale/capitalpool/init.json',
      method: 'post',
      data: {},
      type: 'json',
      success: ({status, data}) => {
        if (status === 'succeed') {
          this.setState({
            user: data, // logonId, realName, userId
          });
        }
      },
      error: () => {},
    });
  },

  handleSearch(params) {
    this.fetch(params);
  },

  fetch(params) {
    this.setState({loading: true});
    const newParams = {...this.state.params, ...params};
    // newParams.status = 'NORMAL|INIT';

    ajax({
      url: '/sale/capitalpool/query.json',
      method: 'post',
      data: newParams,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed' && res.data && res.data.vos) {
          this.setState({
            loading: false,
            firstShow: false,
            list: res.data.vos,
            total: res.data.items,
            params: newParams,
          });
        } else {
          this.setState({
            loading: false,
            list: [],
          });
        }
      },
      error: () => {
        this.setState({
          loading: false,
          list: [],
        });
      },
    });
  },

  showMessage(stauts, title, msg) {
    this.setState({
      msgModal: {
        status: stauts,
        visible: true,
        tiele: title,
        msg: msg,
      },
    });
    setTimeout(() => {
      this.setState({
        msgModal: {
          visible: false,
          tiele: '',
          msg: '',
        },
      });
    }, 3000);
  },

  handleAction(type, status, data) {
    // 一个action有四个状态  show hide success fail reload
    const modal = {
      message: false, // 操作反馈
      create: false, // 创建浮层
      detail: false, // 详情浮层
      recharge: false, // 充值浮层
      warn: false, // 设置预警浮层
    };
    modal[type] = status !== 'hide';

    if (type === 'message') {
      this.state.message = data;
      if (data.item) {
        this.state.currentItem = data.item;
      }
    } else if (data) {
      this.state.currentItem = data;
    }

    this.setState({
      modal,
    });

    // 什么情况下要重刷新数据: status为reload的时候。
    if (status === 'reload') {
      this.handleSearch({});
    }
  },

  render() {
    const { modal, currentItem, user, message } = this.state;

    return (
      <div>
        <div className="app-detail-header" style={{position: 'relative'}}>
          资金池管理
          <Button type="primary" size="large" style={{float: 'right'}} onClick={() => {this.handleAction('create', 'show');}}>新建资金池</Button>
        </div>
        <div className="app-detail-content-padding">
          <FundsSearchForm onSearch={this.handleSearch} />
          <FundsTable {...this.state} onAction={this.handleAction} handleChange={this.handleSearch} />
        </div>
        {
          modal.create &&
          <FundsCreateModal visible={modal.create} item={currentItem} user={user} onAction={this.handleAction} />
        }
        <FundsDetailModal visible={modal.detail} item={currentItem} onAction={this.handleAction} />
        {
          modal.recharge &&
          <FundsRechargeModal visible={modal.recharge} item={currentItem} user={user} onAction={this.handleAction} />
        }
        {
          modal.warn &&
          <FundsWarnModal visible={modal.warn} item={currentItem} user={user} onAction={this.handleAction} />
        }
        {
          modal.message &&
          <Modal
            visible={modal.message}
            onOk={() => {this.setState({modal: {message: false}});}}
            onCancel={() => {this.setState({modal: {message: false}});}}
            footer={''}
            width={416}
            className={'ant-confirm'}
            closable={false}
          >
            <div style={{zoom: 1, overflow: 'hidden'}}>
              {
                msgType[message.status] &&
                <div className="ant-confirm-body">
                  <Icon type={msgType[message.status].icon} style={{color: msgType[message.status].color}} />
                  <span className="ant-confirm-title" style={{color: msgType[message.status].titleColor || msgType[message.status].color}}>{message.title}</span>
                  <div className="ant-confirm-content" style={{color: '#999999'}}>{message.content}</div>
                </div>
              }

              <div className="ant-confirm-btns">
                {
                  message.status === 'warn' ?
                    <div>
                      <Button type="primary-ghost" onClick={() => {this.setState({modal: {message: false}});}}>下次再充</Button>
                      <Button type="primary" onClick={() => {this.handleAction('recharge', 'show');}}>我要充值</Button>
                    </div>
                    :
                    <Button type="primary" onClick={() => {this.setState({modal: {message: false}});}}>知道了</Button>
                }
              </div>
            </div>
          </Modal>
        }
      </div>
    );
  },
});

export default FundsManage;
