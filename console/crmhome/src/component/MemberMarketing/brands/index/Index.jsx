import React from 'react';
import DashBoard from './DashBoard/DashBoard';
import Activities from './ActivityGrid/Activities';

const Index = React.createClass({
  render() {
    const { history } = this.props;
    return (<div>
      <h2 className="kb-page-title">
        精准营销
      </h2>
      <div className="kb-detail-main">
        <DashBoard />
        <Activities history={history} />
      </div>
    </div>);
  },
});

export default Index;
