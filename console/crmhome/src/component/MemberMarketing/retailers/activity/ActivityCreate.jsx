import React, {PropTypes} from 'react';
import { Breadcrumb } from 'antd';
import TicketCreate from '../../common/TicketCreate/Form';

const ActivityCreate = React.createClass({
  propTypes: {
    location: PropTypes.object,
  },

  render() {
    return (
      <div className="kb-activity-create">
        <h2 className="kb-page-title">会员营销</h2>
        <div className="kb-detail-main">

          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#marketing/merchant">会员营销</a></Breadcrumb.Item>
            <Breadcrumb.Item>发布营销活动</Breadcrumb.Item>
          </Breadcrumb>

          <TicketCreate roleType="merchant" actionType="create" query={this.props.location.query} />
        </div>
      </div>
    );
  },
});

export default ActivityCreate;
