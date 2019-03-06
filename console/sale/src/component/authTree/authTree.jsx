/* eslint-disable */
import React, {PropTypes,Component} from 'react';
import {getAuthTree,publish} from './service';
import { Tabs,Button ,message} from 'antd';
import Tree from './components/tree.jsx'

import './authTree.less';
const TabPane = Tabs.TabPane;

export default class authTree extends Component{

  state =  {
    data: []
  }

  componentDidMount() {
    this.reload()
  }

  async reload(){
    let res = await getAuthTree();
    this.setState({data:res.data});
  }
  async publish(){
    let res = await publish()
    if(res.status === 'succeed') message.success('发布成功');
  }
  render() {
    const {data} = this.state;
    return (
      <div className="authTree">
        <Tabs defaultActiveKey="1">
          <TabPane tab="口碑权限" key="1">
            <Tree data={data.MERCHANT} permissionGroup="MERCHANT" reload={this.reload.bind(this)}/>
          </TabPane>
          <TabPane tab="BOH权限" key="2">
            <Tree data={data.BOH} permissionGroup="BOH" reload={this.reload.bind(this)}/>
          </TabPane>
          <TabPane tab="POS权限" key="3">
            <Tree data={data.POS} permissionGroup="POS" reload={this.reload.bind(this)}/>
          </TabPane>
          <TabPane tab="供应链权限" key="4">
            <Tree data={data.SUPPLYCHAIN} permissionGroup="SUPPLYCHAIN" reload={this.reload.bind(this)}/>
          </TabPane>
        </Tabs>
        <Button type="primary" onClick={this.publish.bind(this)} className="publish">发布</Button>
      </div>
    );
  }
};


