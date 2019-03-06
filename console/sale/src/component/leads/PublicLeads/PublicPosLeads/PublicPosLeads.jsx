import React from 'react';
import PublicPosLeadsForm from './PublicPosLeadsForm';
import PublicPosLeadsTable from './PublicPosLeadsTable';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../../common/ErrorPage';

const PublicPosLeads = React.createClass({
  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  render() {
    if (!permission('LEADS_QUERY_PUBLIC_POS')) {
      return <ErrorPage type="permission"/>;
    }
    return (<div>
      <div className="app-detail-content-padding">
        <PublicPosLeadsForm onSearch={this.onSearch} />
        <PublicPosLeadsTable params={this.state.params}/>
      </div>
    </div>);
  },
});

export default PublicPosLeads;
