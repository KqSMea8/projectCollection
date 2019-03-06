/**
 * 商品发布编辑页
 * warning：配置中的 key 和 field 不能更改，业务逻辑依赖 key 区分渲染逻辑
 */
import React, { Component } from 'react';
import { Form, Spin, Button, message as msg, Breadcrumb, Icon, Modal, Alert, Select, Row, Col } from 'antd';
import moment from 'moment';
import { PhotoPicker } from '@alipay/xform';
import classnames from 'classnames';
import { cloneDeep, set, get } from 'lodash';
import ajax from '../../../common/ajax';
import { keyMirror } from '../../../common/utils';
import componentGetter from '../common/ComponentGetter';
import CommodityTypeFormCfg from './CommodityTypeFormCfg';
import onlinePurchaseCfg from './OnlinePurchaseCfg';
import OtherToFormCfg from './OtherToFormCfg';
import CommonSimulator from '../../MarketingActivity/common/CommonSimulator';
import FormBanner from '../../MarketingActivity/common/FormBanner';
import { isFromKbServ, keepSession, fixFrameHeight, getUriParam, saveJumpTo, getImageById } from '../../../common/utils';
import ApplySignModal from '../Activity/ApplySignModal';
import RulesToFormCfg from './RulesToFormCfg';
import { queryAvailableTicketDisplayMode, asyncAjax, queryAuditLabels } from './cateringAPI';
import BuyRulesTpl from '../common/BuyRulesTpl';
import { checkExternalTicketCode } from './cateringAPI';
import ItemDetailImagesAuditTip from './ItemDetailImagesAuditTip';
import createContext from '../../../common/createContext';

const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};

const Audit = createContext({});
const PAGE_SIZE = 21;

const renderAuditByKey = (key, children = (
  <Audit.Consumer>
    {(auditData) => !!auditData && !!auditData[key] && <Alert message={auditData[key]} type="warning" showIcon />}
  </Audit.Consumer>
)) => {
  return (
    <Row style={{ marginTop: -20 }}>
      <Col offset={(formItemLayout.labelCol.span || 0) + (formItemLayout.labelCol.offset || 0)} span={formItemLayout.wrapperCol.span}>
        {children}
      </Col>
    </Row>
  );
};

let KEYS = {
  EXTERNAL_TICKET_CODE: 1,
  USER_PAY_CODE: 1,
  TICKET_CODE: 1,
  ticketDisplayMode: 1,
  single: 1,
  multi: 1,
  verifyFrequency: 1,
  itemDetailImages: 1,
  KFC_EXTERNAL_VOUCHER: 1,
  SALES_MG: 1,
  CRM_HOME: 1,
};
KEYS = keyMirror(KEYS);

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
  const introImages = data.introductions && data.introductions[0].imageUrls || [];
  set(data, 'introductions[0].imageUrls', genImageObj(introImages));
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

class OnlinePurchase extends Component {
  static propTypes = {
    history: React.PropTypes.object,
  }
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      auditData: {},  // 审核结果数据
      hasAuditError: false,   // 是否有审核信息
      industry: 'CATERING',
      industries: [],
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
      originData: null,       // 修改时记录原始数据
      ticketDisplayModeOptions: [],
    };
    this.pid = getUriParam('op_merchant_id', location.search);
    const hashSearch = this.props.history.search;
    this.leadsId = getUriParam('leadsId', hashSearch);
    this.sequenceId = getUriParam('sequenceId', hashSearch);
    this.itemId = getUriParam('itemId', hashSearch);
    this.isCreate = this.props.location.pathname.indexOf('/catering/new') >= 0;
    if (this.leadsId) {
      // 一键搬家写死核销方式
      this.state.ticketDisplayModeOptions = [{
        ticketDisplayMode: KEYS.TICKET_CODE,
        defaultMode: true,
        goodsIdRequired: false,
      }, {
        ticketDisplayMode: KEYS.USER_PAY_CODE,
        defaultMode: false,
        goodsIdRequired: true,
      }];
    }
    // this.detailResp = null;
  }

  componentDidMount() {
    if (this.isCreate) {
      this.fetchIndustrySelection();
    }
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

    // if (this.isCreate) {
    //   this.checkExternalCoupon();
    // }

    if (this.itemId) {
      this.fetchAuditLabel();
    }

    keepSession();
  }

  /* eslint-disable */
  // 获取行业筛选项
  fetchIndustrySelection = () => {
    /* eslint-enable */
    const url = '/goods/caterItem/queryIndustryList.json';
    ajax({
      url,
      success: resp => {
        if (resp.status === 'succeed' && resp.data.industries.length > 0) {
          const nextState = {
            industries: resp.data.industries,
          };
          if (resp.data.industries.every(d => d.code !== 'CATERING')) {
            // 如果返回的行业没有餐饮，取第一个
            nextState.industry = resp.data.industries[0].code;
            this.handleIndustryChange(resp.data.industries[0].code);
          }
          this.setState(nextState);
        } else {
          message.error('获取行业信息失败');
        }
      },
    });
  }

  fetchAuditLabel = () => {
    // 商品审核接口
    queryAuditLabels(this.itemId).then(resp => {
      this.setState({
        auditData: resp.data,
        hasAuditError: resp.data && Object.keys(resp.data).length > 0,
      });
    });
  }

  /* eslint-disable */
  setFormInitValue(res) {
    return new Promise(resolve => {
      let displayChannels = 'ALL';
      if (res.displayChannels === 'ALL' || res.displayChannels === 'ORIENTATION') {
        displayChannels = res.displayChannels;
      }
      const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
      const initValue = {
        title: res.title || '',
        originPrice: res.originPrice && Number(res.originPrice) || '',
        price: res.price && Number(res.price) || '',
        itemDetailImages: res.itemDetailImages || [],
        firstImage: res.firstImage,
        contents: res.contents, // || [{title: null, itemUnits: [{}]}],
        dishes: res.dishes && res.dishes.length > 0 ? res.dishes : [{ title: '', desc: '', imageUrls: [] }],
        introductions: res.introductions,
        introductionText: get(res, 'introductions[0].title'),
        introductionImage: get(res, 'introductions[0].imageUrls'),
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
        ticketDisplayMode: res[KEYS.ticketDisplayMode] || '', // 核销方式
        verifyEnableTimes: res.verifyEnableTimes && Number(res.verifyEnableTimes) || '', //多次核销的包含量
        verifyFrequency: res.verifyFrequency || 'single',
        displayChannels, // 商品展示渠道
        salesPeriodStart: res.salesPeriodStart || today.format('YYYY-MM-DD HH:mm:ss'),
        salesPeriodEnd: res.salesPeriodEnd || '2037-12-31 23:59:59',
        externalAppId: res.externalAppId,
        externalBizScene: res.externalBizScene,
        descGroups: res.descGroups,
        services: res.services,
      };

      if (res.buyTipsTemplate) {
        initValue.buyTipsTemplate = {
          ...res.buyTipsTemplate,
        };
      }

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
      }, resolve);
      this.availableTimeTip = res.availableTimeTip && res.availableTimeTip.value.join('；');
      this.unavailableTimeTip = res.unavailableTimeTip && res.unavailableTimeTip.value.join('；');

    });
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
  // checkProperty = () => {
  //   const { getFieldValue } = this.props.form;
  //   let isError = false;
  //   optionsArr.map(item => {
  //     const val = getFieldValue(item.field) || {};
  //     if (item.max === 1) {
  //       if (item.required && !val.value) isError = true;
  //       if (val.value === 'custom' && !val.custom) isError = true;
  //     }
  //     if (item.max > 1) {
  //       if (!item.custom && item.required && (!val.value || !val.value.length)) isError = true;
  //       if (item.custom && item.required && (!val.value || !val.value.length) && (!val.custom || !val.custom.join(''))) isError = true;
  //       const valItem = val.value && val.value.length || 0;
  //       const customItem = val.custom && val.custom.length || 0;
  //       if (valItem + customItem > item.max) isError = true;
  //     }
  //   });
  //   return isError;
  // }
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
      // fetchUrl = 'http://pickpost.alipay.net/mock/crmhome/goods/caterItem/queryItemDetail.json';
      data = {
        itemId: this.itemId,
        sequenceId: this.sequenceId,
        caterCallChannel: isFromKbServ() ? 'SALES_MG' : 'CRM_HOME',
      }
    }

    const taskDetail = fetchUrl
      ?
      asyncAjax({
        url: fetchUrl,
        type: 'json',
        data,
      }).then(resp => {
        if (resp.status !== 'succeed') {
          throw new Error(resp && resp.resultMsg || '获取活动信息失败');
        }
        return resp;
      }).catch((e) => message.error(e && e.message || '获取详情异常'))
      :
      Promise.resolve(null);

    taskDetail.then(detailResp => {
      let detailData = detailResp === null ? {
        // contents: [{ title: 'custom', itemUnits: [{ amount: 1, unit: 'm', name: 'name', price: '', spec: '', total: '' }] }],
        // remarks: ['1', '2'],
        // dishes: [{ title: 'ccc', imageUrls: genImageObj(['42xKVRYVS9O2BhFqIf2ljgAAACMAAQED'])}],
        // descGroups: [{title: '2asdasdasdadadasdasadasdadasd2', remarks: [123]}],
        // services: [{name: 1}, {name: 2}]

      } : parseDetailData(detailResp.data);
      // this.detailResp = detailResp;
      const partialState = {};
      if (detailResp) {
        partialState.sequenceId = detailResp.data && detailResp.data.sequenceId;
        partialState.allowSubmit = this.leadsId ? !!detailResp.allowSubmit : true;
        partialState.leadsType = detailResp.type;
        partialState.allowModifyKeyFields = detailResp.allowModifyKeyFields;
        partialState.isWhiteListUser = detailResp.data.whiteListUser;
        partialState.itemId = detailResp.data && detailResp.data.itemId;
        partialState.intelligentLock = !!this.leadsId;
        partialState.originData = detailResp.data;
        partialState.industry = detailResp.data.industry || 'CATERING';
      }
      this.setState(partialState, () => {
        this.setFormInitValue(detailData).then(() => {
          if (!this.leadsId) {  // 非一键搬家才需要请求核销方式
            this.fetchTicketDisplay(this.isCreate); // 如果是创建才需要通过接口返回来重置所选的核销方式，如果是修改，则保持原有核销方式
          }
        });
      });
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

  /**
   * 获取核销方式选项
   *
   * @memberof OnlinePurchase
   */
  fetchTicketDisplay = (needResetValue, data) => {
    const { industry, initData } = this.state;
    return queryAvailableTicketDisplayMode({
      op_merchant_id: this.pid,
      industry,
      verifyFrequency: this.props.form.getFieldValue(KEYS.verifyFrequency),
      ...data,
    }).then(ticketResp => {
      if (ticketResp.status !== 'succeed') {
        message.error(ticketResp && ticketResp.resultMsg || '获取核销方式信息失败');
        return;
      }

      let ticketOptions = ticketResp.displayModes || [];

      if (this.itemId) {  // 修改场景
        const oldTicketDisplayMode = initData[KEYS.ticketDisplayMode];

        if (initData.verifyFrequency === KEYS.multi) {
          // 次卡不允许修改核销方式
          ticketOptions = ticketOptions && ticketOptions.length > 0
            ? ticketOptions.filter(d => d[KEYS.ticketDisplayMode] === oldTicketDisplayMode)
            : [{ ticketDisplayMode: oldTicketDisplayMode, goodsIdRequired: false }];
        } else {
          // 如果接口返回的核销方式中没有已选的核销方式，必须添加已选的核销方式
          if (oldTicketDisplayMode && ticketOptions.every(d => d.ticketDisplayMode !== oldTicketDisplayMode)) {
            ticketOptions.push({
              ticketDisplayMode: oldTicketDisplayMode,
              defaultMode: true,
              goodsIdRequired: !industry || industry === 'CATERING',    // 非餐饮不需要填写 goodsId
            });
          }

          // 修改时 如果接口返回的是外部券码核销，需要干掉其他核销方式
          if (oldTicketDisplayMode === KEYS.EXTERNAL_TICKET_CODE) {
            ticketOptions = [{
              [KEYS.ticketDisplayMode]: KEYS.EXTERNAL_TICKET_CODE,
              defaultMode: true,
              goodsIdRequired: false,
            }];
          } else {  //修改时 如果接口返回的是非外部券码核销，则干掉外部券码核销
            ticketOptions = ticketOptions.filter(d => d[KEYS.ticketDisplayMode] !== KEYS.EXTERNAL_TICKET_CODE);
          }
        }
      }

      this.setState({
        ticketDisplayModeOptions: ticketOptions,
      }, () => {
        if (needResetValue) {
          const defaultOption = ticketOptions.filter(d => d.defaultMode)[0];
          if (defaultOption) {
            this.props.form.setFieldsValue({
              ticketDisplayMode: defaultOption.ticketDisplayMode,
            });
          }
        }
      });
    });
  }

  serverReportErr(res) {
    const { setFields, getFieldValue } = this.props.form;
    if (res.errorField) {
      if (/^contents/.test(res.errorField) || /^remarks/.test(res.errorField) ||
      /^dishes/.test(res.errorField) || /^introductions/.test(res.errorField) ||
      /^descGroups/.test(res.errorField) || /^services/.test(res.errorField)) {
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
    validateFieldsAndScroll((error, values) => {
      const { getFieldValue } = this.props.form;
      let hasErrorFlg = false;
      if (error) {
        const errArr = Object.keys(error);
        errArr.forEach((item) => {
          if (/^contents/.test(item) || /^remarks/.test(item) || /^descGroups/.test(item)) {
            setFields({
              commodityDetail: {
                value: {},
                errors: [new Error('请输入正确的商品内容')],
              }
            });
          }
          if (/^services/.test(item)) {
            setFields({
              commodityDetail: {
                value: {},
                errors: [new Error('请输入正确的服务分类')],
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
      // if (this.checkProperty()) {
      //   setFields({
      //     goodsProperty: {
      //       values: '',
      //       errors: [new Error('请编辑正确的商品属性')],
      //     }
      //   });
      //   return;
      // }
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
              latestNotices: values.latestNotices ? [values.latestNotices] : [],
              buyTips: values.buyTips.filter(d => d.key && d.value && d.value.join('')),
              validTimeType: values.validTimeType,
              rangeTo: values.rangeTo,
              shopIds: values.shopIds,
              contents: values.contents,
              dishes: deparse(values.dishes),
              introductions: deparse([{
                title: values.introductionText,
                imageUrls: values.introductionImage,
              }]),
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
              salesPeriodEnd: values.salesPeriodEnd,
              salesPeriodStart: values.salesPeriodStart,
              industry: this.state.industry,
            };
            if (this.state.industry && this.state.industry === 'SERV_INDUSTRY') {
              params.services = (values.services || []).filter(item => item.name);
              params.descGroups = (values.descGroups || []).filter(item => item.title);
            }
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

            // 非一键搬家才有购买须知模板
            if (!this.leadsId) {
              params.buyTipsTemplate = values.buyTipsTemplate;
            }

            if (values.validTimeType === 'FIXED') {
              params.validTimeFrom = values.validTime[0];
              params.validTimeTo = values.validTime[1];
            } else {
              params.rangeTo = values.rangeTo;
            }

            if (this.leadsId) {
              params.verifyFrequency = undefined;
              params.verifyEnableTimes = undefined;
            }

            // kfc 外部核销
            if (params.ticketDisplayMode === KEYS.EXTERNAL_TICKET_CODE) {
              params.externalBizScene = KEYS.KFC_EXTERNAL_VOUCHER;
              params.externalAppId = values.externalAppId;
            } else {
              params.externalBizScene = undefined;
              params.externalAppId = undefined;
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

  componentDidUpdate(prevProps, prevState) {
    if (window.top !== window) fixFrameHeight();
    if (this.state.industry !== prevState.industry) {
      this.fetchTicketDisplay(true);
    }
  }

  handleIndustryChange = v => {
    this.setState({
      industry: v,
    }, () => {
      this.props.form.setFieldsValue({
        categoryPath: [],
        ticketDisplayMode: this.props.form.getFieldValue(KEYS.verifyFrequency) === 'multi' ? KEYS.USER_PAY_CODE : KEYS.TICKET_CODE,
      });

      // this.fetchTicketDisplay(true);
    });
  }

  checkExternalCoupon = () => {
    checkExternalTicketCode().then(resp => {
      if (resp.status === 'succeed') {
        this.setState({
          allowExternalCoupon: resp.data && resp.data.isAllow,
        });
      }
    });
  }

  renderPhotoPicker = () => {
    const { getFieldError } = this.props.form;
    return (
      <PhotoPicker
        key="商品图片"
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

  handleItemTypeChange = type => {
    this.fetchTicketDisplay(true, { [KEYS.verifyFrequency]: type });
  }

  // 渲染商品类型
  renderCommodityType = () => {
    return CommodityTypeFormCfg.map(cfg => {
      if (cfg.key === 'category') {
        return componentGetter({ ...formItemLayout, ...cfg, industry: this.state.industry || '' }, this.props.form);
      } else if (this.leadsId && cfg.key !== 'category') { // 一键搬家不需要该控件
        return null;
      }

      if (cfg.key === 'CommodityType') {
        const { commodityType } = this.state;
        const verifyFrequency = this.props.form.getFieldValue('verifyFrequency');
        const data = {
          itemId: this.itemId,
          sequenceId: this.sequenceId,
        };
        let fmProps = { ...cfg, commodityType, verifyFrequency, ...data };
        return componentGetter({ ...formItemLayout, ...fmProps, onSelect: this.handleItemTypeChange }, this.props.form);
      }
      return null;
    });
  }

  handleBuyRulesCommit = ({ buyTips, ...value }) => {
    this.props.form.setFieldsValue({
      buyTipsTemplate: value,
      buyTips,
    });
  }

  attachAuditTip = elm => {
    const rtn = [elm];
    const key = elm.key;
    const auditData = this.state.auditData;

    switch (key) {
      case 'PromoItemName': {   // 商品名称
        // if (this.state.auditData.subject) {
        rtn.push(renderAuditByKey('subject'));
        // }
        break;
      }
      case 'GoodsFirstImage': {
        rtn.push(renderAuditByKey('cover'));
        break;
      }
      case '商品图片': {
        if (auditData && auditData.pictureDetails && Object.keys(auditData.pictureDetails).length > 0) {
          rtn.push(renderAuditByKey('itemDetailImages', <ItemDetailImagesAuditTip auditData={this.state.auditData} itemDetailImages={this.props.form.getFieldValue('itemDetailImages')} />));
        }
        break;
      }
      case 'CommodityDetail': {
        rtn.push(renderAuditByKey('itemDetail'));
        break;
      }
      case 'PurchaseInformation': {
        rtn.push(renderAuditByKey('buyNotes'));
        break;
      }
      default: {
        break;
      }
    }
    return rtn;
  }

  renderForm = () => {
    window._t_ = this;
    const { initData, isPostLoading, commodityType, intelligentLock } = this.state;
    const verifyFrequency = this.props.form.getFieldValue('verifyFrequency');
    const { latestNotices, buyTips } = initData;
    const { getFieldValue } = this.props.form;
    return (
      <div>
        {/* {this.state.hasAuditError && <Alert message="商品部分内容不符合规范，请及时修改。" showIcon type="warning" />} */}
        <div className="one-click-move" style={{ marginTop: '32px', marginBottom: '100px', display: 'flex', justifyContent: 'center' }}>
          <CommonSimulator
            caption="商品展示页面"
            background={!this.state.industry || this.state.industry === 'CATERING'
              ? 'https://zos.alipayobjects.com/rmsportal/CxMZfOICemcXKiGWxMCq.png'
              : 'https://gw.alipayobjects.com/zos/rmsportal/EVrAQrKjrOHqqxyRmHZG.png'}
            backgroundStyle={{
              height: '937px',
              backgroundSize: 'cover',
            }}
            withScroll
          />
          <Form style={{ float: 'left', width: '600px', marginLeft: '40px' }} form={this.props.form} horizontal>
            {!!this.state.industries.length && (
              <Form.Item label="所属行业" {...formItemLayout}>
                <Select onChange={this.handleIndustryChange} value={this.state.industry}>
                  {this.state.industries.map(d => (<Select.Option value={d.code} key={d.code}>{d.name}</Select.Option>))}
                </Select>
              </Form.Item>
            )}
            {this.renderCommodityType()}
            <FormBanner>
              基本信息
            </FormBanner>
            {React.Children.toArray(onlinePurchaseCfg(!!this.leadsId || !!this.itemId || !!this.sequenceId, this.state.industry || 'CATERING').slice().map(cfg => {
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
                return this.attachAuditTip(this.renderPhotoPicker());
              }
              if (cfg.key === 'PromoItemName' || cfg.key === 'ReduceToPrice') {
                fmProps.disabled = (this.state.allowModifyKeyFields === false) || intelligentLock;
              }
              if (cfg.field === 'shopIds') {
                fmProps.defaultValue = initData.cityShop;
                // fmProps.intelligentLock = intelligentLock;
                fmProps.shop = initData.shop || [];
              }
              if (cfg.key === 'SelectShopsAsync') {
                fmProps.limitMode = 0; // 一件搬家传0，接口下发淮海和无证
                fmProps.defaultValue = initData.cityShop;
                fmProps.canReduce = initData && initData.status && initData.status.indexOf('ONLINE') === -1 && initData.status.indexOf('PAUSE') === -1;
              }
              if (cfg.field === 'firstImage' && this.state.initData.itemImage && this.state.initData.itemImage.length && !this.state.initData.taobaoCoverImage) {
                fmProps.extra = [cfg.extra, <div className="red-alert-wrap" style={{ paddingTop: '5px' }}><Alert style={{ color: 'red' }} message="商品缺少1:1尺寸比例商品首图，无法参与淘抢购、聚划算、大牌快抢等活动，请补充上传1:1图片。" type="warning" /></div>];
              }

              return this.attachAuditTip(componentGetter({ ...formItemLayout, ...fmProps }, this.props.form));
            }))}

            <FormBanner>
              规则设置
            </FormBanner>
            {RulesToFormCfg.slice().map(cfg => {
              const fmProps = { ...cfg };
              if (cfg.field === 'goodsIds' && (this.state.industry || 'CATERING') !== 'CATERING') {
                return null;
              }
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
              if (cfg.field === KEYS.ticketDisplayMode) {
                fmProps.hasUserPayCode = false;
                fmProps.hasTicketCode = false;
                fmProps.hasExternal = false;
                this.state.ticketDisplayModeOptions.forEach(d => {
                  if (d.ticketDisplayMode === KEYS.TICKET_CODE) {
                    fmProps.hasTicketCode = true;
                  } else if (d.ticketDisplayMode === KEYS.USER_PAY_CODE) {
                    fmProps.hasUserPayCode = true;
                  } else if (d.ticketDisplayMode === KEYS.EXTERNAL_TICKET_CODE) {
                    fmProps.hasExternal = true;
                  }
                });
              }
              if (cfg.field === 'goodsIds') {
                const selectedMode = this.state.ticketDisplayModeOptions.filter(d => d.ticketDisplayMode === getFieldValue(KEYS.ticketDisplayMode))[0];
                if (!selectedMode || !selectedMode.goodsIdRequired) {
                  return null;
                }
                fmProps.required = true;
              }
              // 泛行业需要售卖时间
              if (cfg.key === 'SellTime') {
                return null;
              }
              if (cfg.key === 'SalesPeriod') {
                fmProps.rules = [(_, __, cb) => {
                  const { validTimeType = 'RELATIVE', validTime = [], salesPeriodStart, salesPeriodEnd } = this.props.form.getFieldsValue();
                  const fmt = 'YYYY-MM-DD HH:mm:ss';
                  const start = moment(salesPeriodStart, fmt);
                  const end = moment(salesPeriodEnd, fmt);
                  if (!this.state.originData) {
                    // 新建的场景才需要校验开始时间不能早于今天
                    const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
                    if (start.isBefore(today)) {
                      return cb(`商品售卖时间不能早于${today.format('YYYY-MM-DD')}`);
                    }
                  }
                  if (validTimeType === 'FIXED' && validTime.length === 2 && salesPeriodStart && salesPeriodEnd) {
                    const [validTimeStart, validTimeEnd] = validTime.map(d => moment(d, fmt));
                    if (validTimeStart.isBefore(start)) {
                      return cb('商品售卖开始时间，必须早于商品核销开始时间');
                    }
                    if (validTimeEnd.isBefore(end)) {
                      return cb('商品售卖结束时间，必须早于商品核销结束时间');
                    }
                    if (this.props.form.getFieldError('validTime')) {
                      this.props.form.validateFields(['validTime'], { force: true });
                    }
                  }
                  cb();
                }];
              }

              // 非外部券码核销不需要输入 APPID
              if (cfg.key === 'ExternalAppId' && this.props.form.getFieldValue(KEYS.ticketDisplayMode) !== KEYS.EXTERNAL_TICKET_CODE) {
                return null;
              }
              if (cfg.key === 'ExternalAppId' && this.props.form.getFieldValue(KEYS.ticketDisplayMode) === KEYS.EXTERNAL_TICKET_CODE && this.itemId) {
                fmProps.disabled = true;
              }
              return componentGetter({ ...formItemLayout, ...fmProps }, this.props.form);
            })}
            <FormBanner>
              其他设置
            </FormBanner>
            {OtherToFormCfg.slice().map(cfg => {
              let fmProps = { ...cfg };
              if (cfg.key === 'PurchaseInformation') {
                const { value, onChange, ...otherProps } = this.props.form.getFieldProps('buyTipsTemplate');
                const PurchaseInformation = React.createElement(BuyRulesTpl,
                  { ...cfg, ...formItemLayout, ...otherProps, onChange: this.handleBuyRulesCommit, value: { ...value, buyTips: this.props.form.getFieldValue('buyTips') } });
                return this.attachAuditTip(PurchaseInformation);
              }
              if (cfg.key === 'latestNotices') {
                fmProps = { ...cfg, data: latestNotices };
              }
              if (cfg.key === 'Memo') {
                // 备注信息，如果商品修改时已存在备注信息，则不能再次修改
                fmProps.disabled = !!this.itemId && !!this.state.originData.remark;
              }
              return componentGetter({ ...formItemLayout, ...fmProps }, this.props.form);
            })}
            {this.state.allowSubmit && (
              <FormItem wrapperCol={{ span: 15, offset: 6 }}>
                <Button type="primary" onClick={this.handleSave} loading={isPostLoading} disabled={this.state.submitedSuccess}>
                  提 交
                </Button>
              </FormItem>
            )}
          </Form>
        </div>
      </div>
    );
  }

  render() {
    window.f = this.props.form;
    return (
      <div>
        <Audit.Provider value={this.state.auditData}>
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
        </Audit.Provider>
      </div>
    );
  }
}

export default Form.create()(OnlinePurchase);
