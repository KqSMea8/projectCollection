import React from 'react';
import PrivatePosLeadsForm from './PrivatePosLeadsForm';
import PrivatePosLeadsTable from './PrivatePosLeadsTable';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../../common/ErrorPage';

const PrivatePosLeads = React.createClass({
  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  render() {
    if (!permission('LEADS_QUERY_PRIVATE_POS')) {
      return <ErrorPage type="permission"/>;
    }
    return (<div>
      <div className="app-detail-content-padding">
        <PrivatePosLeadsForm onSearch={this.onSearch}/>
        <PrivatePosLeadsTable params={this.state.params}/>
      </div>
    </div>);
  },
});

export default PrivatePosLeads;
