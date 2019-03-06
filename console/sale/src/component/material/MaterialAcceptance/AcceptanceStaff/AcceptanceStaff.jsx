import React from 'react';
import AcceptanceStaffForm from './AcceptanceStaffForm';
import AcceptanceStaffTable from './AcceptanceStaffTable';

const AcceptanceStaff = React.createClass({
  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  render() {
    return (<div>
      <div className="app-detail-content-padding">
        <AcceptanceStaffForm onSearch={this.onSearch}/>
        <AcceptanceStaffTable params={this.state.params}/>
      </div>
    </div>);
  },
});

export default AcceptanceStaff;
