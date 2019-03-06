import React from 'react';
import PrivateLeadsForm from './PrivateLeadsForm';
import PrivateLeadsTable from './PrivateLeadsTable';

const PrivateLeads = React.createClass({
  propTypes: {
    location: React.PropTypes.any,
  },
  getInitialState() {
    return {};
  },
  render() {
    return (<div>
      <div className="app-detail-content-padding">
        <PrivateLeadsForm location={this.props.location}/>
        <PrivateLeadsTable location={this.props.location}/>
      </div>
    </div>);
  },
});

export default PrivateLeads;
