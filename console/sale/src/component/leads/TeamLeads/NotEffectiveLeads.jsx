import React from 'react';
import NotEffectiveLeadsForm from './NotEffectiveLeadsForm';
import NotEffectiveLeadsTable from './NotEffectiveLeadsTable';
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

  render() {
    if (!permission('LEADS_QUERY_UNEFFECT_TEAM')) {
      return <ErrorPage type="permission"/>;
    }

    return (<div>
      <div className="app-detail-content-padding">
        <NotEffectiveLeadsForm onSearch={this.onSearch}/>
        <div>
          <NotEffectiveLeadsTable params={this.state.params}/>
        </div>
      </div>
    </div>);
  },
});

export default TeamLeads;
