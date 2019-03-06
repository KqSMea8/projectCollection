import React, {PropTypes} from 'react';
import {Tabs} from 'antd';
import ProductPaySettings from './ProductPaySettings';
import ProductRuleSettings from './ProductRuleSettings';
import './productSettings.less';

const TabPane = Tabs.TabPane;
const ProductSettingsIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },

  onChange(activeKey) {
    window.location.hash = '/stuff/productSettings/' + activeKey;
  },

  render() {
    let activeKey = 'paySettings';
    if (this.props.children) {
      if (this.props.children.type === ProductRuleSettings) {
        activeKey = 'ruleSettings';
      }
    }
    return (<div>
      <h2 className="kb-page-title" style={{borderBottom: 'none'}}>商品设置</h2>
      <Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
        <TabPane tab="商品支付设置" key="paySettings">
          <div style={{padding: '1px 16px'}}><ProductPaySettings/></div>
        </TabPane>
        <TabPane tab="商品规则设置" key="ruleSettings">
          <div style={{padding: '1px 16px'}}><ProductRuleSettings/></div>
        </TabPane>
      </Tabs>
    </div>);
  },
});

export default ProductSettingsIndex;
