import React from 'react';
import './Index.less';
import { Row, Col, Steps } from 'antd';
const Step = Steps.Step;

const IntroView = React.createClass({
  /* establish() {
    Modal.info({
      title: '联系BD开通服务',
      content: (
          <div>
            <p>您可以通过以下方式联系您的BD，为您开通自动结算服务</p>

            <p>电话：0517-23423425 </p>
            <p>邮箱：dsnfj@alibaba-icn.com</p>
          </div>
      ),
    });
  }, */

  render() {
    return (
        <div className="settlement">
          <h2 className="kb-page-title">
            营销资金自动结算
            <div className="tip">
              本服务由集分宝提供支持
            </div>
          </h2>
          <div className="kb-detail-main">
            <div className="intro">
              <h4>自动结算服务</h4>
              <p>本服务由口碑联合集分宝共同向品牌商推出，是简化品牌促销活动结算、开票流程，帮助品牌商户提高营销效率的工具。</p>
            </div>

            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon" ></div>
              <span className="kb-form-sub-title-text">优势能力</span>
            </h3>

            <div className="entity">
              <Row type="flex" justify="space-around">
                <Col span={6}>
                  <div className="item">
                    <div className="img" style={{backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/gsSJMIbKthjFMuy.png)'}}></div>
                    <h5>营销省钱</h5>
                    <p>解决线下活动无法追溯客源问题，每笔支出都能收获一位真实的顾客，营销资金零浪费</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="item">
                    <div className="img" style={{backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/RCSlUGdeXuNFJtX.png)'}}></div>
                    <h5>沟通省时</h5>
                    <p>通过口碑能够同时触达百万商户，减少活动沟通成本，多城市跨业态参与同期活动更简单</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="item">
                    <div className="img" style={{backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/FnOnmFNuEamNYRo.png)'}}></div>
                    <h5>财务省力</h5>
                    <p>结算对账打款自动化，随时查账，T+1自动结款，快速开票，完全解放财务人力</p>
                  </div>
                </Col>
              </Row>
            </div>

            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon" ></div>
              <span className="kb-form-sub-title-text">收费标准</span>
            </h3>

            <div className="standards" style={{marginLeft: 15, paddingBottom: 20}}>
              本服务由集分宝公司收取实际使用资金的10%作为服务费，口碑公司暂不收取任何费用。
            </div>

            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon" ></div>
              <span className="kb-form-sub-title-text">开通流程</span>
            </h3>
            <Steps>
              <Step title="第一步" description="联系您对接的BD" />
              <Step title="第二步" description="BD为您线下开通服务" />
              <Step title="第三步" description="发布活动时可直接选择服务" />
            </Steps>

            {/* <div className="bottom">
              <Button type="primary" size="large" onClick={this.establish}>联系 BD 开通</Button>
            </div> */}
          </div>
        </div>
    );
  },
});

export default IntroView;
