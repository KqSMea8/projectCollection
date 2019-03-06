import React from 'react';
import { Tabs } from 'antd';
import ManageTable from './ManageTable';
import PayTable from './PayTable';
import PayForm from './PayForm';
import PayFormQF from './PayFormQF';

const TabPane = Tabs.TabPane;

const ManageList = React.createClass({
  getInitialState() {
    return {
    };
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  render() {
    // 如果是被中台口碑福利页面引用，不展示头部

    const isInIframe = (location.href.indexOf('ebProvider=true') >= 0);

    if (isInIframe) {
      return (<div className="kb-manage">
        <PayFormQF onSearch={this.onSearch} ebProvider />
        <PayTable params={{...this.state.params, ebProvider: true}} />
      </div>);
    }

    return (<div className="kb-manage">
      <h2 className="kb-page-title">营销管理</h2>
      <div style={{width: 997}}>
        <Tabs defaultActiveKey="1" onChange={this.onTabClick}>
          <TabPane tab="营销活动" key="1">
            <div className="app-detail-content-padding" style={{paddingTop: 0}}>
              <PayForm onSearch={this.onSearch}/>
              <PayTable params={this.state.params}/>
            </div>
          </TabPane>
          <TabPane tab="历史优惠券" key="2">
            <div className="app-detail-content-padding" style={{paddingTop: 0}}>
              <ManageTable params={this.state.params}/>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>);
  },
});

export default ManageList;
