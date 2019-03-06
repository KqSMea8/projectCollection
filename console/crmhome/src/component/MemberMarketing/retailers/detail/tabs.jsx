import React, { PropTypes } from 'react';
import { Tabs, Icon, Modal } from 'antd';
import CommonTitle from 'layout/CommonTitle';
import moment from 'moment';
import {crowdRestrictionEnum} from '../../common/enum';
// import TabsTable from './tabs/tabsTable';
import TabsBottom from './tabs/tabsBottom';
import PerVoucher from './tabs/PerVoucher';
import ActivityInfo from './tabs/ActivityInfo';
import RewardInfo from './tabs/RewardInfo';
import TabsGoods from './TabsGoods';

const TabPane = Tabs.TabPane;
const commonTitle = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
class ActTabs extends React.Component {
  constructor() {
    super();
    this.state = {
      showShopListModal: false,
      shopDetail: [],
    };
  }

  renderTop = (data, modifiedData = {}) => {
    let crowdRestriction = crowdRestrictionEnum[data.crowdRestriction];
    if (data.crowdRestriction === 'OFFLINE') {
      crowdRestriction = data.crowdName;
    }
    const isEndTimeModified = ('endTime' in modifiedData) && (data.endTime !== modifiedData.endTime);
    const isAutoDelayFlagModified = ('autoDelayFlag' in this.props.modifiedData) &&
      (this.props.data.autoDelayFlag !== this.props.modifiedData.autoDelayFlag);
    const formatString = 'YYYY-MM-DD HH:mm';
    const timeSpan = d => `${moment(d.startTime).format(formatString)} ~ ${moment(d.endTime).format(formatString)}`;
    const autoDelay = f => f ? '已设置自动续期' : '未设置自动续期';
    return (<div className="tabs-content-custom">
    <h5 className="tabs-h5-custom">{data.activityName}</h5>
    <p className="tabs-p-custom">
      {isEndTimeModified ? (
        <span style={{ background: '#ffffce', padding: 4 }}>
          {timeSpan(modifiedData)}
          <a onClick={() => Modal.info({
            title: '修改前的内容',
            content: timeSpan(data),
          })}>
            <Icon type="edit" />
          </a>
        </span>
      ) : (
        <span>{timeSpan(data)}</span>
      )}
    </p>
    <p className="tabs-p-custom">
      {isAutoDelayFlagModified ? (
        <span style={{ background: '#ffffce', padding: 4 }}>
          {autoDelay(this.props.modifiedData.autoDelayFlag)}
          <a onClick={() => Modal.info({
            title: '修改前的内容',
            content: autoDelay(this.props.data.autoDelayFlag),
          })}>
            <Icon type="edit" />
          </a>
        </span>
      ) : (
        <span>{autoDelay(this.props.data.autoDelayFlag)}</span>
      )}
    </p>
    <p className="tabs-p-b">{data.crowdRestriction ? crowdRestriction : '全部用户'}</p>
    </div>);
  }
  renderVouchers = (val, modifiedActivity) => {
    return (
      <div>
        {this.renderTop(val, modifiedActivity)}
        {val.activityType === 'CONSUME_SEND' ? (
          <div>
            <CommonTitle name="活动信息" />
            <ActivityInfo obj={val} modifiedObj={modifiedActivity} />
            <CommonTitle name="奖品信息" />
            <RewardInfo obj={val} modifiedObj={modifiedActivity} />
          </div>
        ) : (
          <div>
            <CommonTitle name="优惠券设置"/>
            <PerVoucher obj={val} modifiedObj={modifiedActivity} />
            <CommonTitle name="投放渠道"/>
            <TabsBottom
              data={val}
              autoHidden={this.props.autoHidden}
            />
          </div>
        )}
      </div>
    );
  }
  render() {
    let activities = this.props.data.activities || [];
    const {status} = this.props.data || '';
    let items = this.props.data.items || [];
    const modifiedActivities = this.props.modifiedData.activities || [{}];
    activities = activities.map((val, index)=>{
      val.autoDelayFlag = this.props.data.autoDelayFlag;
      const modifiedActivity = modifiedActivities.find(act => act.activityId === val.activityId);
      const tabName = commonTitle[index] ? `活动${commonTitle[index]}` : '其他活动';
      return (<TabPane tab={tabName} key={index}>
       {this.renderVouchers(val, modifiedActivity)}
      </TabPane>
      );
    });
    items = items.map((val, index)=>{
      const tabName = commonTitle[index + activities.length] ? `活动${commonTitle[index + activities.length]}` : '其他活动';
      return (<TabPane tab={tabName} key={index + activities.length}>
       {<TabsGoods itemId={val.itemId} status={status} smartPromoId={this.props.smartPromoId}/>}
      </TabPane>
      );
    });
    return (<div className="content-secton">
     <Tabs type="card">
        {activities}
        {items}
     </Tabs>
      </div>
    );
  }
}

ActTabs.propTypes = {
  data: PropTypes.any,
  smartPromoId: PropTypes.string,
  autoHidden: PropTypes.bool,
};

export default ActTabs;
