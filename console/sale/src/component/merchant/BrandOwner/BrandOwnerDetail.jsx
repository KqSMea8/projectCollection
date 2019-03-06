import React, {PropTypes} from 'react';
import {Tabs, Breadcrumb } from 'antd';
import BrandOwnerInfo from './BrandOwnerInfo';
import BrandOwnerOrder from './BrandOwnerOrder';
import BrandOwnerLog from './BrandOwnerLog';

const TabPane = Tabs.TabPane;

const MerchantDetail = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
    location: PropTypes.object,
  },

  getInitialState() {
    this.pid = this.props.params.pid;
    return {
      merchantInfo: {},
    };
  },

  handleChangeTabs(key) {
    // console.log(key);
    window.location.hash = '/merchant/brandOwner/detail/' + this.pid + '/' + key;
  },

  render() {
    const children = this.props.children;
    const pid = this.pid;
    let activeKey = 'info';
    if (children && children.type === BrandOwnerOrder) {
      activeKey = 'order';
    } else if (children && children.type === BrandOwnerLog) {
      activeKey = 'log';
    }

    return (<div className="kb-detail-main">
        <div className="kb-page-title">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="#/merchant/brandOwner">品牌商</Breadcrumb.Item>
            <Breadcrumb.Item>品牌商详情</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Tabs activeKey={activeKey} onChange={this.handleChangeTabs} destroyInactiveTabPane>
          <TabPane tab="基本信息" key="info">
            <BrandOwnerInfo ref="merchantInfo" pid={pid} />
          </TabPane>
          <TabPane tab="订单列表" key="order">
            <BrandOwnerOrder ref="merchantOrder" pid={pid} />
          </TabPane>
          <TabPane tab="操作日志" key="log">
            <BrandOwnerLog ref="merchantLog" pid={pid} />
          </TabPane>
        </Tabs>
      </div>);
  },

});

export default MerchantDetail;
