import React from 'react';
import { Icon } from 'antd';

const ActivityTestSuccess = React.createClass({
  render() {
    return (
      <div className="kb-activity-success">
        <div className="kb-detail-main">
          <div style={{ padding: '20px 0 20px 30px', backgroundColor: '#e1f2ff', fontSize: 18, border: '1px solid #efefef'}}>
            <Icon type="check-circle" style={{ marginRight: 5, color: '#0ae', fontSize: 22 }} />活动生成测试成功
            <div style={{fontSize: '14px', marginLeft: 30}}>
              <p style={{ color: '#666'}}>系统将在您选择的门店下生成测试优惠，该优惠仅对测试名单可见。您可在折扣管理中查看测试优惠的情况。</p>
              <a style={{ marginTop: '10px', display: 'inline-block'}} href="/goods/itempromo/testList.htm">配置测试名单</a>
            </div>

          </div>

          <div style={{ padding: '10px', fontSize: '14px', color: '#666'}}>
            <h4 style={{marginBottom: '15px', color: '#666'}}>测试方法</h4>

            <ul>
              <li>1.使用测试名单中的账号打开支付宝客户端，在您的店铺下领取测试优惠（若品牌商发布的是实时优惠则无需领取）。</li>
              <li>2.选择品牌商优惠中指定的商品，使用测试账号买单，验证券是否能正确核销，规则是否满足。</li>
              <li>3.每个门店有10次测试机会，测试中商品的优惠差价由零售商自行承担。</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
});

export default ActivityTestSuccess;
