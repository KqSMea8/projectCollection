import React, {PropTypes} from 'react';
import { History } from 'react-router';
import { Form, Button, Radio, message, Modal } from 'antd';
import {dateFormat} from '../../../../common/dateUtils';
import ajax from '../../../../common/ajax';
import { keepSession } from '../../../../common/utils';

import ActivitySet from '../../common/CreateForm/ActivitySet';
import CouponSet from '../../common/CreateForm/CouponSet';
import DiscountRate from '../../common/CreateForm/DiscountRate';
import GoodsIds from '../../common/CreateForm/GoodsIds';
import UseRule from '../../common/CreateForm/UseRule';
import ValidTime from '../../common/CreateForm/ValidTime';
import UseInfo from '../../common/CreateForm/UseInfo';
import CouponRule from '../../common/CreateForm/CouponRule';
import LimitNum from '../../common/CreateForm/LimitNum';
import LimitInvolve from '../../common/CreateForm/LimitInvolve';
import TicketAmount from '../../common/CreateForm/TicketAmount';
import SelectBusiness from '../../common/CreateForm/SelectBusiness';
import Deadline from '../../common/CreateForm/Deadline';
import Channel from '../../common/CreateForm/Channel';
import ActivityChannel from '../../common/CreateForm/ActivityChannel';
import Settle from '../../common/CreateForm/Settle';
import Agreement from '../../common/CreateForm/Agreement';
import classnames from 'classnames';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

/*
  品牌商 新建单品券（折扣券、代金券）
*/
/*eslint-disable */
const CreateForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    roleType: PropTypes.string,
    allData: PropTypes.object,
    initData: PropTypes.object,
    actionType: PropTypes.string,
    isCopy: PropTypes.string,
    query: PropTypes.object,
    params: PropTypes.object,
  },

  mixins: [History],

  getDefaultProps() {
    return {
      isCopy: 'false',
      roleType: 'brand',
      allData: {},
      initData: {},
    };
  },

  getInitialState() {
    const { initData } = this.props;
    return {
      isSubmitting: false,
      needKBSettle: initData && initData.needKBSettle,
    };
  },

  componentWillMount() {
    keepSession();
  },

  settleWay(status) {
    this.setState({
      needKBSettle: status,
    });
  },

  createTestActivity() {
    const startTime = moment(Number(window.APP.now || Date.now())).format('YYYY-MM-DD') + ' 00:00';
    const endTime = moment(Number(window.APP.now || Date.now())).add(3, 'days').format('YYYY-MM-DD') + ' 23:59';
    const content = (<div>
      <p>为您生成测试活动，测试活动仅对白名单内的用户可见（<a href="/goods/itempromo/testList.htm" target="_blank">配置白名单</a>）。</p>
      <p>测试活动时间：{startTime} – {endTime}</p>
      <p>测试方法：使用测试名单的账号打开支付宝客户端，在活动店铺的页面领取优惠并验证核销。</p>
      <p>您可以在活动管理页面查看测试活动详情。</p>
    </div>);
    const self = this;
    Modal.confirm({
      width: 470,
      title: '提示',
      content: content,
      onOk() {
        self.postData();
      },
    });
  },

  postData() {
    const self = this;
    this.setState({
      isSubmitting: true,
    });

    this.props.form.validateFieldsAndScroll((errors) => {
      if ( !!errors ) {
        self.setState({
          isSubmitting: false,
        });
        return;
      }

      const fields = this.props.form.getFieldsValue();
      const { actionType, query, params, initData } = this.props;

      delete fields.isLimitInvolve;
      delete fields.isLimitInvolveDay;
      delete fields.isLimitBudgetAmount;
      delete fields.isLimitCostFull;
      delete fields.isLimitAmount;
      delete fields.isLimitNum;
      delete fields.agreement;
      fields.type = 'DIRECT_SEND';
      if (params.mode === 'realtime') {
        fields.type = 'REAL_TIME_SEND';
      }
      if ( fields.startTime ) {
        fields.startTime = dateFormat(fields.startTime);
      }
      if ( fields.endTime ) {
        fields.endTime = dateFormat(fields.endTime);
      }
      if ( fields.confirmTime ) {
        fields.confirmTime = dateFormat(fields.confirmTime);
      }
      if ( fields.validTimeType === 'FIXED' ) {
        fields.validTimeFrom = dateFormat(fields.validTimeFrom);
        fields.validTimeTo = dateFormat(fields.validTimeTo);
      }
      if ( fields.couponRule && fields.couponRule === 'reduceto') {
        fields.itemDiscountType = 'REDUCETO';
      }
      if ( fields.deliveryChannels && params.mode === 'common' && !initData.crowdId) {
        fields.deliveryChannels = [fields.deliveryChannels];
      }

      if (fields.goodsIds) {
        const goodsArr = (fields.goodsIds || '').split('\n');
        fields.goodsIds = goodsArr.filter(item => {
          return item.length > 0;
        });
      }

      if (fields.logoFileId) {
        fields.logoFileId = fields.logoFileId[0].id;
        fields.logoFixUrl = fields.logoFileId[0].url;
      }

      if (fields.itemCover) {
        fields.itemCover = fields.itemCover[0].id;
      }

      // 重组商品图片
      if (!fields.activityImgFileIds) {
        const imgs = [];
        imgs.push(fields.itemCover);
        if (fields.itemDetailImg1) imgs.push(fields.itemDetailImg1);
        if (fields.itemDetailImg2) imgs.push(fields.itemDetailImg2);

        fields.activityImgFileIds = imgs;

        delete fields.itemCover;
        delete fields.itemDetailImg1;
        delete fields.itemDetailImg2;
      }

      let url = '';
      const data = {};
      if ( actionType === 'create' || actionType === 'copy') {
        // 创建
        fields.crowdId = query.crowdId ? query.crowdId : initData.crowdId;
        data.jsonDataStr = JSON.stringify(fields);
        url = '/promo/brand/createPost.json';
      } else if ( actionType === 'edit' ) {
        // 编辑
        fields.crowdId = initData.crowdId;
        data.jsonDataStr = JSON.stringify(fields);
        url = '/promo/brand/modifyPost.json';

        // 品牌商
        data.activityId = params.id;
      }
      // 提交主表单
      ajax({
        url,
        data,
        method: 'POST',
        type: 'json',
        success: (res) => {
          if (res.status === 'success') {
            const activityId = res.activityId;
            self.submitSuccess(activityId);
          } else {
            self.setState({
              isSubmitting: false,
            });
            message.error(res.errorMsg || '操作失败');
          }
        },
        error: (err) => {
          self.setState({
            isSubmitting: false,
          });
          message.error(err.errorMsg || '操作失败');
        },
      });
    });
  },

  submitSuccess(activityId) {
    const { actionType } = this.props;
    message.success('操作成功');

    if (actionType === 'create' || actionType === 'copy') {
      // 创建
      location.hash = '/marketing/brands/activity-success/' + activityId;
    } else {
      // 编辑
      location.hash = '/marketing/brands/activity-success/' + activityId;
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    this.postData();
  },

  render() {
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
    const { initData, form, actionType, query, params } = this.props;
    const isEdit = actionType === 'edit' || actionType === 'copy';
    const defaultType = initData.itemDiscountType || 'RATE';
    if (initData && initData.type === 'REAL_TIME_SEND' ) {
      params.mode = 'realtime';
    }
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16, offset: 1 },
    };

    const formChannelLayout = {
      checkbox: layout,
      quan: {
        labelCol: { span: 7 },
        wrapperCol: { span: 16 },
      },
    };
    if (initData && initData.type === 'DIRECT_SEND') {
      params.mode = 'common';
    }

    return (
      <div className="detail-wrap">
        <div className="form-wrap">
          <Form horizontal onSubmit={this.handleSubmit} form={form}>
            <div className="title-split">
              <span>活动设置</span>
            </div>
            <ActivitySet layout={layout} {...this.props} />

            <div className="title-split">
              <span>优惠券设置</span>
            </div>

            <FormItem
              {...layout}
              required
              label="券种类：">
              <RadioGroup disabled={actionType === 'edit'} {...getFieldProps('itemDiscountType', {
                initialValue: defaultType,
              })}>
                <Radio value="RATE">折扣券</Radio>
                <Radio value="MONEY">代金券</Radio>
                <Radio value="REDUCETO">换购券</Radio>
              </RadioGroup>
            </FormItem>

            <CouponSet layout={layout} {...this.props} />

            <div className="line-split"></div>

            { getFieldValue('itemDiscountType') === 'RATE' && <DiscountRate layout={layout} {...this.props} /> }

            { (getFieldValue('itemDiscountType') === 'MONEY' || getFieldValue('itemDiscountType') === 'REDUCETO') &&
            <CouponRule layout={layout} {...this.props} ticketType={getFieldValue('itemDiscountType')} /> }

            <UseRule layout={layout} {...this.props} ticketType={getFieldValue('itemDiscountType')} />

            <LimitNum layout={layout} {...this.props} ticketType={getFieldValue('itemDiscountType')} />

            <GoodsIds layout={layout} {...this.props} />

            <LimitInvolve layout={layout} {...this.props} ticketType={getFieldValue('itemDiscountType')} campType={params.mode} />

            {
              params && params.mode === 'realtime' ? null : (
                <ValidTime layout={layout} {...this.props} />
              )
            }

            <TicketAmount layout={layout} {...this.props} />

            <UseInfo layout={layout} {...this.props} max={6} />

            <div className="title-split">
              <span>商家设置</span>
            </div>
            <FormItem
                {...layout}
                required
                label="参与商家："
                help={getFieldError('merchants')}
                validateStatus={
                  classnames({
                    error: !!getFieldError('merchants'),
                  })}>
              <SelectBusiness
                  {...this.props}
                  {...getFieldProps('merchants', {
                    rules: [{
                      required: true,
                      type: 'array',
                      message: '请选择商家',
                    }],
                    initialValue: initData.merchants || [],
                  })} />
            </FormItem>
            <Deadline layout={layout} {...this.props} />

            {
              ( !query.crowdId && !initData.crowdId && params.mode === 'common' && getFieldValue('itemDiscountType') === 'REDUCETO') && <div>
                <div className="title-split">
                  <span>投放渠道</span>
                </div>
                <ActivityChannel layout={formChannelLayout} {...this.props} />
              </div>
            }

            {
              (query.crowdId || initData.crowdId) ? <div>
                <div className="title-split">
                  <span>投放渠道</span>
                </div>
                <Channel layout={formChannelLayout} {...this.props} />
              </div> : null
            }

            <Settle layout={layout} {...this.props} changeType={this.settleWay}/>

            <div className="line-split"></div>
            <Agreement {...this.props} needKBSettle={this.state.needKBSettle}/>

            <FormItem wrapperCol={{ span: 16, offset: 7 }} style={{ marginTop: 24 }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 10 }} disabled={this.state.isSubmitting || (!getFieldValue('agreement'))}>{isEdit ? '提交' : '创建'}</Button>
              <Button type="ghost" onClick={() => this.history.goBack()}>取消</Button><br />
            </FormItem>
          </Form>
        </div>

        <div className="simulator-wrap">
          <div className="simulator">
            <img className="sample" src={getFieldValue('itemDiscountType') === 'RATE'
            ? 'https://zos.alipayobjects.com/rmsportal/IJcBsFtgVImipLe.png@w223'
            : 'https://zos.alipayobjects.com/rmsportal/pEHMkRuvunAlrLl.png@w223'} />
          </div>
        </div>
      </div>
    );
  },
});

export default Form.create()(CreateForm);
