import React, {PropTypes} from 'react';
import { Breadcrumb } from 'antd';
// import TicketCreate from '../../common/TicketCreate/Form';
import CreateForm from './CreateForm';

const typeObj = {
  common: {
    title: '单品券',
  },
  realtime: {
    title: '买单优惠',
  },
};

const ActivityCreate = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
  },

  render() {
    const { params } = this.props;
    let title = '精准营销';

    if (params.mode) {
      title = typeObj[params.mode].title;
    }

    return (
      <div className="kb-activity-create">
        <h2 className="kb-page-title">{title}</h2>
        <div className="kb-detail-main">
          {
            !params.mode ? (
              <Breadcrumb separator=">">
                <Breadcrumb.Item><a href="#marketing/brands">精准营销</a></Breadcrumb.Item>
                <Breadcrumb.Item>发布营销活动</Breadcrumb.Item>
              </Breadcrumb>
            ) : null
          }

          <CreateForm actionType="create" query={this.props.location.query} params={this.props.params}/>
          {
            // <TicketCreate roleType="brand" actionType="create" query={this.props.location.query} />
          }
        </div>
      </div>
    );
  },
});

export default ActivityCreate;
