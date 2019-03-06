import React, { Component } from 'react';
import { Form, Spin, Button, Icon, message as msg, Modal } from 'antd';
import ajax from '../../../common/ajax';
import FormBanner from '../../MarketingActivity/common/FormBanner';
import FullCourtFormCfg from './FullCourtFormCfg';
import RuleSetFormCfg from './RuleSetFormCfg';
import OtherToFormCfg from './OtherToFormCfg';
import componentGetter from '../common/ComponentGetter';
import CommonSimulator from '../../MarketingActivity/common/CommonSimulator';
import { keepSession, fixFrameHeight, getUriParam, getImageById } from '../../../common/utils';
import { debounce } from 'lodash';
// import AdviseExtra from '../common/AdviseExtra';

const message = { ...msg };
if (window.top !== window) {
  ['error', 'warning', 'success'].forEach(f => {
    message[f] = function iframeMessage(text) {
      window.parent.postMessage(JSON.stringify({ action: f, message: text }), '*');
    };
  });
}
const fixFrameHeightDebounced = debounce(fixFrameHeight, 200);
const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};
const FormItem = Form.Item;

function toNumber(str) {
  if (str && str > 0) {
    return Number(str);
  }
}

class FullCourtDiscount extends Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      isLoading: true,      // 读取数据库默认回填值
      isPostLoading: false, // 提交 loading
      // shop: [],
      data: null,
    };
    // this.pid = getUriParam('op_merchant_id', location.search);
    this.leadsId = getUriParam('leadsId', this.props.history.search);
  }

  componentDidMount() {
    if (window.top !== window) {
      fixFrameHeightDebounced();
      window.top.postMessage(JSON.stringify({ action: 'scrollTop', scrollTop: 0 }), '*');
    }
    this.fetch();
    keepSession();
  }

  /*eslint-disable */
  setFormInitValue = (values) => {
    /*eslint-enable */
    const { setFieldsValue } = this.props.form;
    const formValues = {
      rate: toNumber(values.rate), // 折扣力度
      roundingMode: values.roundingMode || '0', // 抹零规则
      shopIds: values.shopIds,
      brandName: values.brandName || '',// 品牌名称
      useMode: values.useMode || '0', // 使用方式
      actived: values.actived || '0', // 领取生效
      renewMode: values.renewMode || '1', // 自动续期
      payChannel: values.payChannel || '1', // 渠道限制
      donateFlag: values.donateFlag, // 允许转让
      name: values.name,// 备注
      descList: values.descList,// 使用须知
      deliveryChannels: values.deliveryChannels || ['SHOP_DETAIL'], // 在口碑门店露出
      validTimeType: values.validTimeType || 'RELATIVE',
      availableTimeType: values.availableTimeType || '1',
    };
    if (values.startTime) {// 上架时间
      formValues.startTime = values.startTime;
    }
    if (values.endTime) {
      formValues.endTime = values.endTime;
    }
    if (values.logoFileId) {// 券logo
      formValues.logoFileId = [{
        id: values.logoFileId,
        uid: values.logoFileId,
        status: 'done',
        url: getImageById(values.logoFileId),
      }];
    }

    if (values.budgetAmount) {  // 发放总量
      formValues.budgetAmountType = '1';
      formValues.budgetAmount = toNumber(values.budgetAmount);
    }

    if (values.forbiddenTime) { // 不可用日期
      formValues.forbiddenTimeType = '1';
      formValues.forbiddenTime = values.forbiddenTime.split('^').map(d => d.split(','));
    } else {
      formValues.forbiddenTimeType = '0';
    }

    if (values.receiveLimited) {// 领取限制
      formValues.receiveLimitedType = '1';
      formValues.receiveLimitedValue = values.receiveLimited;
    } else {
      formValues.receiveLimitedType = '0';
    }

    if (values.dayReceiveLimited) {// 每日领取限制
      formValues.dayReceiveLimitedType = '1';
      formValues.dayReceiveLimitedValue = values.dayReceiveLimited;
    } else {
      formValues.dayReceiveLimitedType = '0';
    }

    if (values.availableTimes) {  // 可用时段
      formValues.availableTimes = values.availableTimes.map(d => ({
        days: d.values.split(','),
        endTime: d.times.split(',')[1],
        startTime: d.times.split(',')[0],
      }));
    } else {
      formValues.availableTimeType = '1';
    }

    if (values.minimumAmount) { // 最低消费金额
      formValues.minimumAmountType = '1';
      formValues.minimumAmount = toNumber(values.minimumAmount);
    }

    if (values.displayAmount) { // 最高优惠
      formValues.displayAmountType = '1';
      formValues.displayAmount = toNumber(values.displayAmount);
    }

    if (values.validTimeType === 'RELATIVE') {
      formValues.validPeriod = toNumber(values.validPeriod);
    }

    if (values.validTimeType === 'FIXED') {
      formValues.validTime = [values.validTimeFrom, values.validTimeTo];
    }
    setFieldsValue(formValues);
  }

  goBack = () => {
    const fromUrl = getUriParam('fromUrl', this.props.location.search);
    let url = '#/intelligentcatering/list';
    if (fromUrl) {
      url = fromUrl;
    }
    if (window.top !== window) {
      window.top.postMessage(JSON.stringify({ action: 'goback', url }), '*');
    } else {
      location.hash = url;
    }
  }

  fetch = () => {
    const fetchUrl = '/goods/koubei/queryMovehomeDetail.json';
    const data = {
      leadsId: this.leadsId,
    };
    this.setState({
      isLoading: true,
    });
    ajax({
      // url: 'http://pickpost.alipay.net/mock/tuanjie.test/goods/koubei/queryMovehomeDetail.json',
      url: fetchUrl,
      method: 'POST',
      type: 'json',
      data: data,
      success: res => {
        if (res && res.data && res.status === 'succeed') {
          this.setState({
            // shop: res.data.cityShop,
            data: res.data,
          });
          this.setFormInitValue(res.data);
        }
        this.setState({
          isLoading: false,
        });
      },
      error: error => {
        this.setState({
          isLoading: false,
        });
        message.error(error && error.resultMsg || '系统繁忙，请稍后重试。');
      },
    });
  }

  handleSave(params) {
    ajax({
      url: '/goods/koubei/submitMovehome.json',
      method: 'post',
      type: 'json',
      data: {
        leadsId: this.leadsId,
        type: 'RATE',
        formData: JSON.stringify(params),
      },
      success: res => {
        if (res && res.status === 'succeed') {
          message.success('提交成功');
          setTimeout(this.goBack, 3000);
        } else {
          message.warning(res && res.resultMsg ? res.resultMsg : '提交失败');
        }
        this.setState({
          isPostLoading: false,
        });
      },
      error: err => {
        if (err && err.resultMsg) {
          message.warning(err.resultMsg);
        } else {
          message.warning('系统繁忙，请稍后重试。');
        }
        this.setState({
          isPostLoading: false,
        });
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    /* eslint-disable */
    this.props.form.validateFieldsAndScroll({ force: true }, (error, values) => {
      /* eslint-enable */
      if (error) {
        message.error('请检查填写项');
        return;
      }
      const params = {
        rate: values.rate + '',
        roundingMode: values.roundingMode,
        shopIds: values.shopIds,
        brandName: values.brandName,
        logoFileId: values.logoFileId && values.logoFileId[0].id,
        budgetAmount: values.budgetAmount,
        startTime: values.startTime,
        endTime: values.endTime,
        useMode: values.useMode,
        actived: values.actived,
        renewMode: values.validTimeType === 'FIXED' ? undefined : values.renewMode,
        payChannel: values.payChannel,
        availableTimeType: values.availableTimeType || '1',
        donateFlag: values.donateFlag,
        name: values.name,
        descList: (values.descList || []).filter(d => !!d),
        validTimeType: values.validTimeType,
      };
      if (values.validTimeType === 'RELATIVE') {
        params.validPeriod = values.validPeriod;
      }
      if (values.validTimeType === 'FIXED') {
        params.validTimeFrom = values.validTime[0];
        params.validTimeTo = values.validTime[1];
      }
      if (values.availableTimeType !== '1') {
        params.availableTimes = values.availableTimes.map(d => ({
          times: `${d.startTime},${d.endTime}`,
          values: d.days.join(','),
        }));
      }
      if (values.forbiddenTimeType === '1') {
        params.forbiddenTime = values.forbiddenTime.map(d => d.join(',')).join('^');
      }
      if (values.deliveryChannels && values.deliveryChannels.length > 0) {
        params.deliveryChannels = values.deliveryChannels;
      }
      if (values.minimumAmountType === '1') {
        params.minimumAmount = values.minimumAmount;
      }
      if (values.displayAmountType === '1') { // 最高优惠
        params.displayAmount = values.displayAmount;
      }
      if (values.receiveLimitedValue) {
        params.receiveLimited = values.receiveLimitedValue;
      }
      if (values.dayReceiveLimitedValue) {
        params.dayReceiveLimited = values.dayReceiveLimitedValue;
      }

      this.setState({
        isPostLoading: true,
      });

      Modal.confirm({
        title: '是否确认上架此折扣券',
        content: window.top !== window ? (
          <p>
            提交成功后，需等待商户确认<br />
            也可以主动联系商户进行确认，加快代金券上架时间。
            </p>
        ) : null,
        onOk: () => {
          this.handleSave(params);
        },
        onCancel: () => {
          this.setState({
            isPostLoading: false,
          });
        },
        style: window.top !== window ? { top: window.top.scrollY } : undefined,
      });
    });
  }

  renderForm = () => {
    const { isPostLoading, data } = this.state;
    return (
      <div style={{ marginTop: '32px', marginBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <CommonSimulator
          caption="口碑全场折扣展示页面"
          background="https://os.alipayobjects.com/rmsportal/QuAamNPNrupyedR.png"
          withScroll
        />
        <Form onSubmit={this.handleSubmit} style={{ float: 'left', width: '600px', marginLeft: '40px' }} form={this.props.form} horizontal>
          <FormBanner>
            基本信息
          </FormBanner>
          {FullCourtFormCfg.map(d => {
            if (d.key === 'SelectShopsAsync') {
              d.defaultValue = data && data.cityShop || [];
              d.limitMode = 0; // 一件搬家传0，接口下发淮海和无证
            }
            if (d.key === 'CheckboxRenewal' && this.props.form.getFieldValue('validTimeType') === 'FIXED') {
              // 如果券有效期为指定时间，则不需要自动续期
              return null;
            }
            return componentGetter({ ...d, ...formItemLayout }, this);
          })}
          <FormBanner>
            规则设置
          </FormBanner>
          <p style={{ fontSize: 14, paddingLeft: '10%', paddingBottom: 20 }}>
            <Icon type="info-circle" style={{ color: '#2db7f5' }} />
            <span style={{ padding: '0px 8px' }}>常规安全及领取限制将由系统自动设置，无需商家设置</span>
            <a href="https://help.koubei.com/takeaway/knowledgeDetail.htm?knowledgeId=201602048802" target="_blank">查看帮助</a>
          </p>
          {RuleSetFormCfg.map(d => {
            // if (d.key === 'UseTheTime' && data && data.availableTimeTip &&
            //   data.availableTimeTip.value && data.availableTimeTip.value.length > 0 &&
            //   data.availableTimeTip.value[0]) { // 券可用时段
            //   d.extra = (
            //     <AdviseExtra>
            //       {data.availableTimeTip.value.join('；')}
            //     </AdviseExtra>
            //   );
            // }
            // if (d.key === 'InvalidDate' && data && data.unavailableTimeTip &&
            //   data.unavailableTimeTip.value && data.unavailableTimeTip.value.length > 0 &&
            //   data.unavailableTimeTip.value[0]) {  // 不可用时间
            //   d.extra = (
            //     <AdviseExtra>
            //       {data.unavailableTimeTip.value.join('；')}
            //     </AdviseExtra>
            //   );
            // }
            return componentGetter({ ...d, ...formItemLayout }, this);
          })}
          <FormBanner>
            其他设置
          </FormBanner>
          {OtherToFormCfg.map(d => componentGetter({ ...d, ...formItemLayout }, this))}
          <FormItem wrapperCol={{ span: 15, offset: 6 }}>
            <Button type="primary" htmlType="submit" loading={isPostLoading} disabled={isPostLoading}>
              提 交
            </Button>
            <p style={{ fontSize: 14, paddingTop: 20 }}>
              <Icon type="info-circle" style={{ color: '#2db7f5' }} />
              <span style={{ paddingLeft: '8px', color: '#1a1a1a' }}>提交活动时可同时创建测试活动</span>
            </p>
          </FormItem>
        </Form>
      </div>
    );
  }

  render() {
    window.f = this.props.form;
    fixFrameHeightDebounced();
    return (
      <div className="kb-detail-main" style={{ overflow: 'hidden' }}>
        {
          this.state.isLoading ? <div style={{ textAlign: 'center', marginTop: 80 }}><Spin /></div>
            : this.renderForm()
        }
      </div>
    );
  }
}

export default Form.create()(FullCourtDiscount);
