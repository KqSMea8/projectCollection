import React from 'react';
import {Row, Col} from 'antd';
import {Link} from 'react-router';

import './apply-steps.less';

export default function ApplySteps() {
  return (
    <div className="mod-content apply-steps">
      <h3 className="mod-title">申请流程</h3>
      <Row gutter={16} type="flex">
        <Col span={8} className="apply-step-box">
          <div className="apply-step">
            <img src="https://gw.alipayobjects.com/zos/rmsportal/YCfRdiAIuSEXvzXlpWEm.png" width="70" />
            <h4 className="step-title">授权合作</h4>
            <p className="step-info">同意与一体机系统商合作<br/>获取设备中的软件服务</p>
          </div>
        </Col>
        <Col span={8} className="apply-step-box">
          <div className="apply-step">
            <img src="https://gw.alipayobjects.com/zos/rmsportal/XHXIReLaXbdkswSLwHXn.png" width="70" />
            <h4 className="step-title">设置后台</h4>
            <p className="step-info">配置餐台、菜品、支付、人员等信息</p>
          </div>
        </Col>
        <Col span={8} className="apply-step-box">
          <div className="apply-step">
            <img src="https://gw.alipayobjects.com/zos/rmsportal/EHOAaJEbyMLeKSgTcgJi.png" width="70" />
            <h4 className="step-title">激活设备</h4>
            <p className="step-info">请先自行购买设备<br/>激活&绑定门店，即可营业</p>
            <p className="step-info"><Link to="/help" query={{from: 'home'}}>查看激活方式</Link></p>
          </div>
        </Col>
      </Row>
    </div>
  );
}
