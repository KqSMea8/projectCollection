import React from 'react';
import {Row, Col} from 'antd';
import {Link} from 'react-router';

import PageLayout from '../../common/layout';

import './index.less';

export default function BOHActivationHelp(props) {
  const {location} = props;
  const {search} = location;
  const title = search.indexOf('from=home') > -1 ? '口碑一体机' : '设备管理';
  const breadcrumb = [
    {
      component: <Link to="/">{title}</Link>,
    },
    {
      title: '了解激活设备',
    },
  ];

  return (
    <PageLayout className="boh-activation-help" breadcrumb={breadcrumb}>
      <div className="mod-content method-activation-code">
        <h3 className="mod-title">使用激活码</h3>
        <Row gutter={32}>
          <Col span={8}>
            <div className="activation-step">
              <h4 className="step-title"><span className="step-title-box">1. 获取激活码</span></h4>
              <p className="step-info">商家中心-一体机-设备管理，找到门店对应激活码</p>
              <p className="step-img">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/XPIbkZgqEcOQjounxFGk.png" width="253" />
              </p>
            </div>
          </Col>
          <Col span={8}>
            <div className="activation-step">
              <h4 className="step-title"><span className="step-title-box">2. 输入激活码</span></h4>
              <p className="step-info">打开一体机设备，输入激活码</p>
              <p className="step-img">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/MiwVehBbAxmciTxxZyFF.png" width="234" />
              </p>
            </div>
          </Col>
          <Col span={8}>
            <div className="activation-step">
              <h4 className="step-title"><span className="step-title-box">3. 激活成功</span></h4>
              <p className="step-info">同意激活协议</p>
              <p className="step-img">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/jfbwwCkmrVgjTqKvFvkQ.png" width="234" />
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </PageLayout>
  );
}
