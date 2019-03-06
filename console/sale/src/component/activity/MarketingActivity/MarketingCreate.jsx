import React, {PropTypes} from 'react';
import { Form, Select, Row, Col, message } from 'antd';
import classnames from 'classnames';
import PidSelect from '../../../common/PidSelect';
import { getQueryFromURL, keepSessionAlive } from '../../../common/utils';
import {addQueryParams} from '../../../common/urlUtils';
import ajax from 'Utility/ajax';

const FormItem = Form.Item;
const Option = Select.Option;

const TYPE2URLMAPPING = {
  'CONSUMPTION': '/main.htm.kb#/marketing-activity/consume/create',
  'BUY_ONE_SEND_ONE': '/main.htm.kb#/marketing-activity/buygive/create',
  'MONEY_VOUCHER': '/main.htm.kb#/marketing-activity/vouchers/create',
  'BUY_ITEM_CUT': '/main.htm.kb#/marketing-activity/goods/create',
  'BUY_ITEM_REDUCE_TO': '/main.htm.kb#/marketing-activity/goods/special/create',
  'BK_ITEM_DEDUCT': '/main.htm.kb#/marketing-activity/booking-subtraction/create',
  'BRAND_CART_DISCOUNT': '/main.htm.kb#/marketing-activity/brand-bill-discount/create',
};
let messageHandler = null;

const MarketingCreate = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      hideCrmhomePage: true,
      disableMarketingTypeSelect: true,
      list: [],
    };
  },

  componentDidMount() {
    keepSessionAlive();
    messageHandler = e => { // eslint-disable-line
      try {
        const postData = JSON.parse(e.data);
        const action = postData.action;
        switch (action) {
        case 'warning':
        case 'warn': {
          message.warn(postData.message);
          break;
        }
        case 'error': {
          message.error(postData.message);
          break;
        }
        case 'success': {
          message.success(postData.message);
          break;
        }
        case 'goback': {
          const params = getQueryFromURL(this.props.location.search); // fromUrl 覆盖掉所有跳转逻辑
          const fromUrl = params.fromUrl;
          if (fromUrl) {
            location.href = fromUrl;
          } else if (postData.url && postData.url.indexOf('#/') === 0) {
            location.hash = postData.url;
          } else if (postData.url) {
            location.href = postData.url;
          } else {
            this.props.history.goBack();
          }
          break;
        }
        default:
        }
      } catch (err) {console.log(err);}
    };
    window.addEventListener('message', messageHandler);
  },

  componentWillUnmount() {
    if (messageHandler) {
      window.removeEventListener('message', messageHandler);
    }
  },

  getSelectableList(pid) {
    if (!pid) return;

    ajax({
      url: `/sale/merchant/queryActivityList.json`,
      method: 'get',
      data: {
        merchantId: pid,
      },
      type: 'json',
      success: (res) => {
        if (!res) {
          return;
        }
        if (res.status && res.status === 'succeed') {
          this.setState({
            list: res.data,
          });
        } else {
          if (res.errorMsg) {
            message.error(res.errorMsg, 3);
          }
        }
      },
    });
  },

  handlePidSelectChange(value) {
    const oldVal = this.props.form.getFieldValue('partnerIdVal');
    if (value && (oldVal !== value[1])) {
      this.props.form.setFieldsValue({
        partnerIdVal: value[1],
      });
      this.setState({disableMarketingTypeSelect: false});
      this.props.form.resetFields(['marketingType']);
      // 获取活动类型列表
      this.getSelectableList(value[1]);
    }
  },

  scrollToCreateView() {
    setTimeout(()=> {
      window.scrollTo(0, 340);
    }, 0);
  },

  handleChange(value) {
    const partnerId = this.props.form.getFieldValue('partnerIdVal');
    if (partnerId) {
      this.scrollToCreateView();
      const url = addQueryParams(window.APP.crmhomeUrl + TYPE2URLMAPPING[value], {
        op_merchant_id: partnerId,
      });
      this.setState({
        hideCrmhomePage: false,
        url,
      });
    }
  },

  render() {
    const {getFieldError, getFieldProps} = this.props.form;
    const { list } = this.state;
    getFieldProps('partnerIdVal');
    return (
      <div>
        <div className="app-detail-header">
          新增营销活动
        </div>
        <div className="kb-detail-main" style = {{paddingBottom: 0}}>
          <Form horizontal>
            <Row>
              <Col span="12" offset = "2">
                <FormItem
                  labelCol={{span: 8}}
                  wrapperCol={{span: 16}}
                  validateStatus={
                  classnames({
                    error: !!getFieldError('partnerId'),
                  })}
                  required
                  label="选择商户：">
                  <PidSelect form={this.props.form} onChange={this.handlePidSelectChange}/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span = "12" offset = "2">
                <FormItem
                  labelCol={{span: 8}}
                  wrapperCol={{span: 16}}
                  required
                  label="活动类型：">
                  <Select
                    {...getFieldProps('marketingType', {
                      onChange: this.handleChange,
                    })}
                    style={{width: '100%'}} placeholder="请选择" disabled = {this.state.disableMarketingTypeSelect}>
                    {
                      list.map(item => <Option value={item.key} key={item.key}>{item.name}</Option>)
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <h3 className="kb-form-sub-title">
            <div className="kb-form-sub-title-icon"/>
            <span className="kb-form-sub-title-text">基本属性</span>
            <div className="kb-form-sub-title-line"/>
          </h3>
        </div>
        <iframe src={this.state.url} style={{display: this.state.hideCrmhomePage ? 'none' : 'block'}} id="crmhomePage" width="100%" height="1273" scrolling="no" border="0" frameBorder="0"/>
      </div>
    );
  },
});

export default Form.create()(MarketingCreate);
