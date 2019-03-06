import React from 'react';
import ShelvedTodoModule from './ShelvedTodoModule';
import ShelvedForm from '../common/ShelvedForm';
import ShelvedTable from '../common/ShelvedTable';
import { shelvedStatus } from '../common/IntelligentGoodsConfig';

const ShelvedList = React.createClass({
  getInitialState() {
    return {
      activityListParams: {},
    };
  },
  componentWillMount() {
    this.setState({
      activityFormValue: {
        partnerId: this.props.location.query.partnerId,
        partnerName: this.props.location.query.partnerName,
        status: this.props.location.query.status,
      }
    });
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.isShow && nextProps.location !== this.props.location &&
    nextProps.location.query !== this.props.location.query) {
      this.setState({
        activityFormValue: {
          partnerId: nextProps.location.query.partnerId,
          partnerName: nextProps.location.query.partnerName,
          status: nextProps.location.query.status,
        }
      });
    }
  },
  onSearch(data) {
    const activityListParams = {
      partnerId: data.partnerId,
      viewStatus: data.status,
      pageNo: 1,
      pageSize: 10
    };
    this.setState({
      activityListParams
    });
  },
  checkTodoItem(data) {
    const partnerId = data.merchantPid;
    const partnerName = data.merchantName;
    window.location.hash = `/intelligentgoods/list/shelved?partnerId=${partnerId}&partnerName=${partnerName}`;
  },
  render() {
    return (<div>
      <div className="app-detail-content-padding">
          <div className="todo-panel">
            <ShelvedTodoModule checkTodoItem={this.checkTodoItem} type="GenericIndustry" location={this.props.location} env="shelved" />
          </div>
          <div className="activity-panel">
            <p className="padleft-blue"><p>活动商品列表</p></p>
            <div className="activity_wrapper">
              <ShelvedForm statusOptions={shelvedStatus} onSearch={this.onSearch} formValue={this.state.activityFormValue}/>
              <ShelvedTable params={this.state.activityListParams} location={this.props.location} />
            </div>
          </div>
      </div>
    </div>
    );
  },
});
export default ShelvedList;
