import React, { PropTypes } from 'react';
import { Icon } from 'antd';

import './Simulator.less';

const Simulator = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  render() {
    const { getFieldValue } = this.props.form;

    return (
      <div className="simulator-wrap">
        <div className="new-simulator">
          <img className="sim-header" src="https://zos.alipayobjects.com/rmsportal/MbfdhIdiJTJtfFS.png" alt=""/>
          <div className="phone-content">
            <div className="inner-content">
              {
                (getFieldValue('vouchers.voucherLogoArr') && getFieldValue('vouchers.voucherLogoArr').length > 0) ?
                  <img className="brand-logo" src={`http://dl.django.t.taobao.com/rest/1.0/image?fileIds=${getFieldValue('vouchers.voucherLogoArr')[0].id}`} alt="品牌logo"/>
                  :
                  <div className="brand-logo">品牌logo</div>
              }
              <h5 className="brand-name">{getFieldValue('vouchers.brandName') || '#品牌名称#'}</h5>
              <h5 className="item-name">{getFieldValue('vouchers.itemName') || '#活动商品名称#'}</h5>
              <h5 className="camp-type">买{getFieldValue('sendRules.buyCnt') || 1}送{getFieldValue('sendRules.sendCnt') || 1}</h5>
              <div className="buy-btn">去买单</div>
              <h5 className="valid-date">
                {getFieldValue('startTime') && getFieldValue('endTime') ?
                '有效期 ' + getFieldValue('startTime') + '至' + getFieldValue('endTime')
                  :
                  '#有效期#'
                }
              </h5>
              <img className="gutter" src="https://zos.alipayobjects.com/rmsportal/GdOZHvfTcbGTRpl.png" alt=""/>
              <div style={{background: '#fff'}}>
                <ul className="c-notice">
                  <li>&bull;  温馨提示：请拿着购买商品和赠品一起去收银台结账</li>
                  <li>&bull;  1笔订单最多{getFieldValue('itemDiscountRule.totalLimitCnt') || '几' }件商品可享受优惠</li>
                  <li>&bull;  1笔订单同一商品最多送{getFieldValue('sendRules.limitCnt') || '几'}件</li>
                </ul>
                <ul className="entrance">
                  <li>
                    <div style={{marginBottom: 3}}>商品详情 <Icon type="right" className="my-icon" /> </div>
                    <div className="item-detail">{getFieldValue('vouchers.itemDetail')}</div>
                    {
                      getFieldValue('vouchers.voucherImg') ?
                        <img className="item-image" src={`http://dl.django.t.taobao.com/rest/1.0/image?fileIds=${getFieldValue('vouchers.voucherImg')}`} alt="" />
                        :
                        <div className="placeimg">
                          #活动商品封面图#
                        </div>
                    }
                  </li>
                  <li>
                    <div>适用门店 <Icon type="right" className="my-icon" /> </div>
                  </li>
                  <li>
                    <div>使用须知 <Icon type="right" className="my-icon" /> </div>
                  </li>
                </ul>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Simulator;
