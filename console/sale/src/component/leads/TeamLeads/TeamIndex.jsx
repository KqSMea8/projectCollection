import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';
import { Tabs } from 'antd';
import TeamLeads from './TeamLeads';
import NotEffectiveLeads from './NotEffectiveLeads';
import TeamPosLeads from './TeamPosLeads/TeamPosLeads';
import BatchTaskButton from '../../../common/BatchTaskButton';
import './TeamLeads.less';

const TabPane = Tabs.TabPane;

const TeamList = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },
  getInitialState() {
    return {};
  },

  componentDidMount() {
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  newRequest(key) {
    window.location.hash = '/team-leads/' + key;
  },

  render() {
    const children = this.props.children;
    let activeKey = 'team';
    if (children && children.type === TeamLeads) {
      activeKey = 'team';
    } else if (children && children.type === NotEffectiveLeads) {
      activeKey = 'noteffective';
    } else if (children && children.type === TeamPosLeads) {
      activeKey = 'pos';
    }
    const tmpItem = [];
    if (permission('LEADS_QUERY_TEAM_POS')) {
      tmpItem.push(
        <TabPane tab="团队POS leads" key="pos">
          <TeamPosLeads />
        </TabPane>
      );
    }
    return (<div className="team-leads">
        <div className="head">团队leads</div>
        <Tabs
          onChange={this.newRequest}
          activeKey={activeKey}
          tabBarExtraContent={(permission('LEADS_BATCH_ALLOCATE') && activeKey !== 'pos') && <BatchTaskButton bizType="ALLOCATE_LEADS" />}>
          <TabPane tab="团队开店leads" key="team">
            <TeamLeads />
          </TabPane>
          <TabPane tab="团队待生效开店leads" key="noteffective">
            <NotEffectiveLeads />
          </TabPane>
          {tmpItem}
        </Tabs>
      </div>);
  },
});

export default TeamList;
