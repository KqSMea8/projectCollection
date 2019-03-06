import React from 'react';
import PublicLeadsForm from './PublicLeadsForm';
import PublicLeadsTable from './PublicLeadsTable';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
const PublicLeads = React.createClass({
  getInitialState() {
    return {
      isShowForm: 1,
    };
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  newLead() {
    window.location.hash = 'private-leads/new';
  },
  render() {
    if (!permission('LEADS_QUERY_PUBLIC')) {
      return <ErrorPage type="permission"/>;
    }
    return (<div>
    <div className="app-detail-content-padding">
     <div style={{margin: '16px 0'}}>
       <PublicLeadsForm seachCondition="map" onSearch={this.onSearch} shops={this.state.shops}/>
     </div>
     <div style={{marginTop: 15}}>
       <PublicLeadsTable seachCondition="map" params={this.state.params}/>
     </div>
      </div>
    </div>);
  },
});

export default PublicLeads;
