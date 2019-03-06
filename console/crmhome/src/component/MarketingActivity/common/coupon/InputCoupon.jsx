import React, {PropTypes} from 'react';
import {Select, Icon} from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import Decimal from 'decimal.js';
import InputCouponModal from './InputCouponModal';
import {couponType, couponStyle, getShopIds} from './util';
import ajax from '../../../../common/ajax';

const Option = Select.Option;

const editBtnStyle = {
  display: 'inline-block',
  verticalAlign: 'top',
  textAlign: 'center',
  backgroundColor: '#8a8a8a',
  color: '#fff',
  borderRadius: '100%',
  lineHeight: '24px',
  width: 24,
  marginTop: 4,
  marginLeft: 8,
};
/*eslint-disable */
export function transformCouponFormData(data, isEdit = false) {
  /*eslint-enable */
  const newData = {};
  const keys = [
    'voucherName',
    'brandName',
    'itemDetail',
    'couponValue',
    'itemIds',
    'itemName',
    'itemLink',
    'maxAmount',
    'effectType',
    'donateFlag',
    'validTimeType',
    'forbiddenDateKeys',
    'descListKeys',
    'descList',
    'shopList',
    'activityTime',
    'availableTimeType',
    'voucherNote',
  ];
  keys.forEach((key) => {
    if (data[key] !== undefined) {
      newData[key] = data[key];
    }
  });
  if (data.myType === 'ALL_MONEY') {
    newData.promotionType = 'ALL_ITEM';
    newData.vouchersType = 'MONEY';
  } else {
    newData.promotionType = 'SINGLE_ITEM';
    newData.vouchersType = data.myType === 'ONE_RATE' ? 'RATE' : 'MONEY';
  }
  if (data.reduceType === '2') {
    newData.vouchersType = 'REDUCETO';
  }

  if (data.itemName && data.myType !== 'ALL_MONEY') { // 单品券才有 itemName
    newData.voucherName = data.itemName;
  }

  if (data.voucherLogo && data.voucherLogo[0]) {
    newData.voucherLogo = data.voucherLogo[0].id;
    newData.voucherLogoUrl = data.voucherLogo[0].url;
  }
  if (data.voucherImg && data.voucherImg[0]) {
    newData.voucherImg = data.voucherImg[0].id;
    newData.voucherImgUrl = data.voucherImg[0].url;
  }
  if (data.conditionsOfUseType === '2') {
    if (data.myType === 'ONE_RATE' || data.reduceType === '2') {
      newData.minItemNum = data.minItemNum;
      newData.maxDiscountItemNum = data.maxDiscountItemNum;
    } else {
      newData.minConsume = data.minConsume;
    }
  }
  if (data.itemIds) {
    newData.itemIds = data.itemIds.split(/\s/).filter((line) => {
      return line.trim() !== '';
    });
  }
  if (data.rate) {
    newData.rate = parseFloat(new Decimal(data.rate).div(10).toString());
  }
  if (data.validTimeType === 'FIXED') {
    if (data.validTime && data.validTime[0]) {
      newData.validTimeFrom = moment(data.validTime[0]).format('YYYY-MM-DD HH:mm');
    }
    if (data.validTime && data.validTime[1]) {
      newData.validTimeTo = moment(data.validTime[1]).format('YYYY-MM-DD HH:mm');
    }
  } else {
    newData.validPeriod = data.validPeriod;
  }

  if (data.availableTimeType === '2' && data.timeKeys.length) {
    const availableTimes = [];
    for (let i = 0; i < data.timeKeys.length; i++) {
      const key = data.timeKeys[i];
      const start = typeof data[`activeTimeStart${key}`] !== 'string' ? moment(data[`activeTimeStart${key}`]).format('HH:mm:ss') : data[`activeTimeStart${key}`];
      const end = typeof data[`activeTimeEnd${key}`] !== 'string' ? moment(data[`activeTimeEnd${key}`]).format('HH:mm:ss') : data[`activeTimeEnd${key}`];
      availableTimes.push({
        values: data[`activeTimeWeek${key}`].join(','),
        times: `${start},${end}`,
      });
    }
    newData.availableTimes = availableTimes;
  }

  if (data.forbiddenDateType === '2' && data.forbiddenDate) {
    const forbiddenDates = data.forbiddenDate.map((date) => {
      return [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')].join(',');
    });
    if (forbiddenDates.length > 0) {
      newData.forbiddenDates = forbiddenDates.join('^');
    }
  }
  if (data.reduceType === '2') {
    newData.originPrice = data.originPrice;
    newData.couponValue = data.reduceToPrice;
  }

  if (data.budgetAmountType === '2') {
    newData.budgetAmount = data.budgetAmount;
    newData.addedBudgetAmount = data.addedBudgetAmount;
  } else {
    newData.budgetAmount = 999999999;
  }

  // targetShopType 为 1（同活动门店时）
  if (data.targetShopType === '1') {
    newData.targetShopType = '1';
  } else {
    // newData.shopIds = getShopIds(newData.shopList).filter(d => !!d);
    const shopList = data.shopList;

    if (shopList.shopType && shopList.shopType === 'select') {
      newData.shopType = shopList.shopType;
      newData.shopIds = getShopIds(shopList.checked).filter(d => !!d);
    } else if (shopList.shopType && shopList.shopType === 'upload') {
      newData.shopType = shopList.shopType;
      newData.logId = shopList.logId;
    } else {
      // 默认
      // 场景： 用户修改，追加门店为未打开浮层，
      // 重新组装数据给后端
      newData.shopIds = getShopIds(shopList).filter(d => !!d);
    }
  }
  return newData;
}
/*eslint-disable */
export function transformCouponDefaultData(data) {
  /*eslint-enable */
  const newData = lodash.cloneDeep(data);
  if (newData.promotionType) {
    if (newData.promotionType === 'ALL_ITEM') {
      newData.promotionType = 'ALL_MONEY';
      newData.myType = 'ALL_MONEY';
    } else {
      newData.promotionType = 'ONE_RATE';
      newData.myType = data.vouchersType === 'RATE' ? 'ONE_RATE' : 'ONE_MONEY';
    }
  }
  if (data.voucherLogo) {
    newData.voucherLogo = [{
      id: data.voucherLogo,
      url: data.voucherLogoUrl,
    }];
  }
  if (data.voucherImg) {
    newData.voucherImg = [{
      id: data.voucherImg,
      url: data.voucherImgUrl,
    }];
  }
  newData.conditionsOfUseType = data.minConsume === undefined && data.minItemNum === undefined ? '1' : '2';
  if (data.itemIds) {
    newData.itemIds = data.itemIds.join('\n');
  }
  if (data.rate) {
    newData.rate = parseFloat(new Decimal(data.rate).mul(10).toString());
  }
  if (data.effectType === undefined) {
    data.effectType = '0';
  }
  if (data.donateFlag === undefined) {
    data.donateFlag = '1';
  }
  if (data.validPeriod === undefined && data.validTimeFrom === undefined) {
    newData.validTimeType = 'RELATIVE';
    newData.validTime = [
      moment(moment().format('YYYY-MM-DD') + ' 00:00', 'YYYY-MM-DD HH:mm').toDate(),
      moment(moment().add(1, 'months').format('YYYY-MM-DD') + ' 23:59', 'YYYY-MM-DD HH:mm').toDate(),
    ];
  } else {
    newData.validTimeType = data.validPeriod !== undefined ? 'RELATIVE' : 'FIXED';
    if (newData.validTimeType === 'FIXED') {
      newData.validTime = [
        moment(data.validTimeFrom, 'YYYY-MM-DD HH:mm').toDate(),
        moment(data.validTimeTo, 'YYYY-MM-DD HH:mm').toDate(),
      ];
    }
  }
  if (data.validPeriod === undefined) {
    newData.validPeriod = 30;
  }
  newData.targetShopType = data.isSameShops === undefined || data.isSameShops ? '1' : '2';
  newData.reduceType = data.vouchersType === 'REDUCETO' ? '2' : '1';
  if (data.vouchersType === 'REDUCETO') {
    newData.reduceToPrice = data.couponValue;
    delete newData.couponValue;
  }
  newData.maxAmountType = data.maxAmount === undefined ? '1' : '2';
  newData.budgetAmountType = (data.budgetAmount === undefined || data.budgetAmount === 999999999) ? '1' : '2';
  if (data.budgetAmount === undefined) {
    newData.budgetAmount = 999999999;
  }

  newData.availableTimeType = !!data.availableTimes && data.availableTimes.length ? '2' : '1';
  if (newData.availableTimeType === '1') {
    newData.timeKeys = [0];
    newData.activeTimeStart0 = moment('00:00:00', 'HH:mm:ss').toDate();
    newData.activeTimeEnd0 = moment('23:59:59', 'HH:mm:ss').toDate();
  } else {
    newData.timeKeys = lodash.range(data.availableTimes.length);
    newData.timeKeys.forEach(idx => {
      const time = data.availableTimes[idx];
      const [time1, time2] = time.times.split(',');
      const weeks = (time.values || '1,2,3,4,5,6,7').split(',');
      newData[`activeTimeStart${idx}`] = moment(time1, 'HH:mm:ss').toDate();
      newData[`activeTimeEnd${idx}`] = moment(time2, 'HH:mm:ss').toDate();
      newData[`activeTimeWeek${idx}`] = weeks;
    });
  }
  newData.forbiddenDateType = data.forbiddenDates === undefined ? '1' : '2';
  if (data.forbiddenDates !== undefined) {
    newData.forbiddenDate = data.forbiddenDates.split('^').map((row) => {
      const dates = row.split(',');
      return [
        moment(dates[0], 'YYYY-MM-DD').toDate(),
        moment(dates[1], 'YYYY-MM-DD').toDate(),
      ];
    });
  }
  if (data.forbiddenDateKeys) {
    data.forbiddenDateKeys.forEach((key, i) => {
      if (newData.forbiddenDate) {
        newData['forbiddenDate' + key] = newData.forbiddenDate[i];
      }
    });
  } else {
    newData.forbiddenDateKeys = [0];
  }
  if (data.descListKeys) {
    data.descListKeys.forEach((key, i) => {
      if (data.descList) {
        newData['descList' + key] = data.descList[i];
      }
    });
  } else {
    newData.descListKeys = [0];
  }
  return newData;
}

// 生成券名称
export function makeCouponName(data) {
  const defaultData = transformCouponDefaultData(data);
  const myType = defaultData.myType;
  const list = [];
  let hasLast = true;
  if (myType === 'ALL_MONEY') {
    list.push(defaultData.couponValue + '元');
  }
  if (myType === 'ONE_RATE') {
    list.push(defaultData.rate + '折');
  }
  if (myType === 'ONE_MONEY') {
    if (defaultData.reduceType === '1') {
      list.push(defaultData.couponValue + '元');
    } else {
      list.push('优惠价：' + defaultData.reduceToPrice + '元');
      list.push(<br key="1"/>);
      list.push('原价：' + defaultData.originPrice + '元');
      hasLast = false;
    }
  }
  if (hasLast) {
    list.push(<br key="2"/>);
    list.push(couponType[myType]);
  }
  return list;
}

// 生成券名称，用于活动名称
export function makeCouponNameForCampName(data) {
  const defaultData = transformCouponDefaultData(data);
  const myType = defaultData.myType;

  if (myType === 'ALL_MONEY') {
    // if (defaultData.voucherName) {
    //   return defaultData.voucherName;
    // }
    return defaultData.couponValue + '元代金券';
  }
  if (myType === 'ONE_RATE') {
    // if (defaultData.itemName) {
    //   return defaultData.itemName;
    // }
    return defaultData.itemName + defaultData.rate + '折券';
  }
  if (myType === 'ONE_MONEY') {
    // if (defaultData.itemName) {
    //   return defaultData.itemName;
    // }
    if (defaultData.reduceType === '1') { // reduceType为1是单品减去券 即单品优惠券
      return defaultData.itemName + defaultData.couponValue + '元代金券';
    }
    // reduceType为2是单品至券 既换购券
    return defaultData.itemName + defaultData.reduceToPrice + '元换购券';
  }
}

const InputCoupon = React.createClass({
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
    parentForm: PropTypes.object,
  },

  getInitialState() {
    return {
      value: this.props.value || {},
      showModal: false,
    };
  },
  componentWillUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  },
  onCountChange(count) {
    const prevValue = this.state.value;
    const value = {
      ...prevValue,
      count,
    };
    this.setState({
      value,
    });
    this.props.onChange(value);
  },
  checkIsSingleVisible() {
    const url = '/goods/verifyFunction.json?functionCode=010101';
    ajax({
      url: url,
      method: 'get',
      type: 'json',
      success: (result) => {
        this.setState({
          isSignleVisible: result.isValid,
          showModal: true,
        });
      },
    });
  },
  showModal(e) {
    e.preventDefault();
    this.checkIsSingleVisible();
  },

  confirmModal(error, values, subForm) {
    if (error) {
      return;
    }
    const pform = this.props.parentForm;
    if (values.validTimeType === 'FIXED') {
      const err = [];
      if (values.validTime[1] < pform.getFieldValue('endTime')) {
        err.push(new Error('券有效期结束时间必须等于或晚于活动结束时间'));
      }
      if (values.validTime[0] < pform.getFieldValue('startTime')) {
        err.push(new Error('券有效期开始时间必须等于或晚于活动开始时间'));
      }
      if (err.length) {
        subForm.setFields({
          validTimeType: {
            value: 'FIXED',
            errors: err,
          },
        });
        return;
      }
    }

    const prevValue = this.state.value;
    const data = transformCouponFormData(values, this.props.isEdit);
    const value = {
      ...data,
      count: prevValue.count || 1,
    };
    this.setState({
      value,
    });
    this.props.onChange(value);
    this.hideModal();
  },

  hideModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    const {value, showModal, isSignleVisible} = this.state;
    const data = transformCouponDefaultData(value);
    const count = data.count || 1;
    const hasData = data && data.myType;
    const {isEdit} = this.props;
    const optionList = [];
    for (let i = 1; i <= 5; i++) {
      optionList.push(<Option key={i}>{i}</Option>);
    }
    return (<div>
      {!hasData && <a href="#" onClick={this.showModal}>添加券</a>}
      {hasData && (<div>
        <span>每次送</span>
        <span style={couponStyle}>
          {makeCouponName(value)}
        </span>
        {hasData && <a href="#" style={editBtnStyle} onClick={this.showModal}><Icon type="edit" /></a>}
        {!isEdit && hasData && <div style={{display: 'inline-block', verticalAlign: 'top', marginLeft: 16}}>
          <Select style={{width: 60}} placeholder="请选择" defaultValue={count} onChange={this.onCountChange}>{optionList}</Select>
        </div>}
        {!isEdit && <span style={{marginLeft: 8}}>张</span>}
        {isEdit && <span style={{marginLeft: 8}}>{count}张</span>}
      </div>)}
      <InputCouponModal showModal={showModal} isSignleVisible={isSignleVisible} data={data}
        isCampaignStart={this.props.isCampaignStart}
        isEdit={isEdit} onOk={this.confirmModal} onCancel={this.hideModal}/>
    </div>);
  },
});

export default InputCoupon;
