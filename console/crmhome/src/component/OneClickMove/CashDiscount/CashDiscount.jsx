import React from 'react';
import { Form, message as msg, Spin, Button, Row, Col, Modal } from 'antd';
import formCfg from './CashDiscountCfg';
import componentGetter from '../common/ComponentGetter';
import { keepSession, fixFrameHeight, getUriParam } from '../../../common/utils';
import CommonSimulator from '../../MarketingActivity/common/CommonSimulator';
import { cloneDeep, debounce, pick } from 'lodash';
import ajax from '../../../common/ajax';
import AdviseExtra from '../common/AdviseExtra';

const message = { ...msg };

if (window.top !== window) {
  ['error', 'warn', 'success'].forEach(f => {
    message[f] = function iframeMessage(text) {
      window.parent.postMessage(JSON.stringify({ action: f, message: text }), '*');
    };
  });
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const fixFrameHeightDebounced = debounce(fixFrameHeight, 150);
const formFields = [
  'couponValue',  // 全面额
  'shopIds',      // 门店
  'receiveLimited',   // 参与限制
  'dayReceiveLimited',  // 每日参与限制
  'budgetAmount', // 发放总量
  'startTime',    // 上架时间
  'endTime',      // 结束时间
  'useMode',      // 使用方式 0=需要领取，1=无需领取
  'validTimeType',// 有效期类型，FIXED=绝对时间，RELATIVE=相对时间
  'validPeriod',  // 相对有效期天数
  'validTimeFrom',// 绝对时间的起始时间
  'validTimeTo',  // 绝对时间的结束时间
  'forbiddenTime',// 不可用日期  "2017-05-02,2017-05-03^2017-05-05,2017-05-08"
  'renewMode',    // 自动续期 0=不续期，1=自动续期
  'availableTimeType',  // 可用时段类型 1=任意时间,2=指定时间段-星期维度,3=指定时间段-月维度
  'availableTimes', // 可用时段 [{"times": "10:00,12:00", "values": "1,3,5"}]
  'minimumAmount',  // 最低消费金额（全场代金和折扣使用，每满减有单独字段） "100.00"
  'brandName',    // 品牌名称
  'logoFileId',   // 券 logo
  'payChannel',   // 支付渠道限制 1=不限支付渠道，2=仅限储值卡付款可享，3=储值卡付款不可享
  'descList',     // 使用须知
  'name',      // 备注
];

function convertFetchDataToFormData(fetchData) {
  const rtn = { ...fetchData };
  const totalAmount = fetchData.budgetAmount && (+fetchData.budgetAmount) > 0 ? (+fetchData.budgetAmount) : null;
  rtn.budgetAmountType = totalAmount > 0 ? '1' : '0';
  rtn.budgetAmount = totalAmount;

  if (fetchData.useMode === '0') {  // 需要领取
    if (fetchData.validTimeType === 'FIXED') {
      rtn.validTime = [fetchData.validTimeFrom, fetchData.validTimeTo];
    }
    if (fetchData.forbiddenTime) {  // 不可用日期
      rtn.invalidTimeType = '1';  // 指定时段
      rtn.invalidTimeValue = fetchData.forbiddenTime.split('^').map(d => d.split(','));
    } else {
      rtn.invalidTimeType = '0';
    }
  }

  fetchData.availableTimeType = fetchData.availableTimeType || '1';

  // 券可用时间转换
  rtn.multiValidTimeType = fetchData.availableTimeType || '1';
  if (rtn.multiValidTimeType !== '1') {
    rtn.multiValidTimeValue = fetchData.availableTimes.map(d => ({
      days: d.values.split(','),
      endTime: d.times.split(',')[1],
      startTime: d.times.split(',')[0],
    }));
  }

  // 券 logo
  if (rtn.logoFileId) {
    rtn.logoFileId = [{
      id: rtn.logoFileId,
      uid: rtn.logoFileId,
      status: 'done',
      url: 'http://oalipay-dl-django.alicdn.com/rest/1.0/image?fileIds=' + rtn.logoFileId,
    }];
  }

  // 一键搬家必须领取
  rtn.useMode = '0';

  return rtn;
}

function convertFormDataToPostData(formData) {
  const postData = pick(formData, formFields);
  if (formData.budgetAmountType === '1') { // 发放总量
    postData.budgetAmount = formData.budgetAmount + '';
  } else {
    postData.budgetAmount = undefined;
  }

  // 重置和 useMode 相关的字段
  ['validTimeType', 'validPeriod', 'validTimeFrom', 'validTimeTo', 'forbiddenTime']
    .forEach(key => postData[key] = undefined);

  if (formData.useMode === '0') { // 需要领取
    postData.validTimeType = formData.validTimeType;
    if (formData.validTimeType === 'FIXED') { // 指定时间
      postData.validTime = formData.validTime || [];
      postData.validTimeFrom = formData.validTime[0];
      postData.validTimeTo = formData.validTime[1];
    } else {
      postData.validPeriod = formData.validPeriod;
    }
    if (formData.invalidTimeType === '1') { // 如果是指定时间，才取 forbiddenTime
      postData.forbiddenTime = formData.invalidTimeValue.map(d => d.join(',')).join('^');
    }
  }

  // 自动续期
  if (formData.validTimeType === 'FIXED') {
    postData.renewMode = undefined;
  }

  // 券可用时间转换
  postData.availableTimeType = formData.multiValidTimeType || '1';
  if (postData.availableTimeType !== '1') {
    postData.availableTimes = formData.multiValidTimeValue.map(d => ({
      times: `${d.startTime},${d.endTime}`,
      values: d.days.join(','),
    }));
  } else {  // 指定日期
    postData.availableTimes = undefined;
  }

  // 券 logo
  if (formData.logoFileId && formData.logoFileId[0]) {
    postData.logoFileId = formData.logoFileId[0].id;
  }

  // 一键搬家必须领取
  postData.useMode = '0';

  // 去除空行;
  postData.descList = (formData.descList || []).filter(d => !!d);

  postData.deliveryChannels = ['SHOP_DETAIL'];  // 写死投放渠道

  return postData;
}

export default Form.create()(
  class CashDiscount extends React.Component {
    state = {
      data: null,
      isPostLoading: false,       // 提交中
      isFetchLoading: false,      // leads 信息接口请求中
      allowSubmit: null,          // 是否允许提交
      leadsId: null,
      type: null,                 // 活动类型(VOUCHER=全场代金,RATE=全场折扣,MANJIAN=每满减)
    }

    componentWillMount() {
      this.fetchInitData();
      if (window.top !== window) {
        fixFrameHeightDebounced();
        window.top.postMessage(JSON.stringify({ action: 'scrollTop', scrollTop: 0 }), '*');
      }
      keepSession();
    }

    fetchInitData() {
      this.setState({
        isFetchLoading: true,
      });

      const leadsId = getUriParam('leadsId', this.props.location.search);
      if (!leadsId) {
        return message.error('leadsId 无效');
      }

      ajax({
        // url: 'http://pickpost.alipay.net/mock/tuanjie.test/goods/koubei/queryMovehomeDetail.json',
        url: '/goods/koubei/queryMovehomeDetail.json',
        method: 'POST',
        data: { leadsId },
        success: res => {
          const state = { isFetchLoading: false };
          if (res && res.status === 'succeed') {
            state.data = convertFetchDataToFormData(res.data);
            state.allowSubmit = res.allowSubmit;
            state.leadsId = res.leadsId;
            state.type = res.type;
            this.props.form.setFieldsValue(state.data);
          } else {
            message.error(res && res.resultMsg || '获取券信息失败');
          }
          this.setState(state);
        },
        error: err => {
          message.error(err && err.resultMsg || '获取券信息失败');
        },
      });
    }

    renderForm = () => {
      fixFrameHeightDebounced();
      const getFieldValue = this.props.form.getFieldValue;
      const useMode = getFieldValue('useMode');
      const data = this.state.data;
      const rtn = formCfg.map(cfg => {
        const fmCfg = { ...cloneDeep(cfg), ...formItemLayout };
        if ((fmCfg.key === 'VouchersValidTime' || fmCfg.key === 'InvalidDate') && useMode === '1') {
          return null;
        }
        if (fmCfg.key === 'shops') {
          fmCfg.defaultValue = data.cityShop || [];
          fmCfg.limitMode = 0; // 一件搬家传0，接口下发淮海和无证
        }
        if (fmCfg.key === 'availableTimes' && data.availableTimeTip &&
          data.availableTimeTip.value && data.availableTimeTip.value.length > 0) { // 券可用时段
          fmCfg.extra = (
            <AdviseExtra>
              {data.availableTimeTip.value.join('；')}
            </AdviseExtra>
          );
        }
        if (fmCfg.key === 'InvalidDate' && data.unavailableTimeTip &&
          data.unavailableTimeTip.value && data.unavailableTimeTip.value.length > 0) {  // 不可用时间
          fmCfg.extra = (
            <AdviseExtra>
              {data.unavailableTimeTip.value.join('；')}
            </AdviseExtra>
          );
        }
        if (fmCfg.key === 'renewMode' && getFieldValue('validTimeType') === 'FIXED') {
          // 如果券有效期为指定时间，则不需要自动续期
          return null;
        }
        return componentGetter(fmCfg, this);
      });
      return rtn;
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

    handleSave(postData) {
      ajax({
        url: '/goods/koubei/submitMovehome.json',
        method: 'POST',
        data: postData,
        success: res => {
          if (res && res.status === 'succeed') {
            message.success('操作成功', 3);
            setTimeout(this.goBack, 3000);
          } else {
            message.error(res && res.resultMsg, 3);
          }
          this.setState({
            isPostLoading: false,
          });
        },
        error: err => {
          this.setState({
            isPostLoading: false,
          });
          message.error(err && err.resultMsg || '网络连接异常', 3);
        },
      });
    }

    submit = () => {
      this.props.form.validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return message.error('请检查填写内容');
        }
        this.setState({
          isPostLoading: true,
        });
        const postData = {};
        postData.leadsId = this.state.leadsId;
        postData.type = this.state.type;
        postData.formData = JSON.stringify(convertFormDataToPostData(values));

        Modal.confirm({
          title: '是否确认上架此代金券',
          content: window.top !== window ? (
            <p>
              提交成功后，需等待商户确认<br />
              也可以主动联系商户进行确认，加快代金券上架时间。
            </p>
          ) : null,
          onOk: () => {
            this.handleSave(postData);
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

    render() {
      window.f = this.props.form;
      if (this.state.isFetchLoading) {
        return <div style={{ marginTop: '100px', textAlign: 'center' }}><Spin spinning size="large" /></div>;
      }
      return (
        <div className="kb-detail-main">
          <CommonSimulator background="https://zos.alipayobjects.com/rmsportal/cYhDjFzpIdYFDKGEzinH.png"
            caption="支付宝全场代金展示页面"
          />
          <div style={{ width: 600, float: 'left' }}>
            <Form horizontal form={this.props.form} onSubmit={this.submit}>
              {this.renderForm()}
            </Form>
            {this.state.allowSubmit && (
              <Row>
                <Col offset={formItemLayout.labelCol.span}>
                  <Button
                    size="large"
                    loading={this.state.isPostLoading}
                    disabled={this.state.isPostLoading}
                    type="primary"
                    onClick={this.submit}
                  >
                    提 交
                </Button>
                </Col>
              </Row>
            )}
          </div>
        </div>
      );
    }
  });
