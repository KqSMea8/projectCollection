import React from 'react';
import DashBoard from './DashBoard/DashBoard';
import MessageTable from '../../../index/common/MessageTable';
import SubTitle from '../../../../common/SubTitle';
import FloatMessageModal from '../../../index/DashBoard/FloatMessageModal';

const Index = React.createClass({
  render() {
    return (<div>
      <h2 className="kb-page-title">
        首页
      </h2>
      <div className="kb-detail-main">
        <DashBoard />
        <SubTitle name="待办事项"/>
        <MessageTable />
        <FloatMessageModal bizType="brand" />
      </div>
    </div>);
  },
});

export default Index;
