import React, { Component } from 'react';
import { Form, Spin, Button, message as msg, Breadcrumb, Icon, Modal, Alert } from 'antd';
import ajax from '../../../common/ajax';
import componentGetter from '../common/ComponentGetter';
import moment from 'moment';
import CommodityTypeFormCfg from './CommodityTypeFormCfg';
import onlinePurchaseCfg from './OnlinePurchaseCfg';
import OtherToFormCfg from '../Catering/OtherToFormCfg';
import RulesToFormCfg from '../Catering/RulesToFormCfg';

import CommonSimulator from '../../MarketingActivity/common/CommonSimulator';
import FormBanner from '../../MarketingActivity/common/FormBanner';
import { isFromKbServ, keepSession, fixFrameHeight, getUriParam, saveJumpTo, getImageById } from '../../../common/utils';
import { cloneDeep, set, get } from 'lodash';
import ApplySignModal from '../Activity/ApplySignModal';
import { PhotoPicker } from '@alipay/xform';
import classnames from 'classnames';

const PAGE_SIZE = 21;
let selections = [];
let selsectInit = [];
const modalOpts = {
  cutRate: 4 / 3,
  containerHeight: 300,
  containerWidth: 400,
  width: 800,
  previewTitle: (<h4>上传的图片将会展示如下，<br />请确保图片重要内容居中完整显示，且不可有水印。</h4>),
  previews: [{
    style: { width: 125, height: 125 },
    title: '商家详情页--优惠券入口--商品预览图',
  }, {
    style: { width: 240, height: 135 },
    title: '券详情页--商品预览图',
  }],
};
const ERROR = PhotoPicker.ERROR;
const FormItem = Form.Item;
const message = { ...msg };
if (window.top !== window) {
  ['error', 'warn', 'success'].forEach(f => {
    message[f] = function iframeMessage(text) {
      window.parent.postMessage(JSON.stringify({ action: f, message: text }), '*');
    };
  });
}
// 商品售卖默认显示时间
const salesPeriodStart = moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
const salesPeriodEnd = moment(salesPeriodStart, 'YYYY-MM-DD').add(1, 'd').add(3, 'M').add(-1, 's').format('YYYY-MM-DD HH:mm:ss');

function renderTip(tip) {
  if (!tip) {
    return <span style={{ fontWeight: 400 }}>该内容仅用于展示，不影响实际核销。</span>;
  }
  return (
    <span>
      <span style={{ fontWeight: 400 }}>该内容仅用于展示，不影响实际核销。建议设置：</span>
      <span style={{ color: '#ff9900' }}>{tip}</span>
    </span>
  );
}

function genUrl(data) {
  if (data) {
    return getImageById(data);
  }
  return null;
}
function getItemDetailImages(data) {
  if (!data || data.length <= 0) {
    return [];
  }
  return data.map((item) => {
    return item.uid;
  });
}

function genImageObj(data) {
  if (!data) {
    return [];
  }
  return data.map((i) => {
    return {
      id: i,
      url: genUrl(i),
      thumbUrl: genUrl(i),
    };
  });
}
function transformListData(data) {
  if (!data.materialVOList) {
    return [];
  }
  return data.materialVOList.map((row) => {
    return {
      uid: row.sourceId,
      url: row.url,
    };
  });
}
function parseDetailData(old) {
  if (!old) {
    return {};
  }
  const data = cloneDeep(old);
  if (data.dishes && Array.isArray(data.dishes)) {
    data.dishes.forEach((item, i) => {
      const dishImages = data.dishes[i].imageUrls || [];
      set(data, 'dishes[' + i + '].imageUrls', genImageObj(dishImages));
    });
  }
  // 泛行业不需要详情 -- 商家介绍
  // const introImages = data.introductions && data.introductions[0].imageUrls || [];
  // set(data, 'introductions[0].imageUrls', genImageObj(introImages));
  if (data.itemImage && data.itemImage.length) {
    data.firstImage = {};
    data.firstImage.itemImage = data.itemImage[0];
    if (data.taobaoCoverImage) {
      data.firstImage.taobaoCoverImage = data.taobaoCoverImage;
    }
  }
  if (data.itemDetailImages && data.itemDetailImages.length > 0) {
    data.itemDetailImages = data.itemDetailImages.map(item => {
      return {
        uid: item,
        url: genUrl(item),
      };
    });
  }
  return data;
}

function deparse(old) {
  const data = cloneDeep(old);
  let urls;
  if (Array.isArray(data)) {
    data.forEach((i) => {
      urls = [];
      if (Array.isArray(i.imageUrls)) {
        i.imageUrls.forEach((item) => {
          urls.push(item.id);
        });
      }
      i.imageUrls = urls;
    });
  }
  return data;
}

function parseAvailableTimes(type, input) {
  if (type === '0' || !input) {
    return null;
  }
  let output;
  if (Array.isArray(input)) {
    output = input.map((item) => {
      return {
        values: item.days.join(','),
        times: item.startTime + ',' + item.endTime,
      };
    });
  }
  return output;
}

function deparseAvailableTimes(input) {
  if (!input) {
    return [];
  }
  let output;
  if (Array.isArray(input)) {
    output = input.map((item) => {
      const times = item.times.split(',');
      return {
        days: item.values.split(','),
        startTime: times[0],
        endTime: times[1],
      };
    });
  }
  return output;
}

function parseForbiddenDates(type, input) {
  if (type === '0' || !input) {
    return null;
  }
  const output = [];
  if (Array.isArray(input)) {
    input.forEach((item) => {
      if (item.length > 1) {
        output.push(item[0] + ',' + item[1]);
      }
    });
  }
  return output.join('^');
}

function deparseForbiddenDates(input) {
  if (!input) {
    return null;
  }
  const inputt = input.split('^');
  const output = [];
  if (Array.isArray(inputt)) {
    inputt.forEach((item) => {
      const old = item.slice();
      const newone = [];
      newone.push(old.split(',')[0]);
      newone.push(old.split(',')[1]);
      output.push(newone);
    });
  }
  return output;
}
function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
}
function removeDuplicate(arr) {
  const tmpMap = {};
  arr.forEach(item => {
    tmpMap[item.uid] = item;
  });
  const newArr = [];
  Object.keys(tmpMap).forEach((i) => {
    newArr.push(tmpMap[i]);
  });
  return newArr;
}
function isValidContents(arr) {
  if (!Array.isArray(arr)) {
    return false;
  }
  let retu = true;
  arr.forEach((item) => {
    if (!(!!item.title)) {
      retu = false;
      return;
    }
    if (item.title.length > 15) {
      retu = false;
      return;
    }
    if (!Array.isArray(item.itemUnits)) {
      retu = false;
      return;
    }
    item.itemUnits.forEach((i) => {
      if (!(!!i.name)) {
        retu = false;
        return;
      }
      if (i.name.length > 40) {
        retu = false;
        return;
      }
      if (!(!!i.price)) {
        retu = false;
        return;
      }
      if (!(!!i.amount)) {
        retu = false;
        return;
      }
      if (!(!!i.unit)) {
        retu = false;
        return;
      }
    });
  });
  return retu;
}

function isValidDishes(arr) {
  if (!Array.isArray(arr)) {
    return false;
  }
  let retu = true;
  arr.forEach((item) => {
    if (!(!!item.title)) {
      retu = false;
      return;
    }
    if (item.title.length > 40) {
      retu = false;
      return;
    }
    if (item.desc && item.desc.length > 50) {
      retu = false;
      return;
    }
    if (!Array.isArray(item.imageUrls)) {
      retu = false;
      return;
    }
    if (!item.imageUrls.length || item.imageUrls.length > 3) {
      retu = false;
      return;
    }
  });
  return retu;
}

function isValidIntroductionText(str = '') {
  if (str.length > 500) {
    return false;
  }
  return true;
}

function isValidIntroductionImg(arr) {
  if (Array.isArray(arr) && arr.length > 10) {
    return false;
  }
  return true;
}

const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};
class OnlinePurchase extends Component {
  static propTypes = {
    history: React.PropTypes.object,
  }
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      selections: [],
      total: 0,
      listLoading: false,
      current: 1,
      isLoading: true,      // 读取数据库默认回填值
      isPostLoading: false, // 提交 loading
      initData: {},
      shopList: [],
      allowModifyKeyFields: true,
      submitedSuccess: false,
      allowSubmit: true,    // 是否显示提交按钮 （只有在 leadsId 查询的情况下才会有可能是 false）
      sequenceId: null,   // 智能商品才用，后端要求 查询 leadsId 时，若返回了 sequenceId 则提交时也给出 sequenceId
      itemId: null,   // 商品数据迁移技改，存放详情接口返回的 itemId
      showSignModal: false,   // 在线购买弹层是否显示
      rate: 0,  // 在线购买费率
      signed: undefined,
      leadsType: undefined,  // leads 情况下区分券类型
      isWhiteListUser: false,   // 白名单用户必须填写商品编码
      commodityType: [],  // 商品类型option
      // verifyFrequency: 'single', // 商品类型 默认为 single， 一键搬家场景需要删除该字段
      intelligentLock: false, // 一键搬家主要信息锁定
    };
    this.pid = getUriParam('op_merchant_id', location.search);
    const hashSearch = this.props.history.search;
    this.leadsId = getUriParam('leadsId', hashSearch);
    this.sequenceId = getUriParam('sequenceId', hashSearch);
    this.itemId = getUriParam('itemId', hashSearch);
    this.onlinePurchaseCfg = onlinePurchaseCfg(!!this.leadsId || !!this.itemId || !!this.sequenceId);
  }

  componentDidMount() {
    this.fetchInitData();
    // 商品类型多次核销
    if (!this.leadsId) {  // 非一键搬家才请求
      this.queryAvailableItemType();
    }
    // this.onPageChange(1);
    if (window.top !== window) {
      fixFrameHeight();
      window.top.postMessage(JSON.stringify({ action: 'scrollTop', scrollTop: 0 }), '*');
    }
    keepSession();
  }
  /* eslint-disable */
  setFormInitValue(res) {
    let displayChannels = 'ALL';
    if (res.displayChannels === 'ALL' || res.displayChannels === 'ORIENTATION') {
      displayChannels = res.displayChannels;
    }

    const initValue = {
      title: res.title || '',
      originPrice: res.originPrice && Number(res.originPrice) || '',
      price: res.price && Number(res.price) || '',
      itemDetailImages: res.itemDetailImages || [],
      firstImage: res.firstImage,
      contents: res.contents, // || [{title: null, itemUnits: [{}]}],
      dishes: res.dishes && res.dishes.length > 0 ? res.dishes : [{ title: '', desc: '', imageUrls: [] }],
      // introductions: res.introductions,
      // introductionText: get(res, 'introductions[0].title'),
      // introductionImage: get(res, 'introductions[0].imageUrls'),
      totalAmount: res.totalAmount || 99999999,
      latestNotices: get(res, 'latestNotices[0]') || '',
      buyTips: res.buyTips || [{ key: '', value: [''] }],
      remarks: res.remarks,
      validTimeType: res.validTimeType || 'RELATIVE',
      shopIds: res.shopIds || [],
      availableTimes: deparseAvailableTimes(res.availableTimes),
      availableTimesType: res.availableTimes ? '1' : '0',
      forbiddenDatesType: res.forbiddenDates ? '1' : '0',
      forbiddenDates: deparseForbiddenDates(res.forbiddenDates),
      goodsIds: (res.goodsIds || []).join('\n'),
      categoryPath: res.categoryPath,
      remark: res.remark || '', // 备注
      ticketDisplayMode: res.ticketDisplayMode || '', // 核销方式
      verifyEnableTimes: res.verifyEnableTimes && Number(res.verifyEnableTimes) || '', //多次核销的包含量
      verifyFrequency: res.verifyFrequency || 'single',
      displayChannels, // 商品展示渠道
      salesPeriodStart: res.salesPeriodStart || salesPeriodStart,  //新增售卖有效期开始字段
      salesPeriodEnd: res.salesPeriodEnd || salesPeriodEnd //新增售卖有效期结束字段
    };
    if (res.validTimeType === 'FIXED' && res.validTimeFrom && res.validTimeTo) {
      initValue.validTime = [res.validTimeFrom, res.validTimeTo];
      res.validTime = [res.validTimeFrom, res.validTimeTo];
    } else {
      initValue.rangeTo = res.rangeTo || 360;
    }
    this.props.form.setFieldsValue(initValue);
    if (Array.isArray(res.contents)) {
      res.contents.forEach((item, row) => {
        this.props.form.setFieldsValue({
          ['contents' + row + 'title']: item.title,
          ['contents' + row + 'group']: item.itemUnits,
        });
      });
    }
    if (Array.isArray(res.dishes)) {
      res.dishes.forEach((item, row) => {
        this.props.form.setFieldsValue({
          ['dishes' + row + 'title']: item.title,
          ['dishes' + row + 'desc']: item.desc,
          ['dishes' + row + 'images']: item.imageUrls,
        });
      });
    }
    if (Array.isArray(res.remarks)) {
      res.remarks.forEach((item, row) => {
        this.props.form.setFieldsValue({
          ['remarks' + row]: item,
        });
      });
    }

    if (!res.buyTips || !res.buyTips.length) {
      set(res, 'buyTips', [{ key: '', value: [''] }]);
    }
    if (res.itemDetailImages && res.itemDetailImages.length > 0) {
      selsectInit = res.itemDetailImages;
    }

    this.setState({
      isLoading: false,
      initData: res,
      shopList: res.shop,
    });
    this.availableTimeTip = res.availableTimeTip && res.availableTimeTip.value.join('；');
    this.unavailableTimeTip = res.unavailableTimeTip && res.unavailableTimeTip.value.join('；');
  }
  getSelectModalOpts = () => {
    const modalOpts = {
      data: this.state.selections,
      listLoading: this.state.listLoading,
      onPageChange: this.onPageChange,
      current: this.state.current,
    };
    if (this.state.total > PAGE_SIZE) {
      modalOpts.total = this.state.total;
    }
    return modalOpts;
  }
  onPageChange = (pageIndex) => {
    this.setState({
      listLoading: true,
    });
    ajax({
      url: '/material/pageMaterial.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.success && res.materialVOList) {
          selections = [...selsectInit, ...transformListData(res)];
          selections = removeDuplicate(selections);
          this.setState({
            selections: selections.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE),
            current: pageIndex,
            listLoading: false,
            total: selections.length,
          });
        } else {
          this.setState({ listLoading: false });
        }
      },
      error: () => {
        this.setState({ listLoading: false });
      },
    });
  }
  onError = (errCode) => {
    let msg = '';
    if (errCode === ERROR.FILE_EXT) {
      msg = '文件后缀有误';
    } else if (errCode === ERROR.FILE_SIZE) {
      msg = '文件过大';
    } else if (errCode === ERROR.FILE_BEFORE_UPLOAD_FAIL) {
      msg = '前置校验失败';
    }
    if (msg) {
      message.error(msg);
    }
  }
  onCut = (cropInfo, next) => {
    const cutParams = {
      xx: cropInfo.X,
      yy: cropInfo.Y,
      width: cropInfo.width,
      height: cropInfo.height,
      orgWidth: cropInfo.imgWidth,
      orgHeight: cropInfo.imgHeight,
      avatarImage: this.fileUrl,
      fileType: this.fileType,
    };
    ajax({
      url: '/goods/itempromo/cutPicture.json',
      method: 'post',
      type: 'json',
      data: cutParams,
      success: (res) => {
        if (res.status === 'succeed') {
          const newFile = { uid: res.fileId, url: res.result };
          next(newFile);
          selections.unshift(newFile);
          this.setState({
            total: selections.length,
          });
          this.onPageChange(1);
        } else {
          message.error(res.resultMsg || '裁剪失败');
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '裁剪失败');
      },
    });
  }

  converter = resp => {
    if (resp.success) {
      const { url, properties, sourceId } = resp.imgModel.materialList[0];
      this.fileType = properties.suffix || 'jpg';
      this.fileUrl = url;
      return {
        uid: sourceId,
        url,
      };
    }
    message.error('上传图片异常');
  }
  // 获取初始数据
  fetchInitData() {
    let fetchUrl;
    let data;
    if (this.leadsId) {
      fetchUrl = '/goods/koubei/queryMovehomeDetail.json';
      data = {
        leadsId: this.leadsId,
        op_merchant_id: this.pid,
      };
    } else if (this.itemId || this.sequenceId) {
      // 商品技改，数据迁移，有 itemId 优先用 itemId
      fetchUrl = '/goods/caterItem/queryItemDetail.json';
      data = {
        itemId: this.itemId,
        sequenceId: this.sequenceId,
        caterCallChannel: isFromKbServ() ? 'SALES_MG' : 'CRM_HOME',
      }
    } else if (this.props.location.pathname.indexOf('/serve/new') >= 0) {
      this.fetchTicketDisplay();
      return;
    }
    ajax({
      url: fetchUrl,
      type: 'json',
      data,
      success: res => {
        if (res && res.data && res.status === 'succeed') {
          const newdata = parseDetailData(res.data);
          this.setFormInitValue(newdata);
          this.setState({
            sequenceId: res.data && res.data.sequenceId,
            allowSubmit: this.leadsId ? !!res.allowSubmit : true,
            leadsType: res.type,
            allowModifyKeyFields: res.allowModifyKeyFields,
            isWhiteListUser: res.data.whiteListUser,
            itemId: res.data && res.data.itemId,
            intelligentLock: !!this.leadsId,
          });
        } else {
          message.error(res && res.resultMsg || '获取活动信息失败');
        }
      },
      error: (error) => {
        this.setState({
          intelligentLock: false
        });
        message.error(error && error.resultMsg || '系统繁忙，请稍后重试。');
      },
    });
  }
  // 获取商品类型的option
  queryAvailableItemType = () => {
    ajax({
      url: '/goods/catering/queryAvailableItemType.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            commodityType: res.ITEM_TYPE,
          });
        } else {
          this.setState({
            commodityType: ['single'],  //请求超时或出错默认创建普通商品
          });
        }
      },
      error: () => {
        this.setState({
          commodityType: ['single'], //请求超时或出错默认创建普通商品
        });
      },
    });
  }

  fetchTicketDisplay = () => {
    ajax({
      url: '/goods/caterItem/queryTicketDisplayMode.json', // industry新增行业code字段
      type: 'json',
      data: {
        op_merchant_id: this.pid,
        industry : 'SERV_INDUSTRY'
        
      },
      success: res => {
        if (res && res.status === 'succeed') {
          this.setFormInitValue({ ticketDisplayMode: res.ticketDisplayMode || '' });
        } else {
          message.error(res && res.resultMsg || '获取核销方式失败');
        }
      },
      error: (error) => {
        message.error(error && error.resultMsg || '获取核销方式失败');
      },
    });
  }
  serverReportErr(res) {
    const { setFields, getFieldValue } = this.props.form;
    if (res.errorField) {
      if (/^contents/.test(res.errorField) || /^remarks/.test(res.errorField) || /^dishes/.test(res.errorField) || /^introductions/.test(res.errorField)) {
        setFields({
          commodityDetail: {
            value: {},
            errors: [new Error(res.errorMsg)],
          }
        });
        return;
      }
      setFields({
        [res.errorField]: {
          value: getFieldValue(res.errorField),
          errors: [new Error(res.errorMsg)],
        }
      });
    }
  }

  // 保存
  handleSave = () => {
    const { validateFieldsAndScroll, setFields } = this.props.form;

    let submitUrl;
    let submitData = {};
    if (this.leadsId) { // leads 编辑
      submitUrl = '/goods/koubei/submitMovehome.json';
      submitData = {
        leadsId: this.leadsId,
        op_merchant_id: this.pid,
        type: this.state.leadsType,
      };
    } else if (this.itemId || this.sequenceId) { // 编辑商品
      submitUrl = '/goods/caterItem/editItem.json'
    } else {  // 创建商品
      submitUrl = '/goods/caterItem/createItem.json';
    }
    console.log("values", );
    validateFieldsAndScroll((error, values) => {
      console.log(values, "values");
      
      const { getFieldValue } = this.props.form;
      let hasErrorFlg = false;
      if (error) {
        const errArr = Object.keys(error);
        errArr.forEach((item) => {
          if (/^contents/.test(item) || /^remarks/.test(item)) {
            setFields({
              commodityDetail: {
                value: {},
                errors: [new Error('请输入正确的商品内容')],
              }
            });
          }
          if (/^dishes/.test(item)) {
            setFields({
              commodityDetail: {
                value: {},
                errors: [new Error('请输入正确的详情图片')],
              }
            });
          }
          if (/^introductionText/.test(item) || /^introductionImage/.test(item)) {
            setFields({
              commodityDetail: {
                value: {},
                errors: [new Error('请输入正确的商家介绍')],
              }
            });
          }
        });
        hasErrorFlg = true;
      }
      const contentsField = values.contents;
      const dishesField = values.dishes;
      const introTextField = values.introductionText;
      const introImgField = values.introductionImage;

      if (!contentsField || !isValidContents(contentsField)) {
        // message.error('请输入正确的商品内容', 3);
        hasErrorFlg = true;
        setFields({
          commodityDetail: {
            value: {},
            errors: [new Error('请输入正确的商品内容')],
          }
        });
        return;
      }
      if (!dishesField || !isValidDishes(dishesField)) {
        hasErrorFlg = true;
        // message.error('请输入正确的详情图片', 3);
        setFields({
          commodityDetail: {
            value: {},
            errors: [new Error('请输入正确的详情图片')],
          }
        });
        return;
      }
      if ((introTextField && !isValidIntroductionText(introTextField)) || (introImgField && !isValidIntroductionImg(introImgField))) {
        hasErrorFlg = true;
        setFields({
          commodityDetail: {
            value: {},
            errors: [new Error('请输入正确的商家介绍')],
          }
        });
        return;
      }

      if (hasErrorFlg) {
        message.error('请检查表单项', 3);
        return;
      }
      if (!values.firstImage || !values.firstImage.itemImage) {
        message.warning('请上传商品首图', 3);
        return;
      }
      const submitModal = () => {   //  ydd 多次核销添加匿名函数submitModal
        Modal.confirm({
          title: '是否确认上架此商品',
          content: window.top !== window ? (
            <p>
              提交成功后，需等待商户确认<br />
              也可以主动联系商户进行确认，加快代金券上架时间。
              </p>
          ) : null,
          onOk: () => {
            const params = {
              title: values.title,
              originPrice: String(values.originPrice),
              price: String(values.price),
              itemImage: [values.firstImage.itemImage],
              taobaoCoverImage: values.firstImage.taobaoCoverImage || '',
              itemDetailImages: getItemDetailImages(values.itemDetailImages), // 商品详情图
              totalAmount: values.totalAmount,
              remarks: values.remarks,
              latestNotices: [values.latestNotices],
              buyTips: values.buyTips,
              validTimeType: values.validTimeType,
              rangeTo: values.rangeTo,
              shopIds: values.shopIds,
              contents: values.contents,
              dishes: deparse(values.dishes),
              // introductions: deparse([{
              //   title: values.introductionText,
              //   imageUrls: values.introductionImage,
              // }]),
              availableTimes: parseAvailableTimes(values.availableTimesType, values.availableTimes),
              forbiddenDates: parseForbiddenDates(values.forbiddenDatesType, values.forbiddenDates),
              goodsIds: values.goodsIds ? values.goodsIds.split(/\n/) : [],
              categoryId: values.categoryPath && values.categoryPath.length
                ? values.categoryPath[values.categoryPath.length - 1] : '',
              remark: values.remark, // 备注
              ticketDisplayMode: values.ticketDisplayMode, // 核销方式
              displayChannels: values.displayChannels, // 商品展示渠道
              caterCallChannel: isFromKbServ() ? 'SALES_MG' : 'CRM_HOME',   //ydd需求新增用平台
              verifyFrequency: values.verifyFrequency,
              verifyEnableTimes: values.verifyEnableTimes,
              shopType: values.shopType,  // 门店方式
              logId: values.logId,
              salesPeriodStart: values.salesPeriodStart, //新增售卖有效期开始字段 ex.2018-03-01 11:50:11
              salesPeriodEnd: values.salesPeriodEnd,  //新增售卖有效期结束字段 ex.2019-03-01 11:50:11
              industry: 'SERV_INDUSTRY'   // 泛行业增加行业code
            };

            if (this.itemId || this.sequenceId) {
              params.itemId = this.itemId;
              params.sequenceId = this.sequenceId;
            } else if (this.leadsId && (this.state.itemId || this.state.sequenceId)) {
              params.sequenceId = this.state.sequenceId;
              params.itemId = this.state.itemId;
            }
            if (submitUrl.indexOf('createItem.json') >= 0) {  // 只有自运营场景才需要此字段
              params.itemCreateChannel = isFromKbServ() ? 'SALES_MG' : 'CRM_HOME';
            }

            if (values.validTimeType === 'FIXED') {
              params.validTimeFrom = values.validTime[0];
              params.validTimeTo = values.validTime[1];
            } else {
              params.rangeTo = values.rangeTo;
            }
            submitData.formData = JSON.stringify(params);
            const _submit = () => {
              this.setState({ isPostLoading: true, showSignModal: false });
              ajax({
                url: submitUrl,
                method: 'post',
                type: 'json',
                data: submitData,
                success: res => {
                  if (res && res.status === 'succeed' && this.leadsId) {
                    // 智能商品库
                    message.success('提交成功', 3);
                    this.setState({
                      submitedSuccess: true,
                      signed: true,
                    });
                    setTimeout(this.goBack, 3000);
                    // setTimeout(() => {
                    //   saveJumpTo('#/intelligentcatering/list');
                    // }, 3000);
                  } else if (this.leadsId) {
                    // 智能商品库（失败）
                    message.error(res && res.errorMsg ? res.errorMsg : '提交失败');
                    this.serverReportErr(res);
                  } else {
                    // 商品管理
                    if (res && res.status === 'succeed') {
                      message.success('提交成功');
                      this.setState({
                        submitedSuccess: true,
                      });
                      setTimeout(() => {
                        if (window.top === window) {
                          this.props.history.push(`/catering/success?firstNoLicenseShopId=${res.firstNoLicenseShopId || ''}`);
                        } else {
                          this.goBack(true);
                        }
                      }, 3000);
                    } else {
                      message.error(res.data && res.data.resultMsg || '提交失败');
                      this.serverReportErr(res);
                    }
                  }
                  this.setState({
                    isPostLoading: false,
                  });
                },
                error: err => {
                  if (err) {
                    message.error(err.errorMsg || err.resultMsg);
                    this.serverReportErr(err);
                  } else {
                    message.warning('系统繁忙，请稍后重试。');
                  }
                  this.setState({
                    isPostLoading: false,
                  });
                },
              });
            }
            if (this.pid) { // 商户待创建无需检查在线购买协议
              _submit();
            } else if (this.state.signed !== true) {
              // 自运营需要检查在线购买协议
              this.setState({
                isPostLoading: true,
              });
              ajax({
                url: '/goods/catering/checkSign.json',
                success: res => {
                  if (res.status === 'succeed') {
                    this.setState({
                      isPostLoading: false,
                      signed: res.hasSigned,
                    });
                    if (res.hasSigned === true) {
                      _submit();
                    } else {
                      this.setState({
                        showSignModal: true,
                        rate: res.rate,
                      });
                      this._submit = _submit;
                    }
                  } else {
                    this.setState({
                      isPostLoading: false,
                    });
                    message.error(res && res.resultMsg || '检查在线购买协议失败');
                  }
                },
                error: err => {
                  this.setState({
                    isPostLoading: false,
                  });
                  message.error(err && err.resultMsg || '检查在线购买协议异常');
                },
              });
            } else {
              _submit();
            }
          },
          onCancel: () => {
            this.setState({
              isPostLoading: false,
            });
          },
          style: window.top !== window ? { top: window.top.scrollY } : undefined,
        });
      }

      //  ydd 多次核销
      if (values.verifyFrequency === 'multi') {
        if (!values.verifyEnableTimes) {
          setFields({
            verifyEnableTimes: {
              errors: [new Error('创建次卡时商品包含必填')],
            }
          });
          return;
        }
        Modal.confirm({
          title: '请确定商品名称的格式符合要求',
          content: '输入格式：数量＋商品名称。如：30份吮指鸡块',
          okText: '确认无误',
          cancelText: '我再改改',
          onOk: () => {
            submitModal();
          },
        });
      } else {
        submitModal();
      }

    });
  }

  hideSignModal = () => {
    this.setState({
      showSignModal: false,
    });
  }

  goBack = (isFromCateringList) => {
    const fromUrl = getUriParam('fromUrl', this.props.location.search);
    let url = isFromCateringList ? '#/catering/list' : '';
    if (fromUrl) {
      url = fromUrl;
    }

    // 如果是 iframe 并且是一键搬家流程 或者 非代运营列表页，需要通过 postMessage 使顶层 window 跳转
    if (window.top !== window && window.top.location.hash.indexOf('#/catering/list') === -1) {
      window.top.postMessage(JSON.stringify({ action: 'goback', url }), '*');
    } else {
      location.hash = url;
    }
  }

  gotoListPage(e) {
    e.preventDefault();
    return saveJumpTo('#/catering/list');
  }

  componentDidUpdate() {
    if (window.top !== window) fixFrameHeight();
  }

  /*
    sign = () => {
      ajax({
        url: '/goods/catering/sign.json',
        success: res => {
          if (res.status === 'succeed' && res.result === true) {
            this.setState({
              signed: true,
            });
            this._submit();
            this.hideSignModal(true);
          } else {
            message.error(res && res.resultMsg || '签约在线购买协议异常');
          }
        },
        error: err => {
          message.error(err && err.resultMsg || '签约在线购买协议异常');
        },
      });
    }
  */
  renderPhotoPicker = () => {
    const { getFieldError } = this.props.form;
    return (
      <PhotoPicker
        {...formItemLayout}
        label="商品图片"
        max={5}
        needCut
        cutModalOpts={modalOpts}
        uploadUrl="/material/picUpload.json"
        uploadData={{
          op_merchant_id: this.pid,
          ctoken: getCookie('ctoken'),
        }}
        accept="image/gif,image/png,image/jpg,image/jpeg,image/bmp"
        uploadName="file"
        onError={this.onError}
        onCut={this.onCut}
        fileSize={1024 * 1024 * 5}
        field="itemDetailImages"
        convertResp2File={this.converter}
        needSelect
        selectModalOpts={this.getSelectModalOpts()}
        mode="append"
        validateStatus={classnames({ error: !!getFieldError('itemDetailImages') })}
        help={getFieldError('itemDetailImages')}
        extra={(<div style={{ lineHeight: '16px' }}>最多可上传5张商品内容图片。<br />图片大小不超过5M，图片格式：bmp，png，jpeg，gif。<br />建议尺寸：2000*1500px以上。</div>)}
      />
    );
  }
  // 渲染商品类型
  renderCommodityType = () => {
    if (this.leadsId) { // 一键搬家不需要该控件
      return null;
    }
    const { commodityType } = this.state;
    const verifyFrequency = this.props.form.getFieldValue('verifyFrequency');
    const data = {
      itemId: this.itemId,
      sequenceId: this.sequenceId,
    };
    return CommodityTypeFormCfg.map(cfg => {
      let fmProps = { ...cfg, commodityType, verifyFrequency, ...data };
      return componentGetter({ ...formItemLayout, ...fmProps });
    });
  }
  renderForm = () => {
    const { initData, isPostLoading, commodityType, intelligentLock } = this.state;
    const verifyFrequency = this.props.form.getFieldValue('verifyFrequency');
    const { latestNotices, buyTips } = initData;
    const { getFieldValue } = this.props.form;
    return (
      <div className="one-click-move" style={{ marginTop: '32px', marginBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <CommonSimulator
          caption="商品展示页面"
          background="https://zos.alipayobjects.com/rmsportal/CxMZfOICemcXKiGWxMCq.png"
          backgroundStyle={{
            backgroundSize: '223px 937px',
            height: '937px',
          }}
          withScroll
        />
        <Form style={{ float: 'left', width: '600px', marginLeft: '40px' }} form={this.props.form} horizontal>
          {this.renderCommodityType()}
          <FormBanner>
            基本信息
          </FormBanner>
          {this.onlinePurchaseCfg.slice().map(cfg => {
            const fmProps = { ...cfg };
            if (cfg.field === 'verifyEnableTimes') {
              // isInputShareDisabled 参数编辑商品时次卡的包含量不可修改
              let isInputShareDisabled = false;
              if (verifyFrequency === 'multi' && (this.itemId || this.sequenceId)) {
                isInputShareDisabled = true;
              }
              fmProps.isInputShareDisabled = isInputShareDisabled;
            }
            if (cfg.field === 'itemDetailImages') {
              return this.renderPhotoPicker();
            }
            if (cfg.key === 'PromoItemName' || cfg.key === 'ReduceToPrice') {
              fmProps.disabled = (this.state.allowModifyKeyFields === false) || intelligentLock;
            }
            if (cfg.field === 'shopIds') {
              fmProps.defaultValue = initData.cityShop;
              // fmProps.intelligentLock = intelligentLock;
              fmProps.shop = initData.shop || [];
            }
            // 泛行业
            if (cfg.key === 'CommodityDetail') {
              fmProps.fhyDetailTitle = true;
            }
            if (cfg.key === 'SelectShopsAsync') {
              fmProps.limitMode = 0; // 一件搬家传0，接口下发淮海和无证
              fmProps.defaultValue = initData.cityShop;
              fmProps.canReduce = initData && initData.status && initData.status.indexOf('ONLINE') === -1;
            }
            if (cfg.field === 'firstImage' && this.state.initData.itemImage && this.state.initData.itemImage.length && !this.state.initData.taobaoCoverImage) {
              fmProps.extra = [cfg.extra, <div className="red-alert-wrap" style={{ paddingTop: '5px' }}><Alert style={{ color: 'red' }} message="商品缺少1:1尺寸比例商品首图，无法参与淘抢购、聚划算、大牌快抢等活动，请补充上传1:1图片。" type="warning" /></div>];
            }

            return componentGetter({ ...formItemLayout, ...fmProps });
          })}

          <FormBanner>
            规则设置
          </FormBanner>
          {RulesToFormCfg.slice().map(cfg => {
            const fmProps = { ...cfg };
            if (cfg.key === 'DisplayChannels') {
              if (getFieldValue('displayChannels') === 'ALL') {
                fmProps.extra = <span>允许在<span style={{ color: '#f90' }}>口碑门店详情页</span>、<span style={{ color: '#f90' }}>搜索结果</span>、<span style={{ color: '#f90' }}>大牌抢购</span>及<span style={{ color: '#f90' }}>其他频道</span>中展示</span>
              } else if (getFieldValue('displayChannels') === 'ORIENTATION') {
                fmProps.extra = <span>仅限<span style={{ color: '#f90' }}>报名参加大牌抢购后投放</span>或<span style={{ color: '#f90' }}>用户扫商品二维码购买</span></span>
              }
            }
            if (cfg.key === 'SendAmountLimited') {
              fmProps.disabled = intelligentLock;
            }
            if (cfg.key === '使用时段') {
              fmProps.extra = renderTip(this.availableTimeTip);
            }
            if (cfg.key === '不可用日期') {
              fmProps.extra = renderTip(this.unavailableTimeTip);
            }
            if (cfg.field === 'ticketDisplayMode' && getFieldValue('verifyFrequency') === 'multi') {
              fmProps.isMulti = true;
            } 
            if (cfg.field === 'ticketDisplayMode' && getFieldValue('verifyFrequency') === 'single') {
              fmProps.isTicket = true;
            }
            if (cfg.key === 'VouchersValidTime') {
              fmProps.sellTime = {
                salesPeriodStart: getFieldValue('salesPeriodStart'),
                salesPeriodEnd: getFieldValue('salesPeriodEnd'),
              }
            }
            // 生活服务类不需要商品编码
            if (cfg.field === 'goodsIds') {
              // fmProps.required = true;
              return null;
            }
            if (cfg.key === 'SellTime' && getFieldValue('validTimeType') === 'FIXED'
            && getFieldValue('validTime')) {
              fmProps.validTime = getFieldValue('validTime');
            }
            if (cfg.field === 'goodsIds' && getFieldValue('ticketDisplayMode') !== 'USER_PAY_CODE') {
              return;
            }
            return componentGetter({ ...formItemLayout, ...fmProps });
          })}
          <FormBanner>
            其他设置
          </FormBanner>
          {OtherToFormCfg.slice().map(cfg => {
            let fmProps = { ...cfg };
            if (cfg.key === 'PurchaseInformation') {
              fmProps = { ...cfg, data: buyTips };
            }
            if (cfg.key === 'latestNotices') {
              fmProps = { ...cfg, data: latestNotices };
            }
            return componentGetter({ ...formItemLayout, ...fmProps });
          })}
          {this.state.allowSubmit && (
            <FormItem wrapperCol={{ span: 15, offset: 6 }}>
              <Button type="primary" onClick={this.handleSave} loading={isPostLoading} disabled={this.state.submitedSuccess}>
                提 交
              </Button>
              {/* <Button loading={isPostLoading} htmlType="submit" >
                保 存
              </Button>*/}
            </FormItem>
          )}
        </Form>
      </div>
    );
  }

  render() {
    window.f = this.props.form;
    return (
      <div>
        <div className="kb-detail-main" style={{ overflow: 'hidden' }}>
          {window.top === window && (
            <Breadcrumb>
              <Breadcrumb.Item style={{ fontSize: '14px', color: '#0ae' }}>
                <a onClick={this.gotoListPage}><Icon type="circle-o-left" />商品管理</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ fontSize: '14px' }}>编辑商品</Breadcrumb.Item>
            </Breadcrumb>
          )}
          {
            this.state.isLoading ? <div style={{ textAlign: 'center', marginTop: 80 }}><Spin /></div>
              : this.renderForm()
          }
        </div>
        {this.state.showSignModal && (
          <ApplySignModal
            isCatering
            onlineTradePayRate={this.state.rate}
            confirmOrderAgree={() => { this._submit(); }}
            handleCancel={this.hideSignModal}
            defaultChecked={false}
            okText="立即开通服务"
          />
        )}
      </div>
    );
  }
}

export default Form.create()(OnlinePurchase);
