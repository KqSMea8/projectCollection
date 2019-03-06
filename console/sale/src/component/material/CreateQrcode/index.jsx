import React, { Component } from 'react';
import { Tabs } from 'antd';
import Create from './Create';
import Manage from './Manage';
import './style.less';

const TabPane = Tabs.TabPane;
if (!window.APP.kbretailprodUrl) {
  window.APP.kbretailprodUrl = 'http://kbretailprod.d3637.alipay.net';
}
// const server = '';
/**
 * 物料管理/口碑码管理
 */
class CreateQrcode extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    activeKey: '1',
  }
  render() {
    const { activeKey } = this.state;
    return (
      <div>
        <div className="app-detail-header">口碑码管理</div>
        <div className="app-detail-content-padding">
          <Tabs activeKey={activeKey} onChange={e => this.setState({ activeKey: e })}>
            <TabPane
              tab="制码"
              key="1">
              <Create />
            </TabPane>
            <TabPane
              tab="管理"
              key="2">
              { activeKey === '2' ? <Manage /> : null }
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default CreateQrcode;
