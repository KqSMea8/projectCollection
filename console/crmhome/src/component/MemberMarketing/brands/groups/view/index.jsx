import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router';
import { GroupsViewName, GroupsViewBasic, GroupsViewIndustry, convert } from
  '../../../common/GroupsView';
import './style.less';

import ajax from '../../../../../common/ajax';

class BrandsGroupsView extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
  }

  state = { data: {} }

  componentWillMount() {
    const { id } = this.props.params;
    ajax({
      url: '/promo/brand/crowd/detail.json',
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


  render() {
    const { crowdName: name, crowdCondition } = this.state.data;
    const { count } = this.state;
    if (!(crowdCondition && name)) {
      return null;
    }
    const { gender, age, birthdayMonth, constellation, haveBaby, residentPlace, occupation,
      consumeLevel, cate, applyVoucher, verifyVoucher } = convert(crowdCondition);
    const basicProps = { gender, age, birthdayMonth, constellation, residentPlace, haveBaby,
      occupation, consumeLevel, applyVoucher, verifyVoucher };
    return (
      <brands-group-view>
        <h2>精准营销</h2>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/marketing/brands">精准营销</Link></Breadcrumb.Item>
          <Breadcrumb.Item>创建自定义人群</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          {/* 添加人数显示(原来的type=brands) 20160726 modify by 浴兰 */}
          <GroupsViewName name={name} count={count} />
          <div><strong>{crowdCondition.length}</strong> 个标签已选</div>
          <GroupsViewBasic { ...basicProps } />
          <GroupsViewIndustry cate={cate} />
        </div>
      </brands-group-view>
    );
  }
}

export default BrandsGroupsView;
