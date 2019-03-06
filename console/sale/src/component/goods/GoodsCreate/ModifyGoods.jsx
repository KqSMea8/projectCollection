import React, {PropTypes} from 'react';
import { Form, Row, Col } from 'antd';
import {typeMap} from '../common/GoodsConfig';

const TYPE2URLMAPPING = {
  'RATE': '/goods/itempromo/modify.htm.kb',
  'SINGLE_DISCOUNT': '',
  'EXCHANGE': '',
};

const ModifyGoods = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const {itemId, opMerchantId, discountType} = this.props.params;
    return {
      discountUrl: window.APP.crmhomeUrl + TYPE2URLMAPPING[discountType] + '?itemId=' + itemId + '&op_merchant_id=' + opMerchantId,
    };
  },

  render() {
    return (
      <div>
        <div className="app-detail-header">
          修改商品
        </div>
        <div className="kb-detail-main" style = {{paddingBottom: 0}}>
          <Form horizontal>
            <Row>
              <Col span="12" offset = "3" style={{marginBottom: 15, marginTop: 10}}>
                选择商户：商户名称（PID：{this.props.params.opMerchantId}）
              </Col>
            </Row>
            <Row>
              <Col span = "12" offset = "3">
                商品类型：{typeMap[this.props.params.discountType]}
              </Col>
            </Row>
          </Form>
          <h3 className="kb-form-sub-title">
            <div className="kb-form-sub-title-icon"></div>
            <span className="kb-form-sub-title-text">基本属性</span>
            <div className="kb-form-sub-title-line"></div>
          </h3>
        </div>
        <iframe src={this.state.discountUrl} id="crmhomePage" scrolling="no" width="100%" height="1129" border="0" frameBorder="0"></iframe>
      </div>
    );
  },
});

export default ModifyGoods;
