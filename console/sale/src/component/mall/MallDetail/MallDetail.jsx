import React, {PropTypes} from 'react';
import {Tabs, Button, message, Breadcrumb} from 'antd';
import MallDetailBase from './MallDetailBase';
import MallDetailOrder from './MallDetailOrder';
import MallDetailHistory from './MallDetailHistory';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import {cancelShop} from '../../shop/common/CancelShop';

const TabPane = Tabs.TabPane;

const MallDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
    children: PropTypes.any,
  },

  getInitialState() {
    return {
      data: {},
      isState: true,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  onChange(key) {
    if (key !== 'base') {
      this.setState({
        isState: false,
      });
    } else {
      this.setState({
        isState: true,
      });
    }
    const shopId = this.props.params.shopId;
    window.location.hash = '/mall/detail/' + shopId + '/' + key;
  },
  onClick() {
    const shopId = this.props.params.shopId;
    window.open('#/mall/edit/' + shopId);
  },
  gotoManagement() {
    const shopId = this.props.params.shopId;
    window.open('#/mall/list/' + shopId);
  },
  fetch() {
    const params = {
      shopId: this.props.params.shopId,
    };

    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/shopDetailConfig.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result && result.status === 'succeed') {
          this.setState({
            data: result.data,
          });
        } else {
          message.error(result.errorMsg, 3);
        }
      },
    });
  },
  render() {
    if (!permission('SHOP_DETAIL')) {
      return <ErrorPage type="permission"/>;
    }
    let activeKey = 'base';
    if (this.props.children) {
      const type = this.props.children.type;
      switch (type) {
      case MallDetailBase:
        activeKey = 'base';
        break;
      case MallDetailOrder:
        activeKey = 'order';
        break;
      case MallDetailHistory:
        activeKey = 'history';
        break;
      default:
        activeKey = 'base';
        break;
      }
    }
    const shopId = this.props.params.shopId;
    const {isState, data} = this.state;
    const modifyPermission = data.showEdit;
    const cancelPermission = permission('SHOP_MODIFY') && data.showCancel;
    const managePermission = data.showMallManage;
    return (
      <div className="kb-detail-main">
        <div className="app-detail-header" style= {{borderBottom: '0px'}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="1" href="#/shop/my">已开门店</Breadcrumb.Item>
            <Breadcrumb.Item key="2">门店详情(综合体)</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div style={{float: 'right', marginTop: -40}}>
          {isState && (activeKey === 'base') &&
            (<div style={{position: 'absolute', right: 16, zIndex: 1}}>
              {managePermission && <Button style={{marginRight: 10}} type="primary" onClick={this.gotoManagement}>管理</Button>}
              {modifyPermission && <Button type="primary" onClick={this.onClick}>修改</Button>}
              {!modifyPermission && cancelPermission && <span style={{marginRight: '5px'}}>当前门店正在审核中，需撤回后才发起修改</span>}
              {cancelPermission && <Button type="primary" onClick={() => cancelShop(data.orderId, 'shop', this.fetch)}>撤销审核</Button>}
              {!modifyPermission && !cancelPermission && <span>非您本人，如需继续修改当前的门店，请联系操作人</span>}
            </div>)}
        </div>
        <Tabs activeKey={activeKey} onChange={this.onChange}>
          <TabPane tab="基础信息" key="base"><MallDetailBase id={shopId}/></TabPane>
          <TabPane tab="订单列表" key="order"><MallDetailOrder id={shopId}/></TabPane>
          <TabPane tab="操作日志" key="history"><MallDetailHistory id={shopId}/></TabPane>
        </Tabs>
      </div>
    );
  },
});

export default MallDetail;
