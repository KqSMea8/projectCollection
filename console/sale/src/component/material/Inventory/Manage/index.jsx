import React, { Component } from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import MainContent from 'Library/PageLayout/MainContent';

import Log from './Log';
import List from './List';

const TabKeys = {
  List: 'list',
  Log: 'log'
};

export default class Manage extends Component {
  constructor() {
    super();
  }

  state = {
    active: TabKeys.List,
    logSummary: {}
  };

  handleTabChange = (tab) => {
    this.setState({
      active: tab,
      logSummary: {}
    });
  };

  handleViewLog = summary => {
    this.setState({
      logSummary: summary,
      active: TabKeys.Log
    });
  };

  render() {
    const { active, logSummary } = this.state;
    return (
        <Tabs defaultActiveKey={TabKeys.List} activeKey={active} onChange={this.handleTabChange}>
          <TabPane key={TabKeys.List} tab="库存管理">
            <MainContent>
              <List onViewLog={this.handleViewLog}/>
            </MainContent>
          </TabPane>
          <TabPane key={TabKeys.Log} tab="库存流水">
            <MainContent>
              <Log logSummary={logSummary}/>
            </MainContent>
          </TabPane>
        </Tabs>
    );
  }
}
