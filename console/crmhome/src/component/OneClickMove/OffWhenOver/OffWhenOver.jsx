/**
 * 每满减（餐饮）
 */
import React, { Component } from 'react';
import { Form, Spin, Button, message as msg, Modal } from 'antd';
import ajax from '../../../common/ajax';
import FormBanner from '../../MarketingActivity/common/FormBanner';
import OffWhenOverCfg from './OffWhenOverCfg';
import RuleSetFormCfg from './RuleSetFormCfg';
import OtherToFormCfg from './OtherToFormCfg';
import componentGetter from '../common/ComponentGetter';
import CommonSimulator from '../../MarketingActivity/common/CommonSimulator';
import { keepSession, fixFrameHeight, getUriParam, getImageById } from '../../../common/utils';
import { debounce } from 'lodash';

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

class OffWhenOver extends Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      isLoading: true,       // 读取数据库默认回填值
      isPostLoading: false,   // 提交 loading
      shop: [],
    };
    this.leadsId = getUriParam('leadsId', this.props.history.search);
  }

  componentDidMount() {
    if (window.top !== window) {
      window.top.postMessage(JSON.stringify({ action: 'scrollTop', scrollTop: 0 }), '*');
    }
    this.fetch();
    keepSession();
  }

  /* eslint-disable complexity */
  setFormInitValue(values) {
    const { setFieldsValue } = this.props.form;
    const formValues = {
      perConsumeAmount: values.perConsumeAmount || null,
      perDiscountAmount: values.perDiscountAmount || null,
      shopIds: values.shopIds,
      brandName: values.brandName || '',
      useMode: values.useMode || '0',
      renewMode: values.renewMode,
      // allowUseUserGroup: values.allowUseUserGroup || '0',
      payChannel: values.payChannel || '1',
      donateFlag: values.donateFlag,
      name: values.name,
      descList: values.descList,
      // dayAvailableNum: values.dayAvailableNum,
      deliveryChannels: values.deliveryChannels || ['SHOP_DETAIL'],
      validTimeType: values.validTimeType || 'RELATIVE',
    };

    if (values.logoFileId) {
      formValues.logoFileId = [{
        id: values.logoFileId,
        uid: values.logoFileId,
        status: 'done',
        url: getImageById(values.logoFileId),
      }];
    }

    if (values.receiveLimited) {
      formValues.receiveLimitedType = '1';
      formValues.receiveLimitedValue = values.receiveLimited;
    } else {
      formValues.receiveLimitedType = '0';
    }

    if (values.dayReceiveLimited) {
      formValues.dayReceiveLimitedType = '1';
      formValues.dayReceiveLimitedValue = values.dayReceiveLimited;
    } else {
      formValues.dayReceiveLimitedType = '0';
    }

    if (values.forbiddenTime) {
      formValues.forbiddenTimeType = '1';
      formValues.forbiddenTime = values.forbiddenTime.split('^').map(d => d.split(','));
    } else {
      formValues.forbiddenTimeType = '0';
    }

    if (values.availableTimes) {
      formValues.availableTimes = values.availableTimes.map(d => ({
        days: d.values.split(','),
        endTime: d.times.split(',')[1],
        startTime: d.times.split(',')[0],
      }));
      formValues.availableTimeType = '2';
    } else {
      formValues.availableTimeType = '1';
    }

    if (values.validTimeType === 'RELATIVE') {
      formValues.validPeriod = values.validPeriod;
    }
    if (values.validTimeType === 'FIXED') {
      formValues.validTime = [values.validTimeFrom, values.validTimeTo];
    }

    if (values.budgetAmount) {
      formValues.budgetAmountType = '1';
      formValues.budgetAmount = Number(values.budgetAmount);
    }

    if (values.maxDiscountAmount) {
      formValues.ceilingType = 'specific';
      formValues.maxDiscountAmount = values.maxDiscountAmount;
    } else {
      formValues.ceilingType = 'notLimit';
      formValues.maxDiscountAmount = null;
    }

    setFieldsValue(formValues);
  }

  fetch() {
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
            shop: res.data.cityShop,
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

  handleSave(params) {
    ajax({
      url: '/goods/koubei/submitMovehome.json',
      method: 'post',
      type: 'json',
      data: {
        leadsId: this.leadsId,
        type: 'MANJIAN',
        formData: JSON.stringify(params),
      },
      success: res => {
        if (res && res.status === 'succeed') {
          this.setState({
            isPostLoading: false,
          });
          message.success('提交成功');
          setTimeout(this.goBack, 2000);
        } else {
          this.setState({
            isPostLoading: false,
          });
          message.warning(res && res.resultMsg ? res.resultMsg : '提交失败');
        }
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
    this.props.form.validateFieldsAndScroll({ force: true }, (error, values) => {
      if (error) {
        message.error('请检查填写项');
        return;
      }

      const params = {
        perConsumeAmount: values.perConsumeAmount,
        perDiscountAmount: values.perDiscountAmount,
        shopIds: values.shopIds,
        brandName: values.brandName,
        logoFileId: values.logoFileId && values.logoFileId[0].id,
        startTime: values.startTime,
        endTime: values.endTime,
        useMode: values.useMode,
        renewMode: values.validTimeType === 'FIXED' ? undefined : values.renewMode,
        availableTimeType: values.availableTimeType,
        // allowUseUserGroup: values.allowUseUserGroup,
        payChannel: values.payChannel,
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
      // if (values.dayAvailableNum) {
      //   params.dayAvailableNum = values.dayAvailableNum;
      // }
      params.availableTimeType = values.availableTimeType || '1';
      if (params.availableTimeType !== '1') {
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
      if (values.budgetAmountType === '1') {
        params.budgetAmount = String(values.budgetAmount);
      }
      if (values.receiveLimitedValue) {
        params.receiveLimited = values.receiveLimitedValue;
      }
      if (values.dayReceiveLimitedValue) {
        params.dayReceiveLimited = values.dayReceiveLimitedValue;
      }
      if (values.ceilingType !== 'notLimit') {
        params.maxDiscountAmount = values.maxDiscountAmount;
      }

      this.setState({
        isPostLoading: true,
      });

      Modal.confirm({
        title: '是否确认上架此满减券',
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
    const { isPostLoading } = this.state;
    const { getFieldValue } = this.props.form;
    return (
      <div style={{ marginTop: '32px', marginBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <CommonSimulator
          caption="口碑每满减展示页面"
          background="https://os.alipayobjects.com/rmsportal/QuAamNPNrupyedR.png"
          withScroll
        />
        <Form onSubmit={this.handleSubmit} style={{ float: 'left', width: '600px', marginLeft: '40px' }} form={this.props.form} horizontal>
          <FormBanner>
            基本信息
          </FormBanner>
          {OffWhenOverCfg.map(d => {
            if (d.key === 'SelectShopsAsync') {
              d.defaultValue = this.state.shop || [];
              d.limitMode = 0; // 一件搬家传0，接口下发淮海和无证
            }

            if (d.key === 'renewMode' && getFieldValue('validTimeType') === 'FIXED') {
              // 如果券有效期为指定时间，则不需要自动续期
              return null;
            }
            return componentGetter({ ...d, ...formItemLayout }, this);
          })}
          <FormBanner>
            规则设置
          </FormBanner>
          {/* <p style={{ fontSize: 14, paddingLeft: '10%', paddingBottom: 20 }}>
            <Icon type="info-circle" style={{ color: '#2db7f5' }} />
            <span style={{ padding: '0px 8px' }}>常规安全及领取限制将由系统自动设置，无需商家设置</span>
            <a href="https://help.koubei.com/takeaway/knowledgeDetail.htm?knowledgeId=201602048802" target="_blank">查看帮助</a>
          </p>*/}
          {RuleSetFormCfg.map(d => componentGetter({ ...d, ...formItemLayout }, this))}
          <FormBanner>
            其他设置
          </FormBanner>
          {OtherToFormCfg.map(d => componentGetter({ ...d, ...formItemLayout }, this))}
          <FormItem wrapperCol={{ span: 15, offset: 6 }}>
            <Button type="primary" htmlType="submit" loading={isPostLoading} disabled={isPostLoading}>
              提 交
            </Button>
            {/* <p style={{ fontSize: 14, paddingTop: 20 }}>
              <Icon type="info-circle" style={{ color: '#2db7f5' }} />
              <span style={{ paddingLeft: '8px', color: '#1a1a1a' }}>提交活动时可同时创建测试活动</span>
            </p> */}
          </FormItem>
        </Form>
      </div>
    );
  }

  render() {
    window.f = this.props.form;
    fixFrameHeightDebounced();
    return (
      <div>
        <div className="kb-detail-main" style={{ overflow: 'hidden' }}>
          {
            this.state.isLoading ? <div style={{ textAlign: 'center', marginTop: 80 }}><Spin /></div>
              : this.renderForm()
          }
        </div>
      </div>
    );
  }
}

export default Form.create()(OffWhenOver);
