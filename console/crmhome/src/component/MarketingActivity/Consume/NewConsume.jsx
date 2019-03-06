import React, {PropTypes} from 'react';
import {Row, Form, DatePicker, Checkbox, Select, InputNumber, Input, Button, Breadcrumb, Spin, Icon, Modal, message, Alert} from 'antd';
import Decimal from 'decimal.js';
import ConsumeSimulator from './ConsumeSimulator';
import ajax from '../../../common/ajax';
import {keepSession, customLocation} from '../../../common/utils';
//  import ShopSelectComponent from '../../../common/ShopSelectComponent';
import InputCoupon, {makeCouponNameForCampName, transformCouponFormData, transformCouponDefaultData} from '../common/coupon/InputCoupon';
import moment from 'moment';
import classnames from 'classnames';
import * as _ from 'lodash';
import {getShopIds, getPhotoId} from '../common/coupon/util';
import SelectShops from '../../../common/SelectShops/indexs';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 4, offset: 2},
  wrapperCol: {span: 16},
};

const NewConsume = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getInitialState() {
    this.isEdit = !!this.props.params.id;
    this.data = {};
    const node = document.getElementById('J_isFromKbServ');
    this.isFromKb = node && node.value === 'true';
    return {
      loading: true,
      canSubmit: true,
      isCampaignStart: false,   // 活动是否已开始
    };
  },

  componentWillMount() {
    if (this.isEdit) {
      this.fetch(this.props.params.id);
    } else {
      this.props.form.setFieldsInitialValue({
        minimumAmountType: '0',
        startTime: moment(moment().format('YYYY-MM-DD') + ' 00:00', 'YYYY-MM-DD HH:mm').toDate(),
        endTime: moment(moment().add(30, 'days').format('YYYY-MM-DD') + ' 23:59', 'YYYY-MM-DD HH:mm').toDate(),
      });
    }
    keepSession();
  },

  /**
   * url 变化时，刷新数据
   *
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.fetch(nextProps.params.id);
    }
  },

  onMinimumAmountTypeChange(value) {
    const {getFieldValue} = this.props.form;
    const minimumAmount = getFieldValue('minimumAmount');
    const vouchers = getFieldValue('vouchers');
    this.syncCampName(value, minimumAmount, vouchers);
  },

  onMinimumAmountChange(value) {
    const {getFieldValue} = this.props.form;
    const minimumAmountType = getFieldValue('minimumAmountType');
    const vouchers = getFieldValue('vouchers');
    this.syncCampName(minimumAmountType, value, vouchers);
  },

  onVouchersChange(value) {
    const {getFieldValue} = this.props.form;
    const minimumAmountType = getFieldValue('minimumAmountType');
    const minimumAmount = getFieldValue('minimumAmount');
    /* if (value.validTimeType === 'FIXED') {
      ReactDOM.findDOMNode(this.refs.autoDelay).style.display = 'none';
    } else {
      ReactDOM.findDOMNode(this.refs.autoDelay).style.display = 'block';
    } */
    this.syncCampName(minimumAmountType, minimumAmount, value);
  },

  fetch(id) {
    this.setState({ loading: true });
    const url = '/goods/itempromo/campaignDetail.json?campId=' + id;
    ajax({
      url: url,
      method: 'get',
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.result) {
          const data = this.transformDefaultData(result.discountForm);
          this.props.form.setFieldsInitialValue(data);
          this.data = data;
          this.setState({ loading: false, isCampaignStart: result.discountForm.campaignStart });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },
  /*eslint-disable */
  transformFormData(data) { // 提交前的数据format
    /*eslint-enable */
    const newData = _.cloneDeep(data);
    newData.type = 'CONSUME_SEND'; // 固定，表示消费送
    newData.minimumAmount = data.minimumAmount || 0;
    newData.startTime = moment(data.startTime).format('YYYY-MM-DD HH:mm');
    newData.endTime = moment(data.endTime).format('YYYY-MM-DD HH:mm');
    const shopList = data.shopList;

    // 外层活动门店数据解析
    if (shopList.shopType && shopList.shopType === 'select') {
      newData.shopType = shopList.shopType;
      const newShopIds = getShopIds(shopList.checked).filter(d => !!d);
      newData.shopIds = this.state.isCampaignStart ?  // 兜底  shopcenter接口传7个shopid只返回6个门店导致新增门店时提交少一个原有的shopid导致修改报错
        _.uniq(_.concat(data.shopIds || [], newShopIds))
        : newShopIds;
    } else if (shopList.shopType && shopList.shopType === 'upload') {
      newData.shopType = shopList.shopType;
      newData.logId = shopList.logId;
    } else {
      const newShopIds = getShopIds(shopList).filter(d => !!d);
      newData.shopIds = this.state.isCampaignStart ?  // 兜底  shopcenter接口传7个shopid只返回6个门店导致新增门店时提交少一个原有的shopid导致修改报错
        _.uniq(_.concat(data.shopIds || [], newShopIds))
        : newShopIds;
    }

    if (newData.autoDelayFlag && newData.autoDelayFlag !== 'N') {
      newData.autoDelayFlag = 'Y';
    } else {
      newData.autoDelayFlag = 'N';
    }
    delete newData.shopList;
    if (!newData.participateLimitedSwitch) {
      delete newData.participateLimited;
    }
    if (!newData.dayParticipateLimitedSwitch) {
      delete newData.dayParticipateLimited;
    }
    // 不选择券，直接提交时需要转换数据
    if (!newData.vouchers.validTimeType) {
      newData.vouchers = transformCouponFormData(transformCouponDefaultData(newData.vouchers));
    }
    newData.sendNum = data.vouchers.count;
    delete newData.vouchers.count;
    delete newData.vouchers.activityTime;

    // 如果设置了券同步活动门店，要同时修改券的门店
    if (newData.vouchers.targetShopType === '1') {
      if (newData.shopType === 'select') {
        newData.vouchers.shopIds = newData.shopIds;
      } else if (newData.shopType === 'upload') {
        newData.vouchers.logId = newData.logId;
      } else {
        newData.vouchers.shopIds = newData.shopIds;
      }
      newData.vouchers.shopType = newData.shopType;
      delete newData.vouchers.targetShopType;
    }

    if (this.isEdit) {
      delete newData.voucherVOs;
      if (this.state.isCampaignStart && newData.vouchers.addedBudgetAmount) {
        newData.vouchers.budgetAmount += newData.vouchers.addedBudgetAmount;
      }
      // 删除无用门店字段
      delete newData.cityShopVOs;
      if (newData.vouchers) {
        delete newData.vouchers.shopList;
      }

      // 如果设置了券同步活动门店，要同时修改券的门店
      if (newData.vouchers.isSameShops) {
        if (newData.shopType === 'select') {
          newData.vouchers.shopIds = newData.shopIds;
        } else if (newData.shopType === 'upload') {
          newData.vouchers.logId = newData.logId;
        }
        newData.vouchers.shopType = newData.shopType;
      }
    }

    if (newData.vouchers && newData.vouchers.availableTimeType === '2') {
      newData.vouchers.multipAvailableTime = true; // 标示告知后端用新的数组接收【指定时间段】
    }

    if (newData.vouchers.validTimeType === 'FIXED') {
      newData.autoDelayFlag = 'N';
    }

    if (!newData.voucherImg) {
      delete newData.voucherImg;
    }
    if (!newData.voucherImgUrl) {
      delete newData.voucherImgUrl;
    }

    return newData;
  },

  /*eslint-disable */
  /**
   * 获取原始数据并format
   *
   * @param {object} data 接口数据 discountForm
   * @returns {object}
   */
  transformDefaultData(data) {
    /*eslint-enable */
    const newData = _.cloneDeep(data);
    data.startTime = moment(data.startTime, 'YYYY-MM-DD HH:mm:ss').toDate();
    data.endTime = moment(data.endTime, 'YYYY-MM-DD HH:mm:ss').toDate();
    newData.activityTime = [
      data.startTime ? data.startTime : undefined,
      data.endTime ? data.endTime : undefined,
    ];
    newData.participateLimitedSwitch = data.participateLimited !== undefined;
    newData.dayParticipateLimitedSwitch = data.dayParticipateLimited !== undefined;
    newData.minimumAmountType = data.minimumAmount ? '1' : '0';
    newData.shopList = data.cityShopVOs;
    //  newData.shopList = data.shopIds.map(d => ({id: d.toString(), shopId: d.toString()}));
    this.state.selectedShops = data.cityShopVOs || [];
    if (data.voucherVOs && data.voucherVOs[0]) {
      const voucherData = data.voucherVOs[0];
      newData.vouchers = {
        isSameShops: data.sameSuitableShops === undefined ? true : data.sameSuitableShops,  // 活动适用门店是否和券适用门店相同，相同则视为【同活动门店】，不同视为【指定门店】
        campId: this.props.params.id,
        count: data.voucherVOs[0].sendNum,
        activityTime: newData.activityTime, // 用于验证券有效期结束时间
        promotionType: voucherData.promotionType,
        vouchersType: voucherData.type,
        voucherName: voucherData.name,
        brandName: voucherData.subTitle,
        couponValue: voucherData.worthValue ? parseFloat(voucherData.worthValue) : undefined,
        voucherLogo: getPhotoId(voucherData.logo),
        voucherLogoUrl: voucherData.logo.replace(/&amp;/g, '&'),
        voucherImg: voucherData.voucherImg ? getPhotoId(voucherData.voucherImg) : null,
        voucherImgUrl: voucherData.voucherImg ? voucherData.voucherImg.replace(/&amp;/g, '&') : null,
        itemName: voucherData.name,
        itemDetail: voucherData.itemText,
        itemLink: voucherData.itemLink,
        itemIds: voucherData.itemIds,
        budgetAmount: voucherData.voucherCount ? parseInt(voucherData.voucherCount, 10) : undefined,
        rate: voucherData.rate ? parseFloat(new Decimal(voucherData.rate).div(10).toString()) : undefined,
        originPrice: voucherData.originalPrice ? parseFloat(voucherData.originalPrice) : undefined,
        shopList: voucherData.cityShopVOs && voucherData.cityShopVOs.length > 0 ? voucherData.cityShopVOs : undefined,
        shopIds: getShopIds(voucherData.cityShopVOs),
        minConsume: voucherData.useCondtion ? parseFloat(voucherData.useCondtion) : undefined,
        minItemNum: voucherData.minConsumeNum ? parseInt(voucherData.minConsumeNum, 10) : undefined,
        maxDiscountItemNum: voucherData.maxDiscountNum ? parseInt(voucherData.maxDiscountNum, 10) : undefined,
        maxAmount: voucherData.maxAmount ? parseFloat(voucherData.maxAmount) : undefined,
        validPeriod: voucherData.relativeTime ? parseInt(voucherData.relativeTime, 10) : undefined,
        validTimeFrom: voucherData.startTime,
        validTimeTo: voucherData.endTime,
        validTimeType: voucherData.relativeTime ? 'RELATIVE' : 'FIXED',
        effectType: voucherData.effectDayFlag === 'true' ? '0' : '1',
        donateFlag: voucherData.donateFlag === 'true' ? '1' : '0',
        // availableTime: voucherData.availableVoucherTime,
        availableTimes: voucherData.availableVoucherTime,
        forbiddenDateKeys: voucherData.forbiddenVoucherTime ? voucherData.forbiddenVoucherTime.split('^').map((row, i) => {
          return i;
        }) : undefined,
        forbiddenDates: voucherData.forbiddenVoucherTime || undefined,
        descListKeys: voucherData.useInstructions && voucherData.useInstructions.length > 0 ? voucherData.useInstructions.map((row, i) => {
          return i;
        }) : undefined,
        descList: voucherData.useInstructions,
        voucherNote: voucherData.voucherNote,
        availableTimeType: voucherData.availableVoucherTime && voucherData.availableVoucherTime.length ? '2' : '1',
      };
    }
    return newData;
  },

  gotoListPage(e) {
    e.preventDefault();
    return customLocation('/goods/itempromo/activityList.htm');
  },

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((error, values)=> {
      if (error) {
        return;
      }
      let url;
      if (this.isEdit) {
        url = '/goods/itempromo/modifyCampaign.json';
      } else {
        url = '/goods/itempromo/createCampaign.json';
      }
      const postData = {
        jsonDataStr: JSON.stringify(this.transformFormData(values)),
      };

      if (this.isEdit) {
        postData.campId = this.props.params.id;
        postData.sourceType = this.data.sourceType;
        postData.sourceChannel = this.data.sourceChannel;
      }

      this.setState({canSubmit: false});
      ajax({
        method: 'post',
        url,
        data: postData,
        success: () => {
          this.setState({canSubmit: true});
          Modal.success({
            title: '提交成功',
            content: '',
            onOk: () => {
              customLocation('/goods/itempromo/activityList.htm');
            },
          });
        },
        error: (data) => {
          this.setState({canSubmit: true});
          Modal.error({
            title: '提交失败',
            content: data.resultMsg || data.errorMsg || '',
          });
        },
      });
    });
  },

  checkActivityStartTime(rule, value, callback) {
    if (value === undefined) {
      callback('此处必填');
      return;
    }
    const startTime = this.props.form.getFieldValue('startTime');
    const endTime = this.props.form.getFieldValue('endTime');
    if (!startTime || !endTime) {
      callback();
      return;
    }
    if (startTime > endTime) {
      callback('开始时间必须小于结束时间');
    }
    if (moment(startTime).add(10, 'years').diff(moment(endTime)) < 0) {
      callback('开始时间和结束时间跨度必须小于 10 年');
      return;
    }
    if (this.isEdit && this.state.isCampaignStart && (startTime > this.data.activityTime[0] || endTime < this.data.activityTime[1])) {
      callback('修改时，不能缩短活动时间');
      return;
    }
    const vouchers = this.props.form.getFieldValue('vouchers') || {};
    vouchers.activityTime = [startTime, endTime];
    this.props.form.setFieldsValue({
      vouchers,
    });
    callback();
  },

  checkActivityEndTime(rule, value, callback) {
    this.props.form.validateFields(['startTime'], {force: true});
    callback();
  },

  checkShop(rule, value, callback) {
    if (value === undefined || value.length === 0) {
      callback('至少选择一家门店');
      return;
    }
    callback();
  },

  checkParticipateLimited(rule, value, callback) {
    this.props.form.validateFields(['dayParticipateLimited'], {force: true});
    callback();
  },

  checkDayParticipateLimited(rule, value, callback) {
    const participateLimitedVal = this.props.form.getFieldValue('participateLimited');
    if (value) {
      if (value < 1 || value > 99) {
        callback('输入大于0，小于100的整数');
        return;
      }
    }
    if (participateLimitedVal) {
      if (Number(participateLimitedVal) < 1 || Number(participateLimitedVal) > 99) {
        callback('输入大于0，小于100的整数');
        return;
      }
    }

    if (value && participateLimitedVal) {
      if (Number(value) > Number(participateLimitedVal)) {
        callback('每天参与次数不能大于总共参与次数');
        return;
      }
    }
    if (this.isEdit && this.state.isCampaignStart) {
      if (participateLimitedVal && Number(participateLimitedVal) < this.data.participateLimited) {
        callback('修改时，不能缩减总共参与次数');
        return;
      }
      if (value && Number(value) < this.data.dayParticipateLimited) {
        callback('修改时，不能缩减每天参与次数');
        return;
      }
    }
    callback();
  },

  syncCampName(minimumAmountType, minimumAmount, vouchers) {
    if (!vouchers || !vouchers.count || this.isEdit && this.isOnline) {
      return;
    }
    const list = [];
    if (minimumAmountType === '0' || minimumAmount === undefined || minimumAmount <= 0.01) {
      // list.push('消费即送');
      list.push('买单即送');
    } else {
      // list.push('单笔消费满' + minimumAmount + '元送');
      list.push('买单满' + minimumAmount + '元送');
    }
    // list.push(vouchers.count + '张');
    list.push(makeCouponNameForCampName(vouchers));
    if (vouchers.count > 1) {
      list.push(vouchers.count + '张');
    }
    this.props.form.setFieldsValue({
      campName: list.join(''),
    });
  },

  disabledActivityTime(value) {
    if (!value) {
      return false;
    }
    return value.getTime() < moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').toDate();
  },

  render() {
    const {loading, selectedShops, isCampaignStart} = this.state;
    const isEdit = this.isEdit;
    const {getFieldProps, getFieldValue, getFieldError} = this.props.form;
    const txtInputCls = {width: '67px', marginLeft: '5px', marginRight: '5px'};
    const isOnline = isEdit && isCampaignStart;

    let shopUrl;
    if (isEdit) {
      shopUrl = '/goods/itempromo/getShopsByCityForNewCamp.json?campId=' + this.props.params.id;
    }
    const isFromKb = this.isFromKb;

    return (
      <div>
        {!(isFromKb && isEdit) && <div className="app-detail-header">营销活动</div>}
        {isFromKb && !isEdit && (
          <div className="app-detail-header" style={{ textAlign: 'right' }}>
            <a
              href="https://cstraining.alipay.com/mobile/dingdingkb/articleDetail.htm?__nc=0&articleId=10094&tntInstId=KOUBEI_SALE_TRAINING"
              target="_blank"
            >
              <Icon type="info-circle" style={{ color: '#2db7f5' }} /> 小贴士：如何获得更多返佣？
            </a>
          </div>
        )}
        <div className="kb-detail-main" style={{overflow: 'hidden'}}>
          {!(isFromKb && isEdit) && <Breadcrumb>
            <Breadcrumb.Item style={{fontSize: '14px', color: '#0ae'}}>
              <a onClick={this.gotoListPage}><Icon type="circle-o-left" />营销活动</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{fontSize: '14px'}}>消费送礼</Breadcrumb.Item>
          </Breadcrumb>}
          {isEdit && loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>}
          {(!isEdit || !loading) && <div style={{marginTop: '32px'}}>
            <ConsumeSimulator/>

            <Form horizontal form={this.props.form} style={{float: 'left', width: '600px'}}>
              <div style={{marginLeft: '10px'}}>
                {
                  window.APP.isProvider === 'true' && window.__fd_commission_data && window.__fd_commission_data.show ?
                    <Alert message={<span>{window.__fd_commission_data.message}<a href={window.__fd_commission_data.link} target="_blank">点击查看详情</a></span>} type="info" showIcon />
                    :
                    null
                }
              </div>
              <FormItem
                label="活动时间："
                required
                validateStatus={
                classnames({
                  error: !!getFieldError('startTime'),
                })}
                help={getFieldError('startTime')}
                {...formItemLayout}>
                <DatePicker style={{width: '130px'}} disabled={isOnline} showTime format="yyyy-MM-dd HH:mm" disabledDate={this.disabledActivityTime} {...getFieldProps('startTime', {
                  rules: [this.checkActivityStartTime],
                })}/>
                <span style={{marginLeft: '5px', marginRight: '5px'}}> - </span>
                <DatePicker style={{width: '130px'}} showTime format="yyyy-MM-dd HH:mm" disabledDate={this.disabledActivityTime} {...getFieldProps('endTime', {
                  rules: [this.checkActivityEndTime],
                })}/>
              </FormItem>
              <FormItem
                label="活动门店："
                required
                {...formItemLayout} >
                <SelectShops actityType="consumeSend" selectedShops={selectedShops} form={this.props.form} canReduce={!isCampaignStart} isEdit={isEdit} shopUrl={shopUrl} {...getFieldProps('shopList', {
                  initialValue: selectedShops,
                  rules: [this.checkShop],
                })}/>
              </FormItem>
              <FormItem
                label="参与限制："
                {...formItemLayout}
                validateStatus={classnames({error: !!getFieldError('dayParticipateLimited')})}
                help={getFieldError('dayParticipateLimited')}>
                {(!isOnline || this.data.participateLimitedSwitch) ? <label className="ant-checkbox-vertical">
                  {!isOnline && <Checkbox {...getFieldProps('participateLimitedSwitch', {
                    valuePropName: 'checked',
                  })}/>}限定每个用户总共参与
                  <InputNumber {...getFieldProps('participateLimited', {
                    rules: [this.checkParticipateLimited],
                  })} min={1} step={1} style={txtInputCls} disabled={!getFieldValue('participateLimitedSwitch')}/>次
                </label> : <label className="ant-checkbox-vertical" {...getFieldProps('participateLimited', {
                  rules: [this.checkParticipateLimited],
                })}>总共参与次数不限</label>}
                {(!isOnline || this.data.dayParticipateLimitedSwitch) ? <label className="ant-checkbox-vertical" style={{marginTop: '10px'}}>
                  {!isOnline && <Checkbox {...getFieldProps('dayParticipateLimitedSwitch', {
                    valuePropName: 'checked',
                  })} />}限定每个用户每天参与
                  <InputNumber {...getFieldProps('dayParticipateLimited', {
                    rules: [this.checkDayParticipateLimited],
                  })} min={1} step={1} style={txtInputCls} disabled={!getFieldValue('dayParticipateLimitedSwitch')}/>次
                </label> : <label className="ant-checkbox-vertical" {...getFieldProps('dayParticipateLimited', {
                  rules: [this.checkDayParticipateLimited],
                })}>每天参与次数不限</label>}
              </FormItem>
              <FormItem
                label="活动规则："
                required
                validateStatus={classnames({error: !!getFieldError('minimumAmount')})}
                help={getFieldError('minimumAmount')}
                {...formItemLayout}>
                  {isOnline && <p className="ant-form-text">{this.data.campRule || ''}</p>}
                  {!isOnline && <Select {...getFieldProps('minimumAmountType', {
                    onChange: this.onMinimumAmountTypeChange,
                  })} style={{width: 100}}>
                    <Option value="0">消费即送</Option>
                    <Option value="1">消费满送</Option>
                  </Select>}
                  {!isOnline && getFieldValue('minimumAmountType') === '1' && <span style={{marginLeft: '5px'}}>
                    需单笔消费满
                    <InputNumber size="large" min={0} step={0.01} style={txtInputCls}
                    {...getFieldProps('minimumAmount', {
                      normalize: (v) => Number(v),
                      onChange: this.onMinimumAmountChange,
                      rules: [{
                        required: true,
                        message: '请填写金额',
                        type: 'number',
                      }],
                    }) }/>元
                  </span>}
              </FormItem>
              <FormItem
                label="活动奖品："
                required
                {...formItemLayout}>
                <InputCoupon isEdit={isEdit} isCampaignStart={isCampaignStart} parentForm={this.props.form} {...getFieldProps('vouchers', {
                  validateFirst: true,
                  onChange: this.onVouchersChange,
                  rules: [{
                    required: true,
                    message: '请添加活动奖品',
                    type: 'object',
                  }],
                })}/>
              </FormItem>
              <FormItem
                label="活动名称："
                required
                {...formItemLayout}>
                {isOnline ? <p className="ant-form-text">{this.data.campName}</p> :
                <Input disabled style={{width: '250px'}} placeholder="填写完奖品将自动生成该名称" {...getFieldProps('campName', {
                  validateFirst: true,
                  rules: [{
                    required: true,
                    message: '此处必填',
                    type: 'string',
                  }, (r, v, cb) => {
                    if (v.length > 50) {
                      return cb(new Error('活动名称不能超过 50 个字符。'));
                    }
                    cb();
                  }],
                })}/>}
              </FormItem>
              {getFieldValue('vouchers') && getFieldValue('vouchers').validTimeType === 'FIXED' ? null :
              <FormItem
                label="自动续期："
                ref="autoDelay"
                extra={isOnline ? '' : '上架时间结束时，若券未送完，则自动延期，每次延期30天'}
                {...formItemLayout}>
                {isOnline ? <p className="ant-form-text">{this.data.autoDelayFlag === 'Y' ? '是' : '否'}</p> :
                <label className="ant-checkbox-vertical"><Checkbox {...getFieldProps('autoDelayFlag', {
                  valuePropName: 'checked',
                  initialValue: !isEdit ? true : this.data.autoDelayFlag === 'Y',
                })}>自动延长券上架时间</Checkbox></label>}
              </FormItem>
              }
              <FormItem wrapperCol={{span: 12, offset: 6}}>
                <Button type="primary" onClick={this.handleSubmit} loading={!this.state.canSubmit}>提交</Button>
              </FormItem>
            </Form>
          </div>}
        </div>
      </div>
    );
  },
});

export default Form.create()(NewConsume);
