import React from 'react';
import TeamLeadsForm from './TeamLeadsForm';
import TeamLeadsTable from './TeamLeadsTable';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';

const TeamLeads = React.createClass({
  getInitialState() {
    return {};
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  newRequest() {
    window.location.hash = 'events/new';
  },

  render() {
    if (!permission('LEADS_QUERY_TEAM')) {
      return <ErrorPage type="permission"/>;
    }

    return (<div>
      <div className="app-detail-content-padding">
        <TeamLeadsForm onSearch={this.onSearch}/>
        <div>
          <TeamLeadsTable params={this.state.params}/>
        </div>
      </div>
    </div>);
  },
});

export default TeamLeads;
