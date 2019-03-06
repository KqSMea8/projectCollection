import React from 'react';
import { message } from 'antd';
import Activity from './Activity';
import ajax from '../../../../../common/ajax';

const Activities = React.createClass({
  getInitialState() {
    return {
      activityList: [],
    };
  },

  componentDidMount() {
    this.fetchActivties();
  },

  handleGoAdd() {
    const { history } = this.props;
    history.pushState(null, '/marketing/brands/groups-add');
  },


  fetchActivties() {
    ajax({
      url: '/promo/brand/memberBrandCrowdList.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        this.setState({
          activityList: res.memberBrandCrowdList,
        });

        if (res.status === 'success') {
          this.setState({
            activityList: res.memberBrandCrowdList,
          });
        } else {
          message.error(res.resultMsg);
        }
      },
    });
  },

  delItem(index) {
    const activityList = this.state.activityList;

    activityList.splice(index, 1);

    this.setState({
      activityList: activityList,
    });
  },

  render() {
    const { activityList } = this.state;
    const { history } = this.props;

    return (
      <div>
        <h3 className="kb-form-sub-title">
          <div className="kb-form-sub-title-icon" ></div>
          <span className="kb-form-sub-title-text">自定义营销</span>
        </h3>
        <div className="kb-activity-grid">
          <div style={{overflow: 'hidden'}}>
            { activityList.map((item, index) => {
              if (item.defaultCrowd === '0') {
                return (
                  <Activity {...item} key={index} delItem={this.delItem} index={index}
                                      history={history} />
                );
              }
            }) }
            <div className="item add" onClick={this.handleGoAdd}>
              <p><span style={{fontSize: 46}}>+</span><br/>添加自定义人群</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Activities;
