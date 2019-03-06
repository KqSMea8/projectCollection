import React, { PropTypes, Component } from 'react';
import { Form, message, Row, Breadcrumb, Icon, Col, Spin, Button, Modal } from 'antd';
import ajax from '../../../common/ajax';
import * as _ from 'lodash';
import CommonSimulator from '../common/CommonSimulator';
import { customLocation } from '../../../common/utils';
import FormBanner from '../common/FormBanner';
import { itemLayout } from './items/ExchangeConfig';
import CouponNameItem from './items/CouponNameItem';
import BackgroundImgItem from './items/BackgroundImgItem';
import SelectShopsItem from './items/SelectShopsItem';
import { flattenData } from '../../../common/SelectShops';
import OnlineTimeItem from './items/OnlineTimeItem';
import ValidTimeItem from './items/ValidTimeItem';
import BudgetAmountItem from './items/BudgetAmountItem';
import VerifyModeItem from './items/VerifyModeItem';
import RenewModeItem from './items/RenewModeItem';
import ReceiveLimitedItem from './items/ReceiveLimitedItem';
import DonateFlagItem from './items/DonateFlagItem';
import DescListItem from './items/DescListItem';
import moment from 'moment';

const getTimeFromDefaultData = (dateString) =>
  dateString ?
    moment(dateString, 'YYYY-MM-DD HH:mm').toDate() :
    undefined;

const transformDefaultData = (data) => {
  return {
    [CouponNameItem.fieldName]: data.subject,
    [BackgroundImgItem.fieldName]: data.realLogoFileId ? [{
      id: data.realLogoFileId,
      uid: data.realLogoFileId,
      url: data.logoFileId,
    }] : [],
    [DescListItem.fieldName]: data.descList || [''],
    [SelectShopsItem.fieldName]: data.cityShop || [],
    [OnlineTimeItem.fieldName.START_TIME]: getTimeFromDefaultData(data.startTime),
    [OnlineTimeItem.fieldName.END_TIME]: getTimeFromDefaultData(data.endTime),
    [ValidTimeItem.fieldName.VALID_TIME_FROM]: getTimeFromDefaultData(data.validTimeFrom),
    [ValidTimeItem.fieldName.VALID_TIME_TO]: getTimeFromDefaultData(data.validTimeTo),
    [ValidTimeItem.fieldName.VALID_TIME_TYPE]: data.validTimeType,
    [ValidTimeItem.fieldName.VALID_PERIOD]: data.validPeriod,
    [BudgetAmountItem.fieldName]: Number(data.budgetAmount),
    [VerifyModeItem.fieldName]: data.verifyMode,
    [ReceiveLimitedItem.fieldName]: data.receiveLimited,
    [DonateFlagItem.fieldName]: data.donateFlag,
    shopIds: data.shopIds,
  };
};

class NewExchange extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      initialData: null,
      loading: this.isEdit,
      submitting: false,
      isOnline: false,
    };
  }

  componentDidMount() {
    if (this.isEdit) {
      NewExchange.fetch(this.props.params.id, this);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.route.path === 'marketing-activity/exchange/:id'
      && this.props.params.id !== nextProps.params.id
    ) {
      NewExchange.fetch(nextProps.params.id, this);
    }
  }

  static fetch = (id, ctx) => {
    const url = `/goods/itempromo/modifyexchangeinit.json?itemId=${id}`;
    ajax({
      url: url,
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed' && res.discountForm) {
          const defaultData = transformDefaultData(res.discountForm);
          ctx.setState({
            loading: false,
            initialData: Object.assign({ }, res.discountForm, defaultData),
          });
          ctx.props.form.setFieldsInitialValue(defaultData);
        } else {
          message.error(res.errorMsg || '获取数据失败', 3);
        }
      },
    });
  }

  wrapperFormItems(componentType, props = {}) {
    return React.createElement(componentType,
      Object.assign({
        initialData: this.state.initialData,
        form: this.props.form,
      }, props, {
        isReadyToOnline: this.isReadyToOnline,
        isOnline: this.isOnline,
        isEdit: this.isEdit,
      }));
  }

  forwardToManage(e) {
    if (e) {
      e.preventDefault();
    }
    customLocation('/goods/itempromo/activityList.htm');
  }

  submit = (e) => {
    e.preventDefault();
    const form = this.props.form;
    this.props.form.validateFieldsAndScroll((errs, values) => {
      let shopIds = flattenData(form.getFieldValue('shop')).map(d => d.id);
      if (!this.isReadyToOnline || !this.isEdit) { // 兼容脏数据
        shopIds = _.uniq(shopIds.concat(this.state.initialData && this.state.initialData.shopIds || []));
      }
      // 如果把下面这段逻辑删掉则会把后端返回donateFlag的值传给后端
      if (this.isEdit) {// 修改页面不传值给后端了
        if (values.donateFlag) {
          delete values.donateFlag;
        }
      }
      if (!errs) {
        ajax({
          url: '/goods/itempromo/modifyexchange.json',
          method: 'post',
          type: 'json',
          data: {
            itemId: this.props.params.id,
            jsonDataStr: JSON.stringify(Object.assign({ }, values, {
              descList: form.getFieldValue('descList').join(':-)'),
              shopIds: shopIds,
              fileId: values.logoImg[0].id,
              backgroundImgUrl: values.logoImg[0].url,
              shop: undefined,
              logoImg: undefined,
              renewMode: values[ValidTimeItem.fieldName.VALID_TIME_TYPE] === 'RELATIVE' ? form.getFieldValue(RenewModeItem.fieldName) : undefined,
            }), (field, value) => {
              if (['startTime', 'endTime', 'validTimeTo', 'validTimeFrom'].some(d => field === d)) {
                return moment(value).format('YYYY-MM-DD HH:mm');
              }
              return value;
            }),
          },
          success: (res) => {
            this.setState({
              submitting: false,
            });
            if (res.status === 'succeed') {
              Modal.success({
                title: '提交成功',
                content: '',
                onOk: () => {
                  this.forwardToManage();
                },
              });
            } else {
              message.error(res.errorMsg || '提交失败，请稍后重试');
            }
          },
          error: () => {
            message.error('提交失败，请稍后重试');
            this.setState({ submitting: false });
          },
        });
        this.setState({ submitting: true });
      }
    });
  }

  get isEdit() {
    return this.props.params.id > 0;
  }

  /**
   * 返回券状态，以判断券每个字段是否可修改
   * @readonly
   * @memberOf NewExchange
   */
  get isReadyToOnline() {
    return this.state.initialData
      && this.state.initialData.itemStatus === 'READY_TO_ONLINE';
  }

  get isOnline() {
    return this.state.initialData && this.state.initialData.itemStatus === 'ONLINE';
  }

  render() {
    const { form } = this.props;
    window.form = form;
    return (
      <div>
        <div className="app-detail-header">营销活动</div>
        <div className="kb-detail-main" style={{ overflow: 'hidden' }}>
          <Breadcrumb>
            <Breadcrumb.Item style={{ fontSize: '14px', color: '#0ae' }}>
              <a onClick={this.forwardToManage}><Icon type="circle-o-left" />营销活动</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ fontSize: '14px' }}>兑换券</Breadcrumb.Item>
          </Breadcrumb>
          {
            this.state.loading ? <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
            :
            <div style={{marginTop: '32px', display: 'flex', justifyContent: 'center'}}>
              <CommonSimulator
                caption="支付宝折扣展示页面"
                background="https://os.alipayobjects.com/rmsportal/jxpvZAOOekyJDrF.png"
              />
              <Form horizontal form={form} style={{float: 'left', width: '600px', marginLeft: '40px'}}>
                <FormBanner>
                  <span style={{ marginRight: 15 }}>券配置</span>
                  <a href="https://cshall.alipay.com/enterprise/help_detail.htm?help_id=580216" target="_blank">什么是兑换券？</a>
                </FormBanner>
                {this.wrapperFormItems(CouponNameItem)}
                {this.wrapperFormItems(BackgroundImgItem)}
                {this.wrapperFormItems(SelectShopsItem, { isEdit: this.isEdit, canReduce: this.isReadyToOnline })}
                {this.wrapperFormItems(OnlineTimeItem)}
                {this.wrapperFormItems(ValidTimeItem)}
                {this.wrapperFormItems(BudgetAmountItem)}
                {this.wrapperFormItems(VerifyModeItem)}
                {this.wrapperFormItems(RenewModeItem)}
                <FormBanner style={{ marginTop: 40 }}>
                  规则设置
                </FormBanner>
                {this.wrapperFormItems(ReceiveLimitedItem)}
                {this.wrapperFormItems(DonateFlagItem)}
                <FormBanner style={{ marginTop: 40 }}>
                  其他设置
                </FormBanner>
                {this.wrapperFormItems(DescListItem)}
                <Row>
                  <Col span={itemLayout.wrapperCol.span} offset={itemLayout.labelCol.offset + itemLayout.labelCol.span}>
                    <Button
                      type="primary"
                      onClick={this.submit}
                      loading={this.state.submitting}
                    >修改</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Form.create()(NewExchange);
