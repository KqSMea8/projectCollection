import React from 'react';
import Input from './Input';
import ReduceTo from './ReduceTo';
import SelectShops from './SelectShops';
import InputTotal from './InputTotal';
import InputTotal2 from './InputTotal2';
import ValidDate from './ValidDate';
import ValidDate2 from './ValidDate2';
import TypeSelect from './TypeSelect';
import ContentInput from './ContentInput';
import UpGoodsImage from './UpGoodsImage';
import CommodityDetail from './CommodityDetail';
import BusinessIntroduction from './BusinessIntroduction';
import Dishes from './Dishes';
import AddableInput from './AddableInput';
import CommodityContent from './CommodityContent';
import Discount from './Discount';
import SelectShopsAsync from './SelectShopsAsync';
import ShelfTime from './ShelfTime';
import MultiValidTime from './MultiValidTime';
import MultiValidTime2 from './MultiValidTime2';
import UsageMode from './UsageMode';
import GetEffect from './GetEffect';
import MultiInvalidTime from './MultiInvalidTime';
import CheckboxRenewal from './CheckboxRenewal';
import GetTheLimit from './GetTheLimit';
import ConsumptionLimit from './ConsumptionLimit';
import PeopleLimit from './PeopleLimit';
import ChannelLimit from './ChannelLimit';
import ScopeOfApplication from './ScopeOfApplication';
import ParticipateLimit from './ParticipateLimit';    // 参与限制
import Radio from './Radio';
import BrandName from './BrandName';
import Reduce from './Reduce';
import CouponValue from './CouponValue';  // 全面额
import OnlineTime from './OnlineTime';    // 上架时间
import MinimumAmount from './MinimumAmount';
import CateringCategory from './CateringCategory';   // 所属类目
import CancelAfterVerification from './CancelAfterVerification'; // 核销方式
import CommodityType from './CommodityType'; // 商品类型
import InputShare from './InputShare';  // 商品包含
import DisplayChannels from './DisplayChannels'; // 商品展示渠道
import TagesSelect from './TagesSelect'; // new 商品编码
import SelectShopsWithExcel from './SelectShopsWithExcel';
import GoodsFirstImage from './GoodsFirstImage'; // new 商品首图 1:1
import GoodsFirstImageV2 from './GoodsFirstImageV2/index'; // new 商品首图 1:1
import BuyInstructions from './BuyInstructions'; //  new 购买须知
import SellTime from './SellTime';
import SalesPeriod from './SalesPeriod';    // 售卖时间
import ExternalAppId from './ExternalAppId';  // 外部 APPID
import GoodsProperty from './GoodsProperty';  // 商品属性
import ServIndustryDetail from './ServIndustryDetail';  // 泛行业商品详情
import NewContent from './ServIndustryDetail/Content';
import AddMultiLines from './AddMultiLines'; // 多行新增
import AddService from './AddService'; // 服务分类

const FORM_COMPONENTS = {
  Input,
  ReduceTo,
  InputTotal,
  InputTotal2,
  InputShare,
  ValidDate,
  ValidDate2,
  TypeSelect,
  ContentInput,
  UpGoodsImage,
  SelectShops,
  CommodityDetail,
  BusinessIntroduction,
  Dishes,
  AddableInput,
  CommodityContent,
  Discount,
  SelectShopsAsync,
  ShelfTime,
  MultiValidTime,
  MultiValidTime2,
  UsageMode,
  GetEffect,
  MultiInvalidTime,
  CheckboxRenewal,
  GetTheLimit,
  ConsumptionLimit,
  PeopleLimit,
  ChannelLimit,
  ScopeOfApplication,
  ParticipateLimit,
  Radio,
  BrandName,
  Reduce,
  CouponValue,
  OnlineTime,
  MinimumAmount,
  CateringCategory,
  CancelAfterVerification,
  CommodityType,
  DisplayChannels,
  TagesSelect,
  SelectShopsWithExcel,
  GoodsFirstImage,
  GoodsFirstImageV2,
  BuyInstructions,
  SellTime,
  SalesPeriod,
  ExternalAppId,
  GoodsProperty,
  ServIndustryDetail,
  NewContent,
  AddMultiLines,
  AddService,
};

export default (props, ctx) => {
  const cls = FORM_COMPONENTS[props.component];
  if (typeof props.rules === 'function') {
    props.rules = props.rules(ctx);
  }
  return React.createElement(cls, props);
};
