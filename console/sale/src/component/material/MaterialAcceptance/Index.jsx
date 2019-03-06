import './material.less';
import React from 'react';
import MaterialAcceptance from './MaterialAcceptance';

const MaterialAcceptanceIndex = React.createClass({
  getInitialState() {
    return {};
  },

  render() {
    return (<div>
      <div className="app-detail-header">验收</div>
      <div className="app-detail-content-padding">
        <MaterialAcceptance />
      </div>
    </div>);
  },

});

export default MaterialAcceptanceIndex;
