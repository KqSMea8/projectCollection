import React, { PropTypes } from 'react';
import PageLayout from 'layout/index';
import moment from 'moment';
import { Form, Row, Col, DatePicker, Checkbox, Input, Tabs, Select, InputNumber, Collapse, message, Button, Icon, Modal } from 'antd';
import classnames from 'classnames';
import { AddableRow, ImgCropModal } from 'hermes-react';
import UploadCropPic from '../../../MarketingActivity/BuyGive/UploadCropPic';
import ajax from '../../../../common/ajax';
import styles from './ModifyModal.module.less';
import SelectShops from '../../../../common/SelectShops/index';
import GoodsForm from './GoodsForm';
import { cloneDeep } from 'lodash';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const Preview = ImgCropModal.Preview;
const Option = Select.Option;

const commonTitle = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const link = {
  crmhome: '#/marketing/retailers/manage/makertingPlan',
  support: undefined,
  sale: '#/marketing/retailers/manage/makertingPlan/isKbservLogin',
};

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 12 },
};
function getItemDetailImages(data) {
  if (!data || data.length <= 0) {
    return [];
  }
  return data.map((item) => {
    return item.uid;
  });
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
function parseBuyTips(arr) {
  return (arr || []).filter(d => d.key && d.value && d.value.join(''));
}
function descListLayout(rowIndex) {
  return (rowIndex === 0) ? {
    label: '使用须知',
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  } : {
    label: null,
    wrapperCol: { offset: 7, span: 17 },
  };
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
const DescListLineMaxLen = 100;

function composeImageUrl(fileId) {
  return `http://oalipay-dl-django.alicdn.com/rest/1.0/image?fileIds=${fileId}`;
}

function extractFileId(imageUrl) {
  const [, fileId] = /\bfileIds=([a-zA-Z0-9\-_]+)/.exec(imageUrl);
  return fileId;
}
function checkSpecialCharacter(rule, value, callback) {
  if (/[`~!@#$^&*=|{}':;',\[\].<>/?~！@#￥……&*——|{}【】‘；：”“'。，、？]/.test(value)) {
    callback('品牌名称中不能包含特殊字符');
  } else {
    callback();
  }
}

class ModifyIndex extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
  };

  state = {
    loading: true,
    detaildata: {},
    datas: [],
    errors: {},
    submitting: false,
    tabKey: '',
  }
  componentWillMount() {
    const {smartPromoId} = this.props.params;
    ajax({
      url: '/goods/kbsmartplan/getApplyModifyLog.json',
      method: 'get',
      data: {smartPromoId},
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            detaildata: res.data,
            loading: false,
            autoHidden: true,
          });
          this.update(res.data);
        } else {
          message.error(res.resultMsg || '系统繁忙');
        }
      },
      error: (err) => {
        this.setState({
          loading: false,
        });
        message.error(err.resultMsg || '系统繁忙');
      },
    });
  }
  getPicInfo = (positionInfo) => {
    const { width, height, url } = positionInfo;
    // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
    const fillType = width > height ? 'width' : 'height';
    return (
      <div className={styles.preview}>
        <div className={styles.guide}>
          <p>您上传的图片将会自动适配为以下尺寸</p>
        </div>
        <Preview
          url={url}
          fillType={fillType}
          picStyle={{ borderRadius: '100%', border: '1px solid #ddd', overflow: 'hidden' }}
          style={{ width: 100, height: 100, background: '#fff', marginBottom: 10 }}
          crop={positionInfo}
        />
        <div className={styles.name}>品牌Logo</div>
      </div>
    );
  }
  getDescListError = (activityId, rowIndex) => {
    return this.descListError[activityId] &&
      this.descListError[activityId][rowIndex];
  }
  getItemValue = (values) => {
    const { detaildata } = this.state;
    return detaildata.activities.map(activity => {
      const { activityId } = activity;
      return {
        title: values[`${activityId}-title`],
        originPrice: values[`${activityId}-originPrice`],
        price: values[`${activityId}-price`],
        shopIds: values[`${activityId}-shopIds`],
      };
    });
  }

  descListError = {}

  update = (data) => {
    if (!(data && data.activities)) {
      return;
    }
    this.props.form.setFieldsValue(this.updatedValues(data));
  }

  updatedValues = (data) => {
    const { autoDelayFlag, activities, gmtEnd: endTime, gmtStart: startTime } = data;

    let brandName = '';
    let voucherLogoFileId = '';
    if (activities && activities[0]) {
      brandName = activities[0].vouchers[0].brandName;
      voucherLogoFileId = activities[0].vouchers[0].voucherLogoFileId;
    }

    const values = {
      startTime: moment(startTime).format('YYYY-MM-DD 00:00'),
      endTime: moment(endTime).format('YYYY-MM-DD 23:59'),
      brandName,
      voucherLogoFileList: voucherLogoFileId ? [{
        uid: -1,
        name: '',
        status: 'done',
        url: composeImageUrl(voucherLogoFileId),
        thumbUrl: composeImageUrl(voucherLogoFileId),
      }] : [],
      autoDelayFlag,
    };
    activities.forEach(activity => {
      const { activityId } = activity;
      let descList = [''];
      if (activity && activity.vouchers && activity.vouchers[0]) {
        descList = activity.vouchers[0].descList;
      }
      values[`${activityId}-descList`] = descList.map(text => ({ text }));
    });
    return values;
  }
  validateDescList = (activityId, descList) => {
    if (!this.descListError[activityId]) {
      this.descListError[activityId] = [];
    }
    descList.forEach((desc, idx) => {
      if (desc.text && desc.text.length > DescListLineMaxLen) {
        this.descListError[activityId][idx] = `单条不能超过${DescListLineMaxLen}字`;
      } else {
        this.descListError[activityId][idx] = undefined;
      }
    });
  }
  goBack = () => {
    const { system } = this.props.location.query;
    setTimeout(() => {
      this.setState({submitting: false});
      location.href = link[system];
    }, 3000);
  }
  goCancle = () => {
    Modal.confirm({
      title: '确认放弃编辑',
      content: '关闭后已编辑内容将丢失，确认放弃编辑吗？',
      onOk: () => window.history.back(),
    });
  }
  checkoutItemForm = (err, values) => {
    const { setFields} = this.props.form;
    if (!!err) {
      const errArr = Object.keys(err);
      errArr.forEach((item) => {
        if (/^contents/.test(item) || /^remarks/.test(item)) {
          setFields({
            commodityDetail: {
              value: {},
              errors: [new Error('请输入正确的商品内容')],
            },
          });
        }
        if (/^dishes/.test(item)) {
          setFields({
            commodityDetail: {
              value: {},
              errors: [new Error('请输入正确的详情图片')],
            },
          });
        }
        if (/^introductionText/.test(item) || /^introductionImage/.test(item)) {
          setFields({
            commodityDetail: {
              value: {},
              errors: [new Error('请输入正确的商家介绍')],
            },
          });
        }
      });
      return;
    }
    const contentsField = values.contents;
    const dishesField = values.dishes;
    const introTextField = values.introductionText;
    const introImgField = values.introductionImage;

    if (!contentsField || !isValidContents(contentsField)) {
      // message.error('请输入正确的商品内容', 3);
      setFields({
        commodityDetail: {
          value: {},
          errors: [new Error('请输入正确的商品内容')],
        },
      });
      return;
    }
    if (!dishesField || !isValidDishes(dishesField)) {
      // message.error('请输入正确的详情图片', 3);
      setFields({
        commodityDetail: {
          value: {},
          errors: [new Error('请输入正确的详情图片')],
        },
      });
      return;
    }
    if ((introTextField && !isValidIntroductionText(introTextField)) || (introImgField && !isValidIntroductionImg(introImgField))) {
      setFields({
        commodityDetail: {
          value: {},
          errors: [new Error('请输入正确的商家介绍')],
        },
      });
      return;
    }
  }
  tabSetValue = (val) => {
    const {setFieldsValue, validateFieldsAndScroll} = this.props.form;
    if (val) {
      delete val.startTime;
      delete val.endTime;
      delete val.brandName;
      delete val.shopList;
      delete val.voucherLogoFileList;
      delete val.autoDelayFlag;
    }
    const initVal = {
      ...val,
    };
    setFieldsValue(initVal);
    if (Array.isArray(val.contents)) {
      val.contents.forEach((item, row) => {
        this.props.form.setFieldsValue({
          ['contents' + row + 'title']: item.title,
          ['contents' + row + 'group']: item.itemUnits,
        });
      });
    }
    if (Array.isArray(val.dishes)) {
      val.dishes.forEach((item, row) => {
        this.props.form.setFieldsValue({
          ['dishes' + row + 'title']: item.title,
          ['dishes' + row + 'desc']: item.desc,
          ['dishes' + row + 'images']: item.imageUrls,
        });
      });
    }
    if (Array.isArray(val.remarks)) {
      val.remarks.forEach((item, row) => {
        this.props.form.setFieldsValue({
          ['remarks' + row]: item,
        });
      });
    }
    validateFieldsAndScroll((err, values) => {
      this.checkoutItemForm(err, values);
    });
  }
  tabsChange = (key) => {
    const {getFieldsValue, validateFieldsAndScroll} = this.props.form;
    const { detaildata, datas, errors } = this.state;
    let err = false;
    this.setState({ tabKey: key });
    validateFieldsAndScroll((errv) => {
      if (errv) {
        const err1 = {...errv};
        delete err1.startTime;
        delete err1.endTime;
        delete err1.brandName;
        delete err1.shopList;
        delete err1.voucherLogoFileList;
        const err2 = Object.keys(err1);
        if (err2 && err2.length > 0) {
          err = true;
        }
      }
    });
    const val = getFieldsValue();
    const data = detaildata.items.map((activity, index) => {
      const obj = {
        logId: activity.logId,
      };
      if (datas.length > 0 && (datas[index].logId === activity.logId) && datas[index].initValue) {
        obj.initValue = datas[index].initValue;
      }
      if (val.logId === activity.logId) {
        obj.initValue = val;
      }
      return obj;
    });
    errors[val.logId] = err;
    this.setState({
      datas: data,
      errors,
    });
    data.forEach(item => {
      if (key === item.logId && item.initValue) {
        this.tabSetValue(item.initValue);
        return;
      }
    });
  }
  // subGoods = (data) => {
  // //  data[0]
  // }
  goodsGetDate = (values, data) => {
    const params = {
      itemLogId: data.logId,
      partnerId: data.partnerId,
      title: values.title,
      originPrice: String(values.originPrice),
      price: String(values.price),
      shopIds: values.shopIds,
      remarks: values.remarks,
      latestNotices: [values.latestNotices],
      buyTips: parseBuyTips(values.buyTips),
      buyTipsTemplate: values.buyTipsTemplate, // 新增购买须知模板
      availableTimes: parseAvailableTimes(values.availableTimesType, values.availableTimes),
      forbiddenDates: parseForbiddenDates(values.forbiddenDatesType, values.forbiddenDates),
      totalAmount: values.totalAmount,
      itemImage: [values.firstImage.itemImage],
      taobaoCoverImage: values.firstImage.taobaoCoverImage || '',
      itemDetailImages: getItemDetailImages(values.itemDetailImages), // 商品详情图
      validTimeType: 'RELATIVE',
      rangeTo: values.rangeTo,
      contents: values.contents,
      dishes: deparse(values.dishes),
      introductions: values.introductionText ? deparse([{
        title: values.introductionText,
        imageUrls: values.introductionImage,
      }]) : [],
      categoryId: values.categoryPath && values.categoryPath.length
        ? values.categoryPath[values.categoryPath.length - 1] : '',
      remark: values.remark, // 备注
      ticketDisplayMode: 'TICKET_CODE', // 核销方式，默认券码核销
      displayChannels: 'ALL', // 展示渠道，默认正常渠道
      verifyFrequency: values.verifyFrequency,
      verifyEnableTimes: values.verifyEnableTimes,
    };
    return JSON.stringify(params);
  }
  submit = () => {
    const { detaildata, datas, submitting, tabKey } = this.state;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        message.error('请检查表单项');
        this.checkoutItemForm(errors, values);
      }
      if (!errors) {
        let isError = false;
        detaildata.items.forEach(ite => {
          if (this.state.errors[ite.logId] && ite.logId !== tabKey) {
            message.error('请检查表单项');
            isError = true;
            return;
          }
        });
        if (isError) return;
        const { smartPromoId } = detaildata;
        const { startTime, endTime, brandName, voucherLogoFileList, autoDelayFlag } = values;
        const formatStringStart = 'YYYY-MM-DD 00:00:00';
        const formatStringEnd = 'YYYY-MM-DD 23:59:59';
        const shopIds = (values.shopList || []).map(item => item.id);
        const activities = detaildata.activities.map(activity => {
          const { activityId, vouchers } = activity;
          const descList = values[`${activityId}-descList`].map(({ text }) => text).filter(val => !!val);
          const totalAvailableNum = values[`${activityId}-totalAvailableLimit`] === 'limit' ? values[`${activityId}-totalAvailableNum`] : '-1';
          vouchers[0].descList = descList;
          return {
            activityId,
            descList,
            brandName,
            startTime: moment(startTime).format(formatStringStart),
            endTime: moment(endTime).format(formatStringEnd),
            voucherLogoFileId: extractFileId(voucherLogoFileList[0].url),
            totalAvailableNum,
            vouchers: [...vouchers],
          };
        });
        const items = detaildata.items.map(ite => {
          const {itemId, logId} = ite;
          return {itemId, logId};
        });
        const data2 = detaildata.items.map((activity, index) => {
          const obj = {
            logId: activity.logId,
          };
          if (datas.length > 0 && (datas[index].logId === activity.logId) && datas[index].initValue) {
            obj.initValue = datas[index].initValue;
          }
          if (values.logId === activity.logId) {
            obj.initValue = values;
          }
          return obj;
        });
        if (submitting) return;
        this.setState({submitting: true });
        const promiseArr = data2.map((item, i) => {
          return new Promise((resolve) => {
            if (item.initValue) {
              const goodsData = this.goodsGetDate(item.initValue, detaildata.items[i]);
              ajax({
                url: '/goods/caterItem/updateLogInfo.json',
                method: 'post',
                type: 'json',
                data: {formData: goodsData},
                success: (res) => {
                  if (res.status === 'succeed') {
                    resolve();
                  } else {
                    this.setState({submitting: false});
                    message.error(res.resultMsg || '更新商品失败');
                  }
                },
                error: (res) => {
                  this.setState({submitting: false});
                  message.error(res && res.resultMsg || '更新商品失败');
                },
              });
            } else {
              resolve();
            }
          });
        });
        Promise.all(promiseArr).then(() => {
          ajax({
            url: '/goods/kbsmartplan/modifySmartPlan.json',
            method: 'post',
            type: 'json',
            data: {
              smartPlan: JSON.stringify({
                smartPromoId,
                gmtStart: moment(startTime).format(formatStringStart),
                gmtEnd: moment(endTime).format(formatStringEnd),
                shopIds,
                autoDelayFlag,
                activities,
                items,
                logId: detaildata.logId,
                version: detaildata.version,
              }),
            },
          }).then(result => {
            if (result.status === 'succeed') {
              message.success('修改成功，即将回到列表页…', 3);
              this.goBack();
            } else {
              this.setState({submitting: false});
              throw result;
            }
          }).catch(error => {
            this.setState({submitting: false});
            message.error(error.message || error.resultMsg || '操作失败');
          });
        });
      }
    });
  }
  render() {
    const { detaildata, loading, submitting, datas, errors } = this.state;
    const { smartPromoId, btn } = this.props.params;
    const {system} = this.props.location.query;
    const { getFieldProps, getFieldError, getFieldValue, validateFields } = this.props.form;
    let endTime = '';
    let selectedShops = [];
    if (detaildata) {
      endTime = detaildata.gmtEnd;
      selectedShops = (detaildata.shopIds || []).map(item => {
        return {id: item, shopId: item};
      });
    }
    const detailLink = {
      crmhome: `#/marketing/brands/detail/${smartPromoId}/${btn}?system=crmhome`,
      support: undefined,
      sale: `#/marketing/brands/detail/${smartPromoId}/${btn}?system=sale`,
    };
    return (
      <PageLayout
        footer={<div>
          <div className="ft-center" style={{ marginBottom: 20 }}>
            <p style={{ color: '#999', paddingBottom: 10, fontSize: 12 }}>请将方案中需要修改的内容全部修改完成后，再统一提交。</p>
            <Button type="ghost" onClick={this.goCancle}>取 消</Button>
            <Button type="primary" style={{marginLeft: '20px'}} loading={submitting} onClick={this.submit}>确认修改</Button>
          </div>
        </div>}
        loading={loading}
        breadcrumb={[
          {title: '营销管理', link: link[system]},
          {title: '详情', link: detailLink[system]},
          {title: '修改方案'},
        ]}
      >
        <div>
          <Form horizontal onSubmit={this.submit} form={this.props.form}>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel header="方案基本信息" key="1">
              <FormItem
                {...formItemLayout}
                label="活动时间"
                required
              >
                <FormItem
                  style={{ display: 'inline-block', verticalAlign: 'top' }}
                  label={null}
                  help={(getFieldError('startTime') || []).join(', ')}
                  validateStatus={getFieldError('startTime') && 'error'}
                >
                  <DatePicker
                    {...getFieldProps('startTime', {
                      rules: [
                        { required: true, message: '请选择活动开始时间'},
                        { validator: (rule, value, callback) => {
                          if (!getFieldValue('endTime')) {
                            callback();
                          } else {
                            const startDate = moment(value);
                            const endDate = moment(getFieldValue('endTime'));

                            if (!startDate.isBefore(endDate)) {
                              callback([new Error('开始时间应该早于结束时间')]);
                              return;
                            }

                            if (endDate.diff(startDate, 'days') + 1 < 30) {
                              callback(new Error('活动结束时间至少晚于开始时间30天'));
                              return;
                            }

                            if (getFieldError('endTime')) {
                              validateFields(['endTime'], {force: true});
                            }

                            callback();
                          }
                        }},
                      ],
                    })}
                    format="yyyy-MM-dd 00:00"
                    disabled={detaildata && (detaildata.status !== 'PUBLISHED') /* 活动未生效允许修改 */}
                    disabledDate={current => current && moment(current.time).isBefore(moment(), 'day')}
                  />
                </FormItem>
                <span style={{ verticalAlign: 'top' }}> – </span>
                <FormItem
                  style={{ display: 'inline-block', verticalAlign: 'top' }}
                  label={null}
                  help={(getFieldError('endTime') || []).join(', ')}
                  validateStatus={getFieldError('endTime') && 'error'}
                >
                  <DatePicker
                    {...getFieldProps('endTime', {
                      rules: [
                        { required: true, message: '请选择活动结束时间' },
                        { validator: (rule, value, callback) => {
                          if (!getFieldValue('startTime')) {
                            callback();
                          } else {
                            const startDate = moment(getFieldValue('startTime'));
                            const endDate = moment(value);

                            if (!startDate.isBefore(endDate)) {
                              callback([new Error('结束时间应该大于开始时间')]);
                              return;
                            }

                            if (endDate.diff(startDate, 'days') + 1 < 30) {
                              callback(new Error('活动结束时间至少晚于开始时间30天'));
                              return;
                            }

                            if (getFieldError('startTime')) {
                              validateFields(['startTime'], {force: true});
                            }
                            callback();
                          }
                        }},
                      ],
                    })}
                    format="yyyy-MM-dd 23:59"
                    disabledDate={current => current && moment(current.time).isBefore(moment(endTime), 'day')}
                  />
                </FormItem>
              </FormItem>
              {
                detaildata && detaildata.activities && detaildata.activities.length > 0 && (
                  <FormItem
                    {...formItemLayout}
                    label="品牌名称"
                    required
                    help={(getFieldError('brandName') || []).join(', ')}
                    validateStatus={getFieldError('brandName') && 'error'}
                  >
                    <Input
                      placeholder="请输入品牌名称，20字以内"
                      {...getFieldProps('brandName', {
                        rules: [{
                          required: true,
                          message: '请输入品牌名称',
                        }, {
                          type: 'string',
                          max: 20,
                          message: '品牌名称不能超过20字',
                        }, {
                          validator: checkSpecialCharacter,
                        }],
                      })}
                    />
                  </FormItem>
                )
              }
              <FormItem label="适用门店：" {...formItemLayout} required>
                { !loading && <SelectShops
                selectedShops={selectedShops}
                isEdit
                ignoreNoLicense={detaildata && detaildata.templateType === 'ITEM'}
                shopUrl="/goods/kbsmartplan/queryRestaurantShopsByCityCode.json"
                cityUrl="/goods/kbsmartplan/queryAllRestaurantShop.json"
                {...getFieldProps('shopList', {
                  initialValue: selectedShops,
                  rules: [
                    { validator: (rule, value, callback) => {
                      if (value === undefined || value.length === 0) {
                        callback('至少选择一家门店');
                        return;
                      }
                      callback();
                    }},
                  ],
                })}/>}
              </FormItem>
              {
                detaildata && detaildata.activities && detaildata.activities.length > 0 && (
                  <FormItem
                    {...formItemLayout}
                    label="券Logo"
                    required
                    help={(getFieldError('voucherLogoFileList') || []).join(', ')}
                    validateStatus={getFieldError('voucherLogoFileList') && 'error'}
                  >
                    <UploadCropPic
                      maxSize={5120} // 上传文件最大尺寸,单位为KB
                      triggerText="品牌Logo"
                      rate={1} // 裁剪的虚线框的宽/高比
                      initWidth={0.8}
                      requiredSize={{ width: 500, height: 500 }}  // 要求的最小尺寸
                      getPicInfo={this.getPicInfo}
                      {...getFieldProps('voucherLogoFileList', {
                        rules: [{
                          required: true,
                          message: '请上传品牌Logo',
                        }],
                      })}
                    />
                    <p className={styles.hint}>
                      格式：bmp，png，jpeg，gif。<br />
                      文件体积不超过5MB。<br />
                      尺寸为不小于500 x 500px的正方形。
                    </p>
                  </FormItem>
                )
              }
              <FormItem
                {...formItemLayout}
                label="自动续期"
              >
                <Checkbox {...getFieldProps('autoDelayFlag', { valuePropName: 'checked' })}>
                  自动延长上架时间
                </Checkbox>
                <p className={styles.hint}>
                  活动时间结束后自动延期，每次延期30天
                </p>
              </FormItem>
              </Panel>
              <Panel header="活动详情信息" key="2">
                { !loading && <Tabs type="card" onChange={this.tabsChange}>
                { (detaildata.activities || []).map((activity, index) => {
                  const tabName = commonTitle[index] ? `活动${commonTitle[index]}` : '其他活动';
                  // const errorTip = errors[activity.activityId] ? <Icon style={{ color: '#f50' }} type="exclamation-circle" /> : null;
                  // const tabName = <span>{activity.activityName || '活动'}</span>;
                  return (<TabPane key={index} tab={tabName}>
                  {<div>
                  <FormItem
                    {...formItemLayout}
                    label="券名称"
                  >
                    <p className="ant-form-text">{activity.vouchers[0].voucherName}</p>
                  </FormItem>
                  <Row>
                    <FormItem label="发放总量：" {...formItemLayout} required>
                    <Col span="9">
                      <Select
                        {...getFieldProps(`${activity.activityId}-totalAvailableLimit`, {
                          initialValue: activity.totalAvailableNum === '-1' ? 'nolimit' : 'limit',
                        })}
                        style={{ width: 120 }}
                        placeholder="请选择"
                        disabled={activity.totalAvailableNum === '-1'}
                      >
                        <Option value="nolimit">不限制</Option>
                        <Option value="limit">设定总数</Option>
                      </Select>
                    </Col>
                    <Col span="15">
                      {
                        getFieldValue(`${activity.activityId}-totalAvailableLimit`) === 'limit' &&
                        <FormItem style={{ marginLeft: 10, display: 'inline-block' }}
                          help={getFieldError(`${activity.activityId}-totalAvailableNum`)}
                          validateStatus={
                            classnames({
                              error: !!getFieldError(`${activity.activityId}-totalAvailableNum`),
                            })
                          }
                        >
                          <span style={{marginRight: 10}}>最多发放</span>
                          <InputNumber
                            {...getFieldProps(`${activity.activityId}-totalAvailableNum`, {
                              initialValue: activity.totalAvailableNum === '-1' ? '' : activity.totalAvailableNum,
                              rules: [
                                {
                                  required: getFieldValue(`${activity.activityId}-totalAvailableLimit`) === 'limit',
                                  message: '最多发放总量必填',
                                },
                                {
                                  validator: (rule, value, callback) => {
                                    if (+value < +activity.totalAvailableNum) {
                                      callback(new Error('发放总量只能增加不能减少'));
                                    }

                                    callback();
                                  },
                                },
                              ],
                            })}
                            min={1}
                            max={999999998}
                            step="1"
                          /> 张
                        </FormItem>
                      }
                    </Col>
                  </FormItem>
                  </Row>
                  <div style={{clear: 'both', width: '57%'}}>
                  <AddableRow
                    max={6}
                    {...getFieldProps(`${activity.activityId}-descList`, {
                      onChange: (value) => this.validateDescList(activity.activityId, value),
                    })}
                    options={[{
                      name: 'text',
                      width: 18,
                      render: (rowIndex, formProps) => (
                        <FormItem
                          {...descListLayout(rowIndex)}
                          help={this.getDescListError(activity.activityId, rowIndex)}
                          validateStatus={this.getDescListError(activity.activityId, rowIndex) ? 'error' : ''}
                        >
                          <Input
                            {...formProps}
                            placeholder={`请输入使用说明，${DescListLineMaxLen}字以内`} />
                        </FormItem>
                      ),
                    }]}
                  />
                  <FormItem
                    label={null}
                    wrapperCol={{ offset: 5 }}
                  >
                    <p className={styles.hint} style={{ marginLeft: 3 }}>最多可增加6条，每条{DescListLineMaxLen}字以内</p>
                  </FormItem>
                  </div>
                  </div>}
                </TabPane>);
                })}
                { (detaildata.items || []).map((activity, index) => {
                  const errorTip = errors[activity.logId] ? <Icon style={{ color: '#f50' }} type="exclamation-circle" /> : null;
                  // const tabName = <span>{activity.itemName || '活动'}{errorTip}</span>;
                  const tabName = commonTitle[index + detaildata.activities.length] && <span>{`活动${commonTitle[index + detaildata.activities.length]}`}{errorTip}</span>;
                  return (<TabPane key={activity.logId} tab={tabName}>
                  {<GoodsForm form={this.props.form} logId={activity.logId} amountmin={selectedShops.length * 1500} initValue={datas}/>}
                </TabPane>);
                })}
              </Tabs>}
              </Panel>
            </Collapse>
          </Form>
        </div>
      </PageLayout>
    );
  }
}

export default Form.create()(ModifyIndex);
