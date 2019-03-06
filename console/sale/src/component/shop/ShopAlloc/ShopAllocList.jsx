import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import {Tabs} from 'antd';
import ErrorPage from '../../../common/ErrorPage';
import ToConfirmList from './ToConfirmList';
import ManualAllocList from './ManualAllocList';
import ManualPosAllocList from './ManualPosAllocList';
import ShopDropList from './ShopDropList';
import BatchTaskButton from '../../../common/BatchTaskButton';

const TabPane = Tabs.TabPane;

const ShopAllocList = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },

  onChange(activeKey) {
    window.location.hash = '/shop-alloc/' + activeKey;
  },

  render() {
    if (!permission('SHOP_WAITING_CONFIRM_LIST') && !permission('SHOP_MANUAL_ASSIGN_LIST')
      && !permission('FALL_RULE_QUERY') && !permission('SHOP_MANUAL_ASSIGN_POS_SALE_LIST')) {
      return <ErrorPage type="permission" />;
    }
    let activeKey;
    if (permission('SHOP_WAITING_CONFIRM_LIST')) activeKey = 'to-confirm';
    else if (permission('SHOP_MANUAL_ASSIGN_LIST')) activeKey = 'manual';
    else if (permission('SHOP_MANUAL_ASSIGN_POS_SALE_LIST')) activeKey = 'manual-pos';
    else if (permission('FALL_RULE_QUERY')) activeKey = 'shop-drop';
    if (this.props.children) {
      activeKey = this.props.children.key;
    }
    return (
      <div className="kb-tabs-main" style={{position: 'relative'}}>
        <div style={{borderBottom: 0, padding: '24px 16px 8px'}} className="app-detail-header">门店分配</div>
        <Tabs
          activeKey={activeKey}
          onChange={this.onChange}
          destroyInactiveTabPane
          tabBarExtraContent={(
            activeKey === 'manual-pos' ? undefined : <div style={{ width: 'auto' }}>
              {permission('SHOP_RELATION_CREATE') && <BatchTaskButton bizType="SHOP_RELATION_CREATE" style={{ display: 'inline-block' }} />}
              {permission('SHOP_BATCH_ALLOCATE') && <BatchTaskButton bizType="ALLOCATE_SHOP" style={{ display: 'inline-block', marginLeft: 10 }} />}
            </div>
          )}>
          {[
            permission('SHOP_WAITING_CONFIRM_LIST') && (<TabPane tab="待确认列表" key="to-confirm">
              <div style={{padding: 16}}><ToConfirmList/></div>
            </TabPane>),
            permission('SHOP_MANUAL_ASSIGN_LIST') && (<TabPane tab="门店代运营分配" key="manual">
              <div style={{position: 'absolute', top: '-50px', right: '150px'}}/>
              <div style={{padding: 16}}><ManualAllocList/></div>
            </TabPane>),
            permission('SHOP_MANUAL_ASSIGN_POS_SALE_LIST') && (<TabPane tab="门店POS销售分配" key="manual-pos">
              <div style={{position: 'absolute', top: '-50px', right: '150px'}}/>
              <div style={{padding: 16}}><ManualPosAllocList/></div>
            </TabPane>),
            permission('FALL_RULE_QUERY') && (<TabPane tab="门店掉落" key="shop-drop">
              <div style={{padding: 16}}><ShopDropList /></div>
            </TabPane>),
          ].filter(t => t)}
        </Tabs>
      </div>
    );
  },

});

export default ShopAllocList;
