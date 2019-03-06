import React, {PropTypes} from 'react';
import {Tabs} from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import MyShopList from './MyShopList';
import PosShopList from './PosShopList';
import BacklogShopList from './BacklogShopList';
import BatchTaskButtons from '../common/BatchTaskButtons';
import ReopenShopButton from '../common/ReopenShopButton';

const TabPane = Tabs.TabPane;

const ShopList = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
  },
  componentWillMount() {
    this.params = {};
  },
  onChange(activeKey) {
    window.location.hash = '/shop/' + activeKey;
  },
  getParams() {
    return this.params;
  },
  setParams(params) {
    this.params = params;
  },
  render() {
    if (!permission('SHOP_MY_SHOP_LIST') && !permission('SHOP_TO_BE_OPENED_SHOP_LIST') && !permission('SHOP_MY_POS_SALE_SHOP_LIST')) {
      return <ErrorPage type="permission"/>;
    }
    const { brandId, brandName } = this.props.location.query;
    let activeKey = permission('SHOP_MY_POS_SALE_SHOP_LIST') ? 'posShop' : 'my';
    if (this.props.children) {
      activeKey = this.props.children.key;
    }
    return (
      <div className="kb-tabs-main" style={{position: 'relative'}}>
        <div>
          <div style={{borderBottom: 0, padding: '24px 16px 0px'}} className="app-detail-header">我的门店</div>
          <div style={{position: 'absolute', top: 24, right: 0, zIndex: 1}}>
            {activeKey === 'my' && <BatchTaskButtons getParams={this.getParams}/>}
            {activeKey === 'backlog' && permission('SHOP_BATCH_REOPEN') && <ReopenShopButton getParams={this.getParams}/>}
          </div>
        </div>
        <Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
          {[
            permission('SHOP_MY_POS_SALE_SHOP_LIST') && <TabPane tab="POS销售门店" key="posShop">
              <div style={{padding: 16}}><PosShopList initBrand={{id: brandId, name: brandName}} /></div>
            </TabPane>,
            permission('SHOP_MY_SHOP_LIST') && <TabPane tab="代运营门店" key="my">
              <div style={{padding: 16}}><MyShopList setParams={this.setParams} initBrand={{id: brandId, name: brandName}}/></div>
            </TabPane>,
            permission('SHOP_TO_BE_OPENED_SHOP_LIST') && <TabPane tab="待开门店" key="backlog">
              <div style={{padding: 16}}><BacklogShopList setParams={this.setParams}/></div>
            </TabPane>,
          ].filter(tab => tab)}
        </Tabs>
      </div>
    );
  },
});

export default ShopList;
