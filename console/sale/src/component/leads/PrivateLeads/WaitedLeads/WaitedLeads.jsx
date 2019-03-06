import React from 'react';
import WaitedLeadsForm from './WaitedLeadsForm';
import WaitedLeadsTable from './WaitedLeadsTable';

const WaitedLeads = React.createClass({
  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  newLead() {
    window.open('?mode=create#/leads/new');
  },
  render() {
    return (<div>
      <div className="app-detail-content-padding">
        <WaitedLeadsForm onSearch={this.onSearch}/>
        <WaitedLeadsTable params={this.state.params}/>
      </div>
    </div>);
  },
});

WaitedLeads.isInValid = 1;

export default WaitedLeads;
