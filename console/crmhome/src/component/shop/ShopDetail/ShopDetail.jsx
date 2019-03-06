import React, {PropTypes} from 'react';
import {Tabs, Button, message, Breadcrumb} from 'antd';
import ShopDetailBase from './ShopDetailBase';
import ShopDetailGoods from './ShopDetailGoods';
import ShopDetailHistory from './ShopDetailHistory';
import ShopDetailPunishment from './ShopDetailPunishment';
import ajax from '../../../common/ajax';
import {cancelShop} from '../common/CancelShop';

const TabPane = Tabs.TabPane;

const ShopDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
    children: PropTypes.any,
  },

  getInitialState() {
    return {
      pageConfig: {},
    };
  },

  componentDidMount() {
    this.fetch();
  },

  onChange(key) {
    const shopId = this.props.params.shopId;
    window.location.hash = '/shop/detail/' + shopId + '/' + key;
  },

  onClick() {
    const shopId = this.props.params.shopId;
    window.open('?mode=modify#/shop/edit/' + shopId);
  },
  fetch() {
    const params = {
      shopId: this.props.params.shopId,
    };

    ajax({
      url: '/shop/crm/shopDetailConfig.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result && result.status === 'succeed') {
          this.setState({
            pageConfig: result.data,
          });
        } else {
          message.error(result.errorMsg, 3);
        }
      },
    });
  },
  render() {
    let activeKey = 'base';
    if (this.props.children) {
      const type = this.props.children.type;
      switch (type) {
      case ShopDetailBase:
        activeKey = 'base';
        break;
      case ShopDetailGoods:
        activeKey = 'goods';
        break;
      case ShopDetailHistory:
        activeKey = 'history';
        break;
      case ShopDetailPunishment:
        activeKey = 'punishment';
        break;
      default:
        activeKey = 'base';
        break;
      }
    }
    const shopId = this.props.params.shopId;
    const {pageConfig} = this.state;
    const modifyPermission = pageConfig.showEdit;
    const cancelPermission = pageConfig.showCancel;

    return (
      <div className="kb-detail-main __fix-ant-tabs">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>已开门店</Breadcrumb.Item>
          <Breadcrumb.Item>门店详情（普通门店）</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{float: 'right', marginTop: -40}}>
          {modifyPermission && <Button onClick={this.onClick} type="primary">修改</Button>}
          {!modifyPermission && cancelPermission && <span style={{marginRight: '5px'}}>当前门店正在审核中，需撤回后才发起修改</span>}
          {cancelPermission && <Button type="primary" onClick={() => cancelShop(pageConfig.orderId, 'shop', this.fetch)}>撤销审核</Button>}
          {!modifyPermission && !cancelPermission && <span>非您本人，如需继续修改当前的门店，请联系操作人</span>}
        </div>
        {pageConfig.punishLogEnable ?
          (<Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
            <TabPane tab="基础信息" key="base"><ShopDetailBase id={shopId} pageConfig={pageConfig}/></TabPane>
            <TabPane tab="营销信息" key="goods"><ShopDetailGoods id={shopId}/></TabPane>
            <TabPane tab="处罚日志" key="punishment"><ShopDetailPunishment id={shopId}/></TabPane>
            <TabPane tab="操作日志" key="history"><ShopDetailHistory id={shopId}/></TabPane>
          </Tabs>) :
          (<Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
            <TabPane tab="基础信息" key="base"><ShopDetailBase id={shopId} pageConfig={pageConfig}/></TabPane>
            <TabPane tab="营销信息" key="goods"><ShopDetailGoods id={shopId}/></TabPane>
            <TabPane tab="操作日志" key="history"><ShopDetailHistory id={shopId}/></TabPane>
          </Tabs>)
        }
      </div>
    );
  },
});

export default ShopDetail;
