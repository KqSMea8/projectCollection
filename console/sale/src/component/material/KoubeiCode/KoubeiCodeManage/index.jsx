import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import HasBindTab from './HasBindTab';
import ToBindTab from './ToBindTab';
import ApplyRecordTab from './ApplyRecordTab';

const TabPane = Tabs.TabPane;

/**
 * 物料管理/口碑码管理
 */
class KoubeiCodeManage extends Component {
  constructor(props) {
    super(props);
  }

  onTabChange = activeKey => {
    window.location.hash = `#/material/koubeicode/manage/${activeKey}`;
  };

  onApplyCode = () => {
    this.props.history.push('/material/koubeicode/apply');
  };

  render() {
    const { children } = this.props;
    let activeKey = 'hasbind';
    if (children) {
      if (children.type === ApplyRecordTab) {
        activeKey = 'record';
      } else if (children.type === ToBindTab) {
        activeKey = 'tobind';
      } else if (children.type === HasBindTab) {
        activeKey = 'hasbind';
      }
    }
    return (
      <div>
        <div className="app-detail-header">
          口碑码管理
          <Button
            style={{float: 'right'}}
            type="primary"
            onClick={this.onApplyCode}
          >
            生成口碑码
          </Button>
        </div>
        <div className="app-detail-content-padding">
          <Tabs
            activeKey={activeKey}
            onChange={this.onTabChange}>
            <TabPane
              tab="已绑定"
              key="hasbind">
              <HasBindTab />
            </TabPane>
            <TabPane
              tab="未绑定"
              key="tobind">
              <ToBindTab />
            </TabPane>
            <TabPane
              tab="生成记录"
              key="record">
              <ApplyRecordTab visible={activeKey === 'record'} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default KoubeiCodeManage;
