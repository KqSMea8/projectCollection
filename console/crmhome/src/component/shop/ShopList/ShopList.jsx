import React, {PropTypes} from 'react';
import {Tabs} from 'antd';
import MyShopList from './MyShopList';
import BacklogShopList from './BacklogShopList';
import PayAccountManager from './PayAccountManager';

const TabPane = Tabs.TabPane;
const ShopList = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },
  onChange(activeKey) {
    window.location.hash = '/shop/' + activeKey;  // eslint-disable-line no-location-assign
  },

  render() {
    const activeKey = this.props.params.key || 'my';
    return (<div>
      <h2 className="kb-page-title" style={{borderBottom: 'none'}}>门店管理</h2>
      <div className="kb-tabs-main __fix-ant-tabs" style={{position: 'relative'}}>
        {window.APP.roleType === 'MALL_MERCHANT' ? (
        <Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
          <TabPane tab="已开门店" key="my"><div style={{padding: 16}}><MyShopList/></div></TabPane>
          <TabPane tab="待开门店" key="backlog"><div style={{padding: 16}}><BacklogShopList/></div></TabPane>
        </Tabs>) : (
        <Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
          <TabPane tab="已开门店" key="my"><div style={{padding: 16}}><MyShopList/></div></TabPane>
          <TabPane tab="待开门店" key="backlog"><div style={{padding: 16}}><BacklogShopList/></div></TabPane>
          { /* <TabPane tab="历史门店" key="history"><div style={{padding: 16}}><HistoryShopList/></div></TabPane>*/}
          <TabPane tab="收款账户管理" key="account"><PayAccountManager/></TabPane>
        </Tabs>)}
      </div>
    </div>);
  },
});

export default ShopList;
