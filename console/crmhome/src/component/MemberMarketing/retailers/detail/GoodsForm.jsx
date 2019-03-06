import React, { PropTypes } from 'react';
import { Form, Alert, message, Spin } from 'antd';
import CommonSimulator from '../../../MarketingActivity/common/CommonSimulator';
import FormBanner from '../../../MarketingActivity/common/FormBanner';
import OnlinePurchaseCfg from './OnlinePurchaseCfg';
import RulesToFormCfg from './RulesToFormCfg';
import OtherToFormCfg from './OtherToFormCfg';
import componentGetter from '../../../OneClickMove/common/ComponentGetter';
import { PhotoPicker } from '@alipay/xform';
import classnames from 'classnames';
import ajax from '../../../../common/ajax';
import { getImageById } from '../../../../common/utils';
import { cloneDeep, set, get } from 'lodash';
import BuyRulesTpl from '../../../OneClickMove/common/BuyRulesTpl';
// const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};
const modalOpts1 = {
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
const PAGE_SIZE = 21;
let selections = [];
let selsectInit = [];
const ERROR = PhotoPicker.ERROR;
function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
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
function genUrl(data) {
  if (data) {
    return getImageById(data);
  }
  return null;
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
  const introImages = data.introductions && data.introductions.length > 0 && data.introductions[0].imageUrls || [];
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
function checkBuyTips(buyTips) {
  let arr = [];
  if (buyTips && buyTips.length > 0) {
    arr = buyTips.filter(item => {
      return item.key && item.value;
    });
  }
  if (arr.length > 0) {
    return arr;
  }
  return [{ key: '', value: [''] }];
}
class GoodsForm extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    initValue: PropTypes.object,
    logId: PropTypes.string,
  };

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      selections: [],
      listLoading: false,
      current: 1,
      total: 0,
      isLoading: true,
      initData: {},
      shopList: [],
      isLock: false,
    };
  }
  componentDidMount() {
    this.fetchInitData();
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
  /* eslint-disable */
  setFormInitValue(res) {
    /* eslint-enable */
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
      introductions: res.introductions,
      introductionText: get(res, 'introductions[0].title'),
      introductionImage: get(res, 'introductions[0].imageUrls'),
      totalAmount: res.totalAmount || 99999999,
      latestNotices: get(res, 'latestNotices[0]') || '',
      buyTips: checkBuyTips(res.buyTips),
      remarks: res.remarks,
      validTimeType: res.validTimeType || 'RELATIVE',
      shopIds: res.shopIds || [],
      availableTimes: deparseAvailableTimes(res.availableTimes),
      availableTimesType: res.availableTimes ? '1' : '0',
      forbiddenDatesType: res.forbiddenDates ? '1' : '0',
      forbiddenDates: deparseForbiddenDates(res.forbiddenDates),
      categoryPath: res.categoryPath,
      remark: res.remark || '', // 备注
      ticketDisplayMode: res.ticketDisplayMode || '', // 核销方式
      verifyEnableTimes: res.verifyEnableTimes && Number(res.verifyEnableTimes) || '', // 多次核销的包含量
      verifyFrequency: res.verifyFrequency || 'single',
      displayChannels, // 商品展示渠道
      rangeTo: res.rangeTo || 360,
      logId: res.itemLogId,
    };

    if (res.buyTipsTemplate) {
      initValue.buyTipsTemplate = {
        ...res.buyTipsTemplate,
      };
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

    if (!res.buyTips || !res.buyTips.length || !res.buyTips[0].key) {
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
  fetchInitData() {
    ajax({
      url: '/goods/caterItem/queryLogInfo.json',
      method: 'get',
      data: {
        itemLogId: this.props.logId,
      },
      success: res => {
        if (res && res.data && res.status === 'succeed') {
          const newdata = parseDetailData(res.data);
          if (res.data.lockNums > 0) {
            this.setState({ isLock: true });
          }
          this.setFormInitValue(newdata);
        } else {
          message.error(res && res.resultMsg || '获取活动信息失败');
        }
      },
      error: (error) => {
        message.error(error && error.resultMsg || '系统繁忙，请稍后重试。');
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

  handleBuyRulesCommit = ({ buyTips, ...value }) => {
    this.props.form.setFieldsValue({
      buyTipsTemplate: value,
      buyTips,
    });
  }

  renderPhotoPicker = () => {
    const { getFieldError } = this.props.form;
    return (
      <PhotoPicker
        {...formItemLayout}
        label="商品图片"
        max={5}
        needCut
        cutModalOpts={modalOpts1}
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

  renderForm = () => {
    const { initData, isLock } = this.state;
    const verifyFrequency = this.props.form.getFieldValue('verifyFrequency');
    const { amountmin } = this.props;
    const { latestNotices } = initData;
    // 如果限制了发放总量，更新发放总量限制校验规则
    if (amountmin) {
      RulesToFormCfg.forEach(item => {
        if (item.key === 'SendAmountLimited') {
          item.rules = [{
            required: true,
            type: 'number',
            message: '请填写发放总量',
          }, {
            validator: (rule, value, callback) => {
              if (typeof value !== 'undefined' && value < amountmin ) {
                callback('发放总量必须大于' + amountmin);
                return;
              }
              callback();
            },
          }];
        }
      });
    }

    return (<div style={{ marginTop: '32px', marginBottom: '100px', display: 'flex', justifyContent: 'center' }}>
      <CommonSimulator
        caption="商品展示页面"
        background="https://zos.alipayobjects.com/rmsportal/CxMZfOICemcXKiGWxMCq.png"
        backgroundStyle={{
          backgroundSize: '223px 937px',
          height: '937px',
        }}
        withScroll
      />
      <div style={{ float: 'left', width: '600px', marginLeft: '40px' }}>
      <FormBanner>
        基本信息
      </FormBanner>
      {OnlinePurchaseCfg.slice().map(cfg => {
        const fmProps = { ...cfg };
        if (cfg.field === 'verifyEnableTimes') {
          fmProps.isInputShareDisabled = (verifyFrequency === 'multi');
        }

        if (cfg.key === 'PromoItemName' || cfg.key === 'ReduceToPrice' || cfg.key === '所属类目') {
          fmProps.disabled = isLock;
        }

        // 如果是次卡折扣率要高于95折
        if (verifyFrequency === 'multi' && cfg.key === 'ReduceToPrice') {
          fmProps.discountRate = 0.95;
        }

        if (cfg.key === 'GoodsFirstImage') {
          fmProps.disableFirst = isLock;
          fmProps.disableTaobao = !!initData.taobaoCoverImage && isLock;
        }
        if (cfg.key === 'SelectShopsAsync') {
          fmProps.defaultValue = initData.cityShop;
          fmProps.intelligentLock = true; // 只能查看
          fmProps.shop = initData.shop || [];
        }
        if (cfg.key === '商品图片') {
          return this.renderPhotoPicker();
        }
        if (cfg.field === 'firstImage' && initData.itemImage && initData.itemImage.length && !initData.taobaoCoverImage) {
          fmProps.extra = [cfg.extra, <div className="red-alert-wrap" style={{ paddingTop: '5px' }}><Alert style={{ color: 'red' }} message="商品缺少1:1尺寸比例商品首图，无法参与淘抢购、聚划算、大牌快抢等活动，请补充上传1:1图片。" type="warning" /></div>];
        }
        if (cfg.key === 'VerifyFrequency') {
          return (<div style={{display: 'none'}}>{componentGetter({ ...formItemLayout, ...fmProps })}</div>);
        }
        return componentGetter({ ...formItemLayout, ...fmProps });
      })}
      <FormBanner>
        规则设置
      </FormBanner>
      {RulesToFormCfg.slice().map(cfg => {
        const fmProps = { ...cfg };
        if (cfg.key === '使用时段') {
          fmProps.extra = renderTip(this.availableTimeTip);
        }
        if (cfg.key === '不可用日期') {
          fmProps.extra = renderTip(this.unavailableTimeTip);
        }
        return componentGetter({ ...formItemLayout, ...fmProps });
      })}
      <FormBanner>
        其他设置
      </FormBanner>
      {OtherToFormCfg.slice().map(cfg => {
        let fmProps = { ...cfg };
        if (cfg.key === 'PurchaseInformation') {
          const { value, ...otherProps } = this.props.form.getFieldProps('buyTipsTemplate');
          return React.createElement(BuyRulesTpl,
            { ...cfg, ...formItemLayout, ...otherProps, onChange: this.handleBuyRulesCommit, value: { ...value, buyTips: this.props.form.getFieldValue('buyTips') } });
        }
        if (cfg.key === 'latestNotices') {
          fmProps = { ...cfg, data: latestNotices };
        }
        return componentGetter({ ...formItemLayout, ...fmProps });
      })}
      <input type="hidden" {...this.props.form.getFieldProps('logId') } />
      </div>
    </div>);
  }
  render() {
    return (<div>{
        this.state.isLoading ? <div style={{ textAlign: 'center', marginTop: 80 }}><Spin /></div>
          : this.renderForm()
      }
    </div>);
  }
}

export default Form.create()(GoodsForm);
