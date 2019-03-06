import React from 'react';
import MaterialAcceptanceForm from './MaterialAcceptanceForm';
import MaterialAcceptanceTable from './MaterialAcceptanceTable';

const MaterialAcceptance = React.createClass({
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
        <MaterialAcceptanceForm onSearch={this.onSearch}/>
        <MaterialAcceptanceTable params={this.state.params}/>
      </div>
    </div>
    );
  },
});
export default MaterialAcceptance;
