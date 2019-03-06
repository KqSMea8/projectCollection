import React, { PropTypes } from 'react';
import { Form, Select, Row, Col } from 'antd';
import classnames from 'classnames';
import PidSelect from '../../../common/PidSelect';
import ajax from 'Utility/ajax';
import { keepSessionAlive } from '../../../common/utils';

const FormItem = Form.Item;
const Option = Select.Option;

const TYPE2URLMAPPING = {
  'RATE': '/goods/itempromo/create.htm.kb',
  'SINGLE_DISCOUNT': '/goods/itempromo/singleCreate.htm.kb?type=0',
  'EXCHANGE': '/goods/itempromo/exchangeCreate.htm.kb',
  'CASH': '/goods/itempromo/singleCreate.htm.kb?type=5',
};

const TYPE2TEXT = {
  'RATE': '全场折扣',
  'SINGLE_DISCOUNT': '单品折扣',
  'EXCHANGE': '兑换劵',
  'CASH': '单品代金',
};

const CreateGoods = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  getInitialState() {
    return {
      hideCrmhomePage: true,
      disableGoodsTypeSelect: true,
      goodsTypeList: [],
    };
  },
  componentDidMount() {
    keepSessionAlive();
  },
  handlePidSelectChange(value) {
    const oldVal = this.props.form.getFieldValue('partnerIdVal');
    if (value && (oldVal !== value[1])) {
      this.props.form.setFieldsValue({
        partnerIdVal: value[1],
      });
      this.props.form.resetFields(['goodsType']);
      this.fetchGoodsTypeList(value[1]);
    }
  },

  generateGoodsUrl(goodsType, opMerchantId) {
    let goodsUrl = window.APP.crmhomeUrl + TYPE2URLMAPPING[goodsType];
    if (goodsType === 'SINGLE_DISCOUNT' || goodsType === 'CASH') {
      goodsUrl += '&op_merchant_id=' + opMerchantId;
    } else {
      goodsUrl += '?op_merchant_id=' + opMerchantId;
    }
    return goodsUrl;
  },
  fetchGoodsTypeList(opMerchantId) {
    const url = window.APP.crmhomeUrl + '/goods/koubei/itemTypeList.json?op_merchant_id=' + opMerchantId;
    ajax({
      url: url,
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result && result.status && result.status === 'succeed') {
          this.setState({
            goodsUrl: '',
            hideCrmhomePage: true,
            goodsTypeList: result.data,
            disableGoodsTypeSelect: false,
          });
        } else {
          this.setState({
            goodsUrl: '',
            hideCrmhomePage: true,
            disableGoodsTypeSelect: true,
          });
        }
      },
    });
  },
  scrollToCreateView() {
    setTimeout(() => {
      window.scrollTo(0, 340);
    }, 0);
  },

  handleChange(value) {
    const partnerId = this.props.form.getFieldValue('partnerIdVal');
    if (partnerId) {
      this.scrollToCreateView();
      this.setState({
        hideCrmhomePage: false,
        goodsUrl: this.generateGoodsUrl(value, partnerId),
      });
    }
  },

  render() {
    const {getFieldError, getFieldProps} = this.props.form;
    getFieldProps('partnerIdVal');
    return (
      <div>
        <div className="app-detail-header">
          创建优惠券
        </div>
        <div className="kb-detail-main" style={{ paddingBottom: 0 }}>
          <Form horizontal>
            <Row>
              <Col span="12" offset="2">
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  validateStatus={
                    classnames({
                      error: !!getFieldError('partnerId'),
                    })}
                  required
                  label="选择商户：">
                  <PidSelect form={this.props.form} onChange={this.handlePidSelectChange} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12" offset="2">
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  required
                  label="优惠券类型：">
                  <Select
                    {...getFieldProps('goodsType', {
                      onChange: this.handleChange,
                    }) }
                    style={{ width: '100%' }} placeholder="请选择" disabled={this.state.disableGoodsTypeSelect}>
                    {
                      this.state.goodsTypeList.map((p) => {
                        return (<Option key={p} value={p}>{TYPE2TEXT[p]}</Option>);
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <h3 className="kb-form-sub-title">
            <div className="kb-form-sub-title-icon"></div>
            <span className="kb-form-sub-title-text">基本属性</span>
            <div className="kb-form-sub-title-line"></div>
          </h3>
        </div>
        <iframe src={this.state.goodsUrl} style={{ display: this.state.hideCrmhomePage ? 'none' : 'block' }} id="crmhomePage" width="100%" height="1273" scrolling="no" border="0" frameBorder="0"></iframe>
      </div>
    );
  },
});

export default Form.create()(CreateGoods);
