import React from 'react';
import MessageTable from './common/MessageTable';
import SubTitle from '../../common/SubTitle';
import IndexCarousel from './common/IndexCarousel';

const Index = React.createClass({
  render() {
    return (<div>
      <div className="app-detail-header">
        首页
      </div>
      <div className="app-detail-content-padding">
        <IndexCarousel />
        <SubTitle name="待办事项"/>
        <MessageTable />
      </div>
    </div>);
  },
});

export default Index;
