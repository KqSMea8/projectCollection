import React from 'react';
import TeamPosLeadsForm from './TeamPosLeadsForm';
import TeamPosLeadsTable from './TeamPosLeadsTable';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../../common/ErrorPage';
const SeachPublicLeads = React.createClass({
  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  render() {
    if (!permission('LEADS_QUERY_TEAM_POS')) {
      return <ErrorPage type="permission"/>;
    }
    return (<div>
      <div className="app-detail-content-padding">
        <TeamPosLeadsForm onSearch={this.onSearch} />
        <TeamPosLeadsTable params={this.state.params}/>
      </div>
    </div>);
  },
});

export default SeachPublicLeads;
