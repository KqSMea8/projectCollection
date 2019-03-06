import React from 'react';
import { Button } from 'antd';
import {customLocation} from '../../../../common/utils';
import DashBoard from './DashBoard/DashBoard';
import Activities from './ActivityGrid/Activities';

const Index = React.createClass({
  useNow() {
    customLocation('/main.htm#/marketing-activity/consume/create');
  },

  render() {
    const { history } = this.props;
    return (<div>
      <h2 className="kb-page-title">
        会员营销
      </h2>
      <div className="kb-detail-main">
        <DashBoard />
        <Activities history={history} />

        <h3 className="kb-form-sub-title">
          <div className="kb-form-sub-title-icon" ></div>
          <span className="kb-form-sub-title-text">效果最好的营销服务</span>
        </h3>
        <div className="kb-present">
          <img width="160" src="https://os.alipayobjects.com/rmsportal/xTAPpGAFqcGrXXa.png" />
          <p className="title">消费送券</p>
          <p className="desc">单笔消费满额赠送二次消费优惠券</p>
          <Button type="primary" size="large" onClick={this.useNow}>立即使用</Button>
        </div>
      </div>
    </div>);
  },
});

export default Index;
