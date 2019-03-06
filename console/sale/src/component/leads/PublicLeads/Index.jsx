import React from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import PublicLeads from './PublicLeads';
import PublicPosLeads from './PublicPosLeads/PublicPosLeads';
import ConditionPublicLeads from './ConditionPublicLeads';
import { Button, Tabs } from 'antd';
import Report from '../common/Report';
import './publicLeads.less';

const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;

const PublicLeadsIndex = React.createClass({
  getInitialState() {
    return {};
  },
  componentWillMount() {
  },
  componentDidMount() {
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  onTabChange(key) {
    window.location.hash = `#/public-leads/${key}`;
  },
  newLead() {
    window.location.hash = 'private-leads/new';
  },
  render() {
    if (!permission('LEADS_QUERY_PUBLIC') && !permission('LEADS_QUERY_PUBLIC_POS')) {
      return <ErrorPage type="permission"/>;
    }
    const { children } = this.props;
    const reportComponent = (
      <div style={{marginRight: '26px'}}>
        {permission('ALL_LEADS_REPORT') && <Report downloadeType ="all"/>}
      </div>
    );
    let active;
    let leadsSubPage = 'condition';
    if (permission('LEADS_QUERY_PUBLIC')) active = 'leads';
    else if (permission('LEADS_QUERY_PUBLIC_POS')) active = 'pos';

    if (children && children.type === PublicLeads) {
      active = 'leads';
      leadsSubPage = 'map';
    } else if (children && children.type === ConditionPublicLeads) {
      active = 'leads';
      leadsSubPage = 'condition';
    } else if (children && children.type === PublicPosLeads) {
      active = 'pos';
    }

    const tmpItem = [];
    if (permission('LEADS_QUERY_PUBLIC')) {
      tmpItem.push(<TabPane tab="开店leads" key="leads">
        <div className="app-detail-content-padding">
            <ButtonGroup size="large">
              <Button type={leadsSubPage === 'condition' ? 'primary' : 'ghost'} onClick={() => location.hash = '#/public-leads/condition'}>条件搜索</Button>
              <Button type={leadsSubPage === 'map' ? 'primary' : 'ghost'} onClick={() => location.hash = '#/public-leads/map'}>地图搜索</Button>
            </ButtonGroup>
            {leadsSubPage === 'map' ? <PublicLeads /> : <ConditionPublicLeads />}
          </div>
        </TabPane>);
    }
    if (permission('LEADS_QUERY_PUBLIC_POS')) {
      tmpItem.push(<TabPane tab="POS leads" key="pos">
        <PublicPosLeads />
      </TabPane>);
    }
    return (<div className="public-leads">
      <div className="head">公海 leads</div>
      <Tabs onChange={this.onTabChange} activeKey={active} tabBarExtraContent={ active === 'leads' && reportComponent}>
        {tmpItem}
      </Tabs>
    </div>);
  },
});

export default PublicLeadsIndex;
