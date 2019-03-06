import React, { PropTypes } from 'react';
import WaitingPutawayForm from './WaitingPutawayForm';
import WaitingPutawayTable from './WaitingPutawayTable';
import {cateringWaitingStatus} from '../common/IntelligentGoodsConfig';
import AlreadyPutawayTodoModule from './AlreadyPutawayTodoModule';
import '../intelligentgoods.less';

class AlreadyPutaway extends React.Component {
  static propTypes = {
    searchParams: PropTypes.object,
    activeKey: PropTypes.string,
  }
  checkTodoItem(data) {
    const { partnerId, partnerName } = data;
    if (partnerName) {
      location.hash = `#/intelligentcatering/list/putaway?partnerId=${partnerId}&name=${partnerName}`;
    } else {
      location.hash = `#/intelligentcatering/list/putaway`;
    }
  }
  render() {
    return (<div>
      <div className="app-detail-content-padding">
        <div className="todo-panel">
          <AlreadyPutawayTodoModule isCatering="catering" location={this.props.location} env="alreadyPutaway" checkTodoItem={this.checkTodoItem} />
        </div>
        <div className="activity-panel">
          <div className="padleft-blue"><p>活动商品列表</p></div>
          <div className="activity_wrapper">
            <WaitingPutawayForm statusOptions={cateringWaitingStatus} {...this.props.searchParams} />
            <WaitingPutawayTable {...this.props.searchParams} activeKey={this.props.activeKey} />
          </div>
        </div>
      </div>
    </div>
    );
  }
}
export default AlreadyPutaway;
