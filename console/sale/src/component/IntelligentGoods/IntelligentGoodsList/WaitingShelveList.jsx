import React from 'react';
import TodoModule from './TodoModule';
import WaitingShelveForm from '../common/WaitingShelveForm';
import WaitingShelveTable from '../common/WaitingShelveTable';
import { waitingShelveStatus } from '../common/IntelligentGoodsConfig';

const WaitingShelveList = React.createClass({
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
    window.location.hash = `/intelligentgoods/list/waitingshelve?partnerId=${partnerId}&partnerName=${partnerName}`;
  },
  render() {
    return (<div>
      <div className="app-detail-content-padding">
        {/* <Alert type="info" showIcon message={(
          <span>
          <span>口碑对齐补活动进行中，已有40万门店参与，请尽快提交您所负责的商户待上架活动。</span>
          <a href="#" target="_blank">查看活动详情</a>
          </span>)} />*/}
          <div className="todo-panel">
            <TodoModule checkTodoItem={this.checkTodoItem} type="GenericIndustry" location={this.props.location} />
          </div>
          <div className="activity-panel">
            <p className="padleft-blue"><p>活动商品列表</p></p>
            <div className="activity_wrapper">
              <WaitingShelveForm statusOptions={waitingShelveStatus} onSearch={this.onSearch} formValue={this.state.activityFormValue}/>
              <WaitingShelveTable params={this.state.activityListParams} location={this.props.location} />
            </div>
          </div>
      </div>
    </div>
    );
  },
});
export default WaitingShelveList;
