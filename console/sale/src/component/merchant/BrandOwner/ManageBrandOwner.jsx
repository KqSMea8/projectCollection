import React, {PropTypes} from 'react';
import {Form, Select, Breadcrumb} from 'antd';
import {keepSessionAlive} from '../../../common/utils';
const FormItem = Form.Item;

const TYPEURLMAPPING = {
  'PRECISION': '/main.htm.kb?op_merchant_id=',
  'TICKET': '/main.htm?op_merchant_id=',
  'PREFERENTIAL': '/main.htm?op_merchant_id=',
  'CONSUMEGIFT': '/main.htm?op_merchant_id=',
  'BUY_ONE_SEND_ONE': '/main.htm?op_merchant_id=',
  'MANAGE': '/main.htm?op_merchant_id=',
  'DATABASE': '/goods/ic/index.htm.kb?op_merchant_id=',
  'RANDOM_REDUCE': '/main.htm?op_merchant_id=',
};

const ManageBrandOwner = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
  },

  getInitialState() {
    return {
      // loading: true,
    };
  },

  componentDidMount() {
    keepSessionAlive();
  },

  generateActivityUrl(activityType, pid) {
    let activityUrl = window.APP.kbretailprodUrl + TYPEURLMAPPING[activityType];
    let crmhomeUrl = window.APP.crmhomeUrl + TYPEURLMAPPING[activityType];
    if (activityType === 'PRECISION') {
      activityUrl = crmhomeUrl += pid + '#/marketing/brands/';
    } else if (activityType === 'TICKET') {
      activityUrl += pid + '#/marketing/brands/activity-create/common';
    } else if (activityType === 'PREFERENTIAL') {
      activityUrl += pid + '#/marketing/brands/activity-create/realtime';
    } else if (activityType === 'CONSUMEGIFT') {
      activityUrl += pid + '#/marketing/brands/gift/add';
    } else if (activityType === 'BUY_ONE_SEND_ONE') {
      activityUrl += pid + '#/marketing/brands/bargain/add';
    } else if (activityType === 'MANAGE') {
      activityUrl += pid + '#/marketing/brands/manage';
    } else if (activityType === 'DATABASE') {
      activityUrl = crmhomeUrl += pid + '#/item-management/item-list';
    } else if (activityType === 'RANDOM_REDUCE') {
      activityUrl += pid + '#/marketing/brands/reduction/add';
    }
    return activityUrl;
  },

  // scrollToCreateView() {
  //   setTimeout(()=> {
  //     window.scrollTo(0, 100);
  //   }, 0);
  // },

  handleChange(value) {
    const pid = this.props.location.query.pid;
    if (pid) {
      // this.scrollToCreateView();
      this.setState({
        hideCrmhomePage: false,
        activityUrl: this.generateActivityUrl(value, pid),
        // loading: false,
      });
    }
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    // const {loading} = this.state;
    return (<div>
      <div className="app-detail-content-padding, app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="#/merchant/brandOwner">品牌商</Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.location.query.merchantName || 'null'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="kb-list-main">
        <Form inline>
          <FormItem label="活动类型：">
            <Select placeholder="请选择你需要管理的类型" style={{width: 400}} allowClear= "true"
              {...getFieldProps('activityType', {
                onChange: this.handleChange,
              })}>
              <Option key="PRECISION">精准营销</Option>
              <Option key="TICKET">单品券</Option>
              <Option key="PREFERENTIAL">买单优惠</Option>
              <Option key="CONSUMEGIFT">消费送礼</Option>
              <Option key="BUY_ONE_SEND_ONE">买一送一</Option>
              <Option key="RANDOM_REDUCE">随机立减</Option>
              <Option key="MANAGE">营销管理</Option>
              <Option key="DATABASE">商品库</Option>
            </Select>
          </FormItem>
        </Form>
        {getFieldValue('activityType') === undefined && (<div style={{
          marginTop: 16,
          textAlign: 'center',
          height: 440,
          lineHeight: '440px',
          border: '1px dashed #d9d9d9',
          color: '#ccc',
          backgroundColor: '#fbfbfb',
          fontSize: 14,
        }}>未选择活动类型</div>)}
        {getFieldValue('activityType') !== undefined && (<div style={{position: 'relative'}}>
          <iframe src={this.state.activityUrl} style={{display: this.state.hideCrmhomePage ? 'none' : 'block'}} id="crmhomePage" width="100%" height="1273" scrolling="no" border="0" frameBorder="0"></iframe>
        </div>)}
      </div>
    </div>);
  },
});

export default Form.create()(ManageBrandOwner);
