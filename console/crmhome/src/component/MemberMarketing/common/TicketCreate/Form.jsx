import React, {PropTypes} from 'react';
import { History } from 'react-router';
import { Form, Button, Radio, message, Modal } from 'antd';
import {dateFormat} from '../../../../common/dateUtils';
import ajax from '../../../../common/ajax';
import { keepSession } from '../../../../common/utils';

import ActivitySet from './FormItems/ActivitySet';
import CouponSet from './FormItems/CouponSet';
import DiscountRate from './FormItems/DiscountRate';
import GoodsIds from './FormItems/GoodsIds';
import UseRule from './FormItems/UseRule';
import ValidTime from './FormItems/ValidTime';
import UseInfo from './FormItems/UseInfo';
import CouponRule from './FormItems/CouponRule';
import LimitInvolve from './FormItems/LimitInvolve';
import TicketAmount from './FormItems/TicketAmount';
import SelectBusiness from './FormItems/SelectBusiness';
import Deadline from './FormItems/Deadline';
import Channel from './FormItems/Channel';
import Agreement from './FormItems/Agreement';
import SelectShop from './FormItems/SelectShop';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

/*
  新建单品券（折扣券、代金券）
*/

const TicketCreate = React.createClass({
  propTypes: {
    form: PropTypes.object,
    roleType: PropTypes.string,
    allData: PropTypes.object,
    initData: PropTypes.object,
    actionType: PropTypes.string,
    query: PropTypes.object,
    params: PropTypes.object,
  },

  mixins: [History],

  getDefaultProps() {
    return {
      allData: {},
      initData: {},
    };
  },

  getInitialState() {
    return {
      isSubmitting: false,
    };
  },

  componentWillMount() {
    keepSession();
  },
  handleSubmit(e) {
    e.preventDefault();
    this.postData();
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
        self.postData(true);
      },
    });
  },
  postData(needToCreateTest) {
    const self = this;
    this.setState({
      isSubmitting: true,
    });

    /* eslint-disable */  this.props.form.validateFieldsAndScroll((errors) => {
      if ( !!errors ) {
        self.setState({
          isSubmitting: false,
        });
        return;
      }

      const fields = this.props.form.getFieldsValue();
      const { actionType, roleType, query, params, initData } = this.props;

      delete fields.isLimitInvolve;
      delete fields.isLimitInvolveDay;
      delete fields.isLimitBudgetAmount;
      delete fields.isLimitCostFull;
      delete fields.agreement;
      fields.useMode = 0;

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

      // 修改的时候接口要求从有到无也保留字段，值按情况传
      fields.receiveLimited = fields.receiveLimited || 0;
      fields.dayreceiveLimited = fields.dayreceiveLimited || 0;
      fields.budgetAmount = fields.budgetAmount || 999999999;

      // 删除冗余字段，一定要在品牌名称判断之后删除
      delete fields.customBrandName;
      delete fields.selectBrandName;

      const goodsArr = (fields.goodsIds || '').split('\n');
      fields.goodsIds = goodsArr.filter(item => {
        return item.length > 0;
      });

      let url = '';
      const data = {};
      let merchantP = null;
      if (query.crowdId === '-1') { // 新人创建
        fields.crowdRestriction = 'NEW_MEMBER_PROMO';
      }

      if ( actionType === 'create' ) {
        // 创建
        if (query.crowdId !== '-1') { // 新人创建
          fields.crowdId = query.crowdId;
        }
        data.jsonDataStr = JSON.stringify(fields);
        url = '/promo/' + roleType + '/createPost.json?needToCreateTest=' + !!needToCreateTest;
      } else if ( actionType === 'edit' ) {
        // 编辑
        if (initData.crowdId !== '-1') { // 新人创建需要测试
          fields.crowdId = initData.crowdId;
        }
        data.jsonDataStr = JSON.stringify(fields);
        url = '/promo/' + roleType + '/modifyPost.json';
        if ( roleType === 'brand' ) {
          // 品牌商
          data.planId = params.id;
          // 修改配置商家
          merchantP = new Promise(resolve => {
            ajax({
              url: '/goods/discountpromo/inviteModify.json',
              data: {
                planId: params.id,
                inviteMerchants: fields.merchants.join(','),
              },
              method: 'post',
              type: 'json',
              success: (res) => {
                resolve(res.status);
              },
            });
          });
        } else if ( roleType === 'merchant' ) {
          // 零售商
          data.campaignId = params.id;
        }
      }

      // 提交主表单
      ajax({
        url,
        data,
        method: 'POST',
        type: 'json',
        success: (res) => {
          if (res.status === 'success') {
            const activityId = roleType === 'brand' ? res.planId : res.campaignId;

            if (merchantP) {
              merchantP.then(result => {
                if (result === 'succeed') {
                  self.submitSuccess(activityId);
                } else {
                  self.setState({
                    isSubmitting: false,
                  });
                  message.error('新增商家失败');
                }
              });
            } else {
              self.submitSuccess(activityId);
            }
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
    const { actionType, roleType } = this.props;
    const role = roleType === 'brand' ? 'brands' : 'retailers';

    message.success('操作成功');

    if (actionType === 'create') {
      // 创建
      location.hash = '/marketing/' + role + '/activity-success/' + activityId;
    } else {
      // 编辑
      if (roleType === 'brand') {
        location.hash = '/marketing/brands/manage';
      } else {
        // 销售中台账户登录，跳转地址中增加op_merchant_id参数
        const merchant = document.getElementById('J_crmhome_merchantId');

        location.href = merchant && merchant.value ? '/goods/itempromo/activityList.htm.kb?op_merchant_id=' + merchant.value : '/goods/itempromo/activityList.htm';  // eslint-disable-line no-location-assign
      }
    }
  },

  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const { initData, roleType, form, actionType } = this.props;
    const isEdit = actionType === 'edit';
    const type = initData.itemDiscountType;
    let defaultType = type && (type === 'MONEY' || type === 'REDUCETO') ? 'MONEY' : 'RATE';
    const isGenericIndustry = window.APP.isGenericIndustry === 'true';
    if (isGenericIndustry) {
      defaultType = 'MONEY';
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
              <RadioGroup disabled={isEdit} {...getFieldProps('itemDiscountType', {
                initialValue: defaultType,
              })}>
                {!isGenericIndustry ? <Radio value="RATE">折扣券</Radio> : ''}
                <Radio value="MONEY">代金券</Radio>
              </RadioGroup>
            </FormItem>

            <CouponSet layout={layout} {...this.props} />

            <div className="line-split"></div>

            {getFieldValue('itemDiscountType') === 'RATE' ?
              <DiscountRate layout={layout} {...this.props} />
            : null}

            {getFieldValue('itemDiscountType') === 'MONEY' ?
              <CouponRule layout={layout} {...this.props} />
            : null}
            {!isGenericIndustry ? <UseRule layout={layout} {...this.props} ticketType={getFieldValue('itemDiscountType')} /> : ''}

            {!isGenericIndustry ? <GoodsIds layout={layout} {...this.props} /> : ''}

            <LimitInvolve layout={layout} {...this.props} ticketType={getFieldValue('itemDiscountType')} />

            <ValidTime layout={layout} {...this.props} />

            {roleType === 'merchant' ?
              <SelectShop layout={layout} {...this.props} />
            : null}

            <TicketAmount layout={layout} {...this.props} />

            <UseInfo layout={layout} {...this.props} max={6} />

            {roleType === 'brand' ?
            <div>
              <div className="title-split">
                <span>商家设置</span>
              </div>
              <SelectBusiness layout={layout} {...this.props} />
              <Deadline layout={layout} {...this.props} />
            </div>
            : null }

            <div className="title-split">
              <span>投放渠道</span>
            </div>

            <Channel layout={formChannelLayout} {...this.props} />

            {roleType === 'brand' ?
            <div>
              <div className="line-split"></div>
              <Agreement {...this.props} />
            </div>
            : null }

            <FormItem wrapperCol={{ span: 16, offset: 7 }} style={{ marginTop: 24 }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 10 }} disabled={this.state.isSubmitting || (roleType === 'brand' && !getFieldValue('agreement'))}>{isEdit ? '提交' : '创建'}</Button>
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

export default Form.create()(TicketCreate);
