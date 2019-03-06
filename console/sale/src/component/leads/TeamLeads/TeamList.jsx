import React, {PropTypes} from 'react';
import { Tabs } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import TeamLeads from './TeamLeads';
import NotEffectiveLeads from './NotEffectiveLeads';

const TabPane = Tabs.TabPane;

const TeamList = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },
  getInitialState() {
    return {};
  },

  onChange(key) {
    window.location.hash = '/team-list/' + key;
  },

  render() {
    if (!permission('LEADS_QUERY_TEAM')) {
      return <ErrorPage type="permission"/>;
    }
    const children = this.props.children;
    let activeKey = 'info';
    if (children && children.type === TeamLeads) {
      activeKey = 'team';
    } else if (children && children.type === NotEffectiveLeads) {
      activeKey = 'noteffective';
    }
    return (<div className="kb-detail-main">
        <Tabs onChange={this.onChange} activeKey={activeKey} >
          <TabPane tab="团队leads" key="team">
            <TeamLeads />
          </TabPane>
          <TabPane tab="待生效leads" key="noteffective">
            <NotEffectiveLeads />
          </TabPane>
        </Tabs>
      </div>);
  },
});

export default TeamList;
