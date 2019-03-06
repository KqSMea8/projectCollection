import React, {PropTypes} from 'react';
import { Icon } from 'antd';

const ActivitySuccess = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  render() {
    return (
      <div className="kb-activity-success">
        <div className="kb-detail-main">
          <div style={{ padding: '20px 0 30px 30px', backgroundColor: '#e1f2ff', fontSize: 18, border: '1px solid #efefef'}}>
            <Icon type="check-circle" style={{ marginRight: 5, color: '#0ae', fontSize: 22 }} />活动配置成功
          </div>

          <div style={{ padding: '20px 60px 30px', border: '1px solid #e7e7eb', borderTop: 'none' }}>
            <p>你可以通过以下形式推广该活动：</p>

            <div style={{ margin: '50px 0 15px' }}>
              <p>配置服务窗消息</p>
              <img src="https://zos.alipayobjects.com/rmsportal/gvxOsuiZdsIyFoT.png" style={{ display: 'block', width: 200, margin: '10px 0' }}/>
              <a href="https://fuwu.alipay.com">去配置</a>
            </div>

            <div style={{ paddingTop: 20, borderTop: '1px dotted #e7e7eb' }}>
              <a href={'#marketing/brands/activity-view/' + this.props.params.id}>查看营销活动</a>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default ActivitySuccess;
