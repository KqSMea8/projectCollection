import { Tabs, Button } from 'antd';
import './leads.less';
const TabPane = Tabs.TabPane;
import React, {PropTypes} from 'react';
import PrivateLeads from './PrivateLeads';
import WaitedLeads from './WaitedLeads/WaitedLeads';
import PrivatePosLeads from './PrivatePosLeads/PrivatePosLeads';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import {remoteLog} from '../../../common/utils';

const hashUrl = {
  valid: '#/private-leads/valid',
  waited: '#/private-leads/waited',
  pos: '#/private-leads/pos',
};

// const activeKeyObjs = {
//   '#/private-leads/valid': 'valid',
//   '#/private-leads/valid/': 'valid',
//   '#/private-leads/waited': 'waited',
//   '#/private-leads/waited/': 'waited',
//   '#/private-leads/pos': 'pos',
//   '#/private-leads/pos/': 'pos',
//   // '#/private-leads': 'leads',
//   // '#/private-leads/': 'leads',
// };

const PrivateLeadsIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },
  getInitialState() {
    return {};
  },
  componentDidMount() {
  },

  onChange(key) {
    window.location.hash = hashUrl[key];
  },

  getTitleInfo() {
    let tabInfo;
    const {children} = this.props;
    // let waitedElement;
    // let validElement;
    // let posElement;
    // const active = activeKeyObjs[window.location.hash.split('?')[0]];
    // posElement = waitedElement = validElement = children;
    // if (children.type.isInValid) {
    //   validElement = <PrivateLeads {...this.props}/>;
    // } else {
    //   waitedElement = <WaitedLeads />;
    // }
    // posElement = <PrivatePosLeads />;

    const createBtn = permission('LEADS_CREATE') ? <Button type="primary" size="large" onClick={this.newLead}>创建单个leads</Button> : null;
    let activeKey;
    if (permission('LEADS_QUERY_PRIVATE')) activeKey = 'valid';
    else if (permission('LEADS_QUERY_UNEFFECT_PRIVATE')) activeKey = 'waited';
    else if (permission('LEADS_QUERY_PRIVATE_POS')) activeKey = 'pos';

    if (children && children.type === PrivateLeads) {
      activeKey = 'valid';
    } else if (children && children.type === WaitedLeads) {
      activeKey = 'waited';
    } else if (children && children.type === PrivatePosLeads) {
      activeKey = 'pos';
    }

    const tmpItem = [];
    if (permission('LEADS_QUERY_PRIVATE')) {
      tmpItem.push(
        <TabPane tab="有效开店leads" key="valid">
          <PrivateLeads {...this.props}/>
        </TabPane>
      );
    }
    if (permission('LEADS_QUERY_UNEFFECT_PRIVATE')) {
      tmpItem.push(
        <TabPane tab="待生效开店leads" key="waited">
          <WaitedLeads />
        </TabPane>
      );
    }
    if (permission('LEADS_QUERY_PRIVATE_POS')) {
      tmpItem.push(
        <TabPane tab="有效POS leads" key="pos">
          <PrivatePosLeads />
        </TabPane>
      );
    }
    tabInfo = (<div>
      <Tabs
        defaultActiveKey="valid"
        activeKey={activeKey}
        onChange={this.onChange}
        tabBarExtraContent={activeKey !== 'pos' && createBtn}>
        {tmpItem}
      </Tabs>
    </div>);

    // if (permission('LEADS_QUERY_PRIVATE') && permission('LEADS_QUERY_UNEFFECT_PRIVATE')) {
    //   tabInfo = (<div>
    //   <Tabs
    //     defaultActiveKey="valid"
    //     activeKey={active}
    //     onChange={this.onChange}
    //     tabBarExtraContent={active !== 'pos' && createBtn}>
    //     <TabPane tab="有效leads" key="valid">
    //       {validElement}
    //     </TabPane>
    //     {
    //       isPosSale &&
    //       <TabPane tab="有效POS leads" key="pos">
    //         {posElement}
    //       </TabPane>
    //     }
    //     <TabPane tab="待生效leads" key="waited">
    //       {waitedElement}
    //     </TabPane>
    //   </Tabs></div>);
    // } else if (permission('LEADS_QUERY_PRIVATE')) {
    //   tabInfo = (<div>
    //     <Tabs
    //       defaultActiveKey="valid"
    //       activeKey={active}
    //       onChange={this.onChange}
    //       tabBarExtraContent={active !== 'pos' && createBtn}>
    //       <TabPane tab="有效leads" key="valid">
    //         {validElement}
    //       </TabPane>
    //       <TabPane tab="有效POS leads" key="pos">
    //         {posElement}
    //       </TabPane>
    //     </Tabs>
    //   </div>);
    //   // tabInfo = (<div><div className="app-detail-header">
    //   //     有效leads
    //   //     <div style={{marginTop: -5, float: 'right'}}>
    //   //       {createBtn}
    //   //     </div>
    //   //   </div>
    //   //   {validElement}
    //   // </div>);
    // } else {
    //   tabInfo = (<div>
    //     <Tabs
    //       defaultActiveKey="valid"
    //       activeKey={active}
    //       onChange={this.onChange}
    //       tabBarExtraContent={active !== 'pos' && createBtn}>
    //       <TabPane tab="有效POS leads" key="pos">
    //         {posElement}
    //       </TabPane>
    //       <TabPane tab="待生效leads" key="waited">
    //         {waitedElement}
    //       </TabPane>
    //     </Tabs></div>);
    //   // tabInfo = (<div><div className="app-detail-header">
    //   //     待生效leads
    //   //     <div style={{marginTop: -5, float: 'right'}}>
    //   //       {createBtn}
    //   //     </div>
    //   //   </div>
    //   //   {waitedElement}
    //   // </div>);
    // }
    return tabInfo;
  },

  newLead() {
    remoteLog('LEADS_NEW');
    window.open('?mode=create#/leads/new');
  },

  render() {
    if (!permission('LEADS_QUERY_PRIVATE') && !permission('LEADS_QUERY_UNEFFECT_PRIVATE') && !permission('LEADS_QUERY_PRIVATE_POS')) {
      return <ErrorPage type="permission"/>;
    }

    return (<div className="private-leads">
      <div className="head">
        私海 leads
      </div>
      {this.getTitleInfo()}
    </div>);
  },
});

export default PrivateLeadsIndex;
