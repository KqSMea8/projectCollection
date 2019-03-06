import React from 'react';
import { Tabs } from 'antd';
import NameList from './NameList';
import NameListKBSales from './NameListKBSales';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.params.tab || 'old',
    };
  }

  onTabChange(value) {
    this.setState({ activeTab: value });
    history.replaceState(null, '', `#/shop/NameList/${value}`);
  }

  render() {
    const { activeTab } = this.state;
    return (<div>
      <div className="app-detail-header" style={{borderBottom: 0, padding: '24px 16px 8px'}}>黑白名单</div>
      <Tabs activeKey={activeTab} onChange={(value) => this.onTabChange(value)}>
        <Tabs.TabPane tab="新名单" key="new">
          <NameListKBSales />
        </Tabs.TabPane>
        <Tabs.TabPane tab="旧名单" key="old">
          <NameList />
        </Tabs.TabPane>
      </Tabs>
    </div>);
  }
}
