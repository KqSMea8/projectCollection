import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router';
import { GroupsViewName, GroupsViewBasic, GroupsViewIndustry, GroupsViewConsumer,
  GroupsViewLocation, GroupsViewCustomerDivide, convert } from '../../../common/GroupsView';
import './style.less';

import ajax from '../../../../../common/ajax';

class RetailersGroupsView extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
  }

  state = { data: {}, count: -1 }

  componentWillMount() {
    const { id } = this.props.params;
    ajax({
      url: '/promo/merchant/crowd/detail.json',
      method: 'GET',
      data: { crowdGroupId: id },
      type: 'json',
      success: response => {
        const { data } = response;
        this.setState({ data });
      },
    });

    ajax({
      url: '/promo/common/memberCrowdCount.json',
      method: 'GET',
      data: { crowdGroupId: id },
      type: 'json',
      success: response => {
        const { memberCrowdCount } = response;
        this.setState({ count: memberCrowdCount });
      },
    });
  }

  handlerMbmberType() {
    const { crowdCondition } = this.state.data;
    let mbmberType = '';
    if (crowdCondition && crowdCondition.length > 0) {
      crowdCondition.map(itme => {
        if (itme.tagCode === 'pam_member_type') {
          mbmberType = itme.value;
          return;
        }
      });
    }
    return mbmberType;
  }

  render() {
    const { count, data } = this.state;
    const { crowdName: name, crowdCondition } = data;
    const { id } = this.props.params;
    if (!(crowdCondition && name)) {
      return null;
    }
    const { gender, age, birthdayMonth, constellation, haveBaby, occupation,
      consumeLevel, firstLinkDate, residentPlace, cate, tradeCycle, tradeAmount, tradeCount, tradePerPrice,
      activityTime, activityLbs, activityScope, activityType, memberGrade } = convert(crowdCondition);
    const basicProps = { gender, age, birthdayMonth, constellation, residentPlace, haveBaby,
      occupation, consumeLevel, firstLinkDate };
    const consumerProps = { tradeCycle, tradeAmount, tradeCount, tradePerPrice };
    const locationProps = { crowdGroupId: id, activityTime, activityLbs, activityScope,
      activityType };
    return (
      <retailers-group-view>
        <h2>会员营销</h2>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/marketing/retailers">会员营销</Link></Breadcrumb.Item>
          <Breadcrumb.Item>创建自定义人群</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <GroupsViewName name={name} count={count} mbmberType={this.handlerMbmberType()} showType/>
          <div><strong>{crowdCondition.length}</strong> 个标签已选</div>
          <GroupsViewBasic { ...basicProps } />
          <GroupsViewConsumer { ...consumerProps } />
          <GroupsViewLocation { ...locationProps } />
          <GroupsViewIndustry cate={cate} />
          {window.APP.isSuperMarket === 'true' && <GroupsViewCustomerDivide memberGrade={memberGrade} />}
        </div>
      </retailers-group-view>
    );
  }
}

export default RetailersGroupsView;
