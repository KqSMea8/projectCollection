import React from 'react';
import { message } from 'antd';
import Activity from './Activity';
import ConfigModal from '../ConfigModal';
import ajax from '../../../../../common/ajax';

const Activities = React.createClass({
  getInitialState() {
    return {
      defaultList: [],
      customList: [],
      allowShow: true,
    };
  },

  componentDidMount() {
    this.fetchActivties();
  },

  handleGoAdd(isTop7) {
    const { history } = this.props;
    if (isTop7 === 'true') {
      history.pushState(null, '/marketing/retailers/top7/groups-add');
    } else {
      history.pushState(null, '/marketing/retailers/groups-add');
    }
  },

  fetchActivties() {
    ajax({
      url: '/promo/merchant/memberMerchantCrowdList.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          this.setState(this.buildList(res.memberMerchantCrowdList));
        } else {
          message.error(res.resultMsg);
        }
      },
    });
  },

  buildList(activityList) {
    const defaultList = [];
    const customList = [];

    for (const item of activityList) {
      if (item.defaultCrowd === '1') {
        defaultList.push(item);
      } else {
        /* if (item.crowdName === '生日营销') {
         customList.unshift(item);
         } else {
         customList.push(item);
         } */

        customList.push(item);
      }
    }

    return {
      defaultList: defaultList,
      customList: customList,
    };
  },

  delItem(index) {
    const customList = this.state.customList;
    customList.splice(index, 1);

    this.setState({
      customList: customList,
    });
  },

  activtyState(count) {
    if (count > 0) {
      this.setState({
        allowShow: false,
      });
    }
  },

  render() {
    const { defaultList, customList } = this.state;
    const menuTree = document.getElementById('authMenuTree');
    const canAddGroup = menuTree && menuTree.value.includes('"0111"') || false;
    const isTop7 = window.APP.isFoodTopKA || false;

    return (
      <div>
        <h3 className="kb-form-sub-title">
          <div className="kb-form-sub-title-icon" ></div>
          <span className="kb-form-sub-title-text">会员标准营销</span>
          <ConfigModal
            allowShow={this.state.allowShow}
            refresh={this.fetchActivties}
          />
        </h3>

        <div className="kb-activity-grid" style={{overflow: 'hidden'}}>
          { defaultList && defaultList.map((item, index) => {
            return (
              <Activity {...item} key={index} delItem={this.delItem} index={index} actInfo={this.activtyState}/>
            );
          }) }
        </div>

        <h3 className="kb-form-sub-title">
          <div className="kb-form-sub-title-icon" ></div>
          <span className="kb-form-sub-title-text">自定义营销</span>
        </h3>
        <div className="kb-activity-grid" style={{overflow: 'hidden'}}>
            <Activity
              disableDel
              crowdName="新人营销"
              crowdGroupId="-1"
              desc="从未在该商家消费的用户"
              index={-1} />
          { customList && customList.map((item, index) => {
            return (
              <Activity {...item} key={index} delItem={this.delItem} index={index}/>
            );
          }) }
          { canAddGroup && (
            <div className="item add" onClick={() => this.handleGoAdd(isTop7)}>
              <p><span style={{fontSize: 46}}>+</span><br/>添加自定义人群</p>
            </div>
          )}
        </div>
      </div>
    );
  },
});

export default Activities;
