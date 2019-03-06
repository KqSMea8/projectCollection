import React, { Component } from 'react';
import { Form, Spin, Button, Modal, Icon, message as msg } from 'antd';
import { cloneDeep } from 'lodash';
import QRCode from 'qrcode.react';
import ajax from '../../../common/ajax';
import componentGetter from '../common/ComponentGetter';
import SelectCommodityModal from '../common/SelectCommodityModal';
import ReduceToFormCfg from './ReduceToFormCfg';
import OtherToFormCfg from './OtherToFormCfg';
import FormBanner from '../../MarketingActivity/common/FormBanner';
import CommonSimulator from '../../MarketingActivity/common/CommonSimulator';
import { fixFrameHeight, getUriParam, Defer } from '../../../common/utils';
import './ReduceToPromo.less';

const message = { ...msg };
if (window.top !== window) {
  ['error', 'warning', 'success'].forEach(f => {
    message[f] = function iframeMessage(text) {
      window.parent.postMessage(JSON.stringify({ action: f, message: text }), '*');
    };
  });
}

function removeEmpty(arr) {
  const v = [];
  arr.forEach(r => {
    if (r.title) {
      const item = {
        title: r.title,
        details: [],
      };
      r.details.filter(d => !!d).forEach(c => {
        if (c) {
          item.details.push(c);
        }
      });
      if (item.details.length > 0) {
        v.push(item);
      }
    }
  });
  return v;
}
// url id => obj
function changeUrlId(id, url) {
  let imgs = [];
  if (Array.isArray(id)) {
    imgs = id.map((item, index) => {
      return {
        id: item,
        status: 'done',
        uid: item,
        url: url[index],
      };
    });
  } else if (!!id) {
    imgs = [{
      id,
      status: 'done',
      uid: id,
      url,
    }];
  }
  return imgs;
}

// 校验其他设置数据格式
function checkContent(v) {
  let value = v;
  if (value && Array.isArray(value) && value.length > 0) {
    value = value.map(item => {
      if (!item.details || !Array.isArray(item.details) || item.details.length === 0) {
        item.details = [''];
      }
      return item;
    });
  } else {
    value = [{ title: '', details: [''] }];
  }
  return value;
}

function formatShopList(data) {
  const checked = [];
  const shopName = [];
  const disabledIds = [];
  const shopList = data.map(city => {
    return {
      id: city.cityCode,
      name: city.cityName,
      children: city.shops.map(shop => {
        if (shop.selected) {
          checked.push(shop.shopId);
        }
        if (shop.shopName && shop.selected) {
          shopName.push({
            name: shop.shopName,
          });
        }
        if (shop.ext && shop.ext.shopCanNotPubItem === '1') {
          // 门店不可发商品标记(无证、资质不全)
          disabledIds.push(shop.shopId);
        }
        return {
          id: shop.shopId,
          name: shop.shopName,
          disabledIds,
          shopCanNotPubItem: shop.ext ? shop.ext.shopCanNotPubItem === '1' : false,
          shopLicenseUnpublished: shop.ext ? shop.ext.shopLicenseUnpublished === '1' : false,
        };
      }),
    };
  });
  return { checked, shopList, disabledIds, shopName };
}
function flattenCategory2CascaderOptions(allCategory = [], onlyToSecond) {
  const res = [];
  allCategory.forEach(cate => {
    const node = {
      label: cate.displayName,
      value: cate.categoryId,
      disabled: !(cate.subCategories && cate.subCategories.length) && !cate.canPublishItem,
      max: cate.priceRange.max,
      min: cate.priceRange.min,
      highSecurity: cate.highSecurity,
    };
    if (cate.subCategories && cate.subCategories.length) {
      if (onlyToSecond) {
        node.children = cate.subCategories.map(d => ({ label: d.name, value: d.categoryId, disabled: !d.canPublishItem }));
      }
      /*eslint-disable */
      else {
      /*eslint-enable */
        node.children = flattenCategory2CascaderOptions(cate.subCategories);
      }
    }
    res.push(node);
  });
  return res;
}
const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};
const FormItem = Form.Item;
class ReduceToPromo extends Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      isLoading: true,      // 读取数据库默认回填值
      isPostLoading: false, // 提交 loading
      initData: {},
      commodityData: [],
      commodityMsg: '', // 商品应用查询报错信息
      selectCommodityModalVisible: false,
      qrCodeVisible: false,
      selectedCommodityId: null,
      partnerId: '',
      detailInfo: [{
        title: '',
        details: [''],
      }],
      buyerNotes: [{
        title: '',
        details: [''],
      }],
      shopList: [],
      disabledIds: [],
      allCategorys: [], // 类目列表
      highSecurity: false, // 是否高危类目
      max: 0, // 优惠价最大值
      min: 0,
      shopLoading: false, // 门店list loading
      goodsLock: false, // 泛行业一键搬家重要信息锁死
      shopName: [],
    };
    this.pid = getUriParam('op_merchant_id', location.search);
    this.partnerName = getUriParam('partnerName', this.props.location.search);
  }

  componentDidMount() {
    this.fetchInitData();
    if (window.top !== window) {
      fixFrameHeight();
      window.top.postMessage(JSON.stringify({ action: 'scrollTop', scrollTop: 0 }), '*');
    }
  }

  setFormInitValue(res) {
    this.props.form.setFieldsValue({
      subject: res.subject,
      oriPrice: res.oriPrice,
      price: res.price,
      coverImageId: changeUrlId(res.coverImageId, res.coverImageUrl),
      inventory: res.inventory,
      validDays: res.validDays,
      categoryId: res.categoryIdPath || [],
      saleShopIds: res.saleShopIds,
    });
    if (Array.isArray(res.detailImageIds)) {
      res.detailImageIds.map((item, i) => {
        this.props.form.setFieldsValue({
          ['detailImageIds' + i]: [changeUrlId(res.detailImageIds, res.detailImageUrls)[i]],
        });
      });
    }

    this.setState({
      isLoading: false,
      initData: res,
      partnerId: res.partnerId,
      detailInfo: checkContent(res.detailInfo),
      buyerNotes: checkContent(res.buyerNotes),
    });
  }
  // 获取commodityId
  fetchCommodity = (partnerId) => {
    const def = new Defer();
    ajax({
      url: window.APP.kbservindustryprodUrl + '/item/leads/queryCommodityPurchased.json',
      method: 'post',
      type: 'json',
      data: {
        partnerId,
      },
      success: res => {
        if (res && res.status === 'succeed') {
          if (res.data && Array.isArray(res.data)) {
            this.setState({
              commodityData: res.data,
            });
            def.resolve();
          }
        } else {
          def.reject(res.resultMsg || '获取服务应用失败');
          this.setState({
            commodityMsg: res.resultMsg || '获取服务应用失败',
          });
        }
      },
      error: () => {
        def.reject('请检查网络');
        this.setState({
          commodityMsg: '获取服务应用失败',
        });
      },
    });
    return def;
  }
  fetchShop = (itemCategoryId) => {
    this.setState({ shopLoading: true });
    ajax({
      url: window.APP.kbservindustryprodUrl + '/home/searchShop.json',
      method: 'post',
      type: 'json',
      data: {
        itemLeadsId: this.props.params.id,
        searchScene: 'itemLeadsShopSearch',
        op_merchant_id: this.pid,
        itemCategoryId: itemCategoryId,
      },
      success: res => {
        if (res.status === 'succeed') {
          const { shopList, checked, disabledIds, shopName } = formatShopList(res.data);
          this.props.form.setFieldsValue({ saleShopIds: checked });
          this.setState({
            shopList,
            disabledIds,
            shopLoading: false,
            shopName,
          });
        } else {
          this.setFormInitValue(this.state.initData);
          message.warning(res.resultMsg || '获取门店列表数据失败');
        }
      },
      error: (err) => {
        this.setFormInitValue(this.state.initData);
        message.warning(err && err.resultMsg || '系统繁忙，请稍后重试。');
      },
    });
  }
  // 获取初始数据
  fetchInitData() {
    const p1 = new Defer();
    const p2 = new Defer();
    this.fetchCommodity(this.pid);
    ajax({
      url: window.APP.kbservindustryprodUrl + '/item/getCategoryTree.json',
      type: 'json',
      method: 'post',
      data: {
        partnerId: this.pid,
      },
      success: (res) => {
        if (res && res.data && res.status === 'succeed') {
          p1.resolve(res);
        } else {
          p1.reject('获取类目信息失败');
        }
      },
      error: () => {
        p1.reject('系统繁忙，请稍后重试。');
      },
    });
    ajax({
      url: window.APP.kbservindustryprodUrl + '/item/leads/getItemLeadsById.json',
      method: 'post',
      type: 'json',
      data: {
        leadsId: this.props.params.id,
      },
      success: res => {
        if (res && res.data && res.status === 'succeed') {
          p2.resolve(res);
          // this.setFormInitValue(res.data);
        } else {
          p2.reject('获取活动信息失败');
        }
      },
      error: (error) => {
        p2.reject(error && error.resultMsg || '系统繁忙，请稍后重试。');
      },
    });
    Promise.all([p1.promise, p2.promise]).then(([res1, res2]) => {
      const options = flattenCategory2CascaderOptions(res1.data.root.subCategories, false);
      this.setState({
        allCategorys: options,
        goodsLock: true, // 以后后端增加drm开关，加判断逻辑
      });
      this.setFormInitValue(res2.data);
      if (res2.data && res2.data.categoryId) {
        this.checkHighSecurity(res2.data.categoryId, res1.data.root.subCategories);
        this.fetchShop(res2.data.categoryId);
      }
    }).catch(err => message.warning(err));
  }
  fetchDetailImageIds(values) {
    const detailImageIds = [];
    for (let i = 0; i < 5; i++) {
      if (values['detailImageIds' + i] && values['detailImageIds' + i].length !== 0 && values['detailImageIds' + i][0].id) {
        detailImageIds.push(values['detailImageIds' + i][0].id);
      }
    }
    return detailImageIds;
  }
  checkHighSecurity = (categoryId, arr) => {
    arr.forEach(item => {
      if (item.categoryId === categoryId) {
        this.setState({
          highSecurity: item.highSecurity,
          max: item.priceRange && item.priceRange.max || 0,
          min: item.priceRange && item.priceRange.min || 0,
        });
        return;
      }
      if (item.subCategories && item.subCategories.length > 0) {
        this.checkHighSecurity(categoryId, item.subCategories);
      }
    });
  }
  changeCategory = (v, max, min, highSecurity) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    this.setState({ max, min, highSecurity });
    this.fetchShop(v);
    setFieldsValue({
      oriPrice: getFieldValue('oriPrice'),
      price: getFieldValue('price'),
    });
  }
  // 控制商品应用的显示
  showSelectCommodityModal() {
    if (this.state.commodityMsg) {
      message.warning(this.state.commodityMsg);
      this.setState({
        isPostLoading: false,
      });
    } else {
      if (this.state.commodityData.length > 0) {
        this.setState({
          selectCommodityModalVisible: true,
        });
      } else {
        this.setState({
          qrCodeVisible: true,
        });
      }
    }
  }
  // 保存
  handleSave = submit => e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) {
        return;
      }
      if (!values.coverImageId || values.coverImageId.length === 0 || !values.coverImageId[0].id) {
        message.warning('请上传商品首图', 3);
        return;
      }
      const params = {
        leadsId: this.props.params.id,
        subject: values.subject,
        oriPrice: values.oriPrice,
        price: values.price,
        coverImageId: values.coverImageId[0].id,
        detailImageIds: this.fetchDetailImageIds(values),
        saleShopIds: values.saleShopIds,
        inventory: values.inventory,
        validDays: values.validDays,
        categoryId: values.categoryId.length > 0 ? values.categoryId[values.categoryId.length - 1] : undefined,
        detailInfo: removeEmpty(values.detailInfo).map(v => JSON.stringify(v)),
        buyerNotes: removeEmpty(values.buyerNotes).map(v => JSON.stringify(v)),
      };
      this.setState({ isPostLoading: true });
      ajax({
        url: window.APP.kbservindustryprodUrl + '/item/leads/modifyItemLeads.json',
        method: 'post',
        type: 'json',
        data: params,
        success: res => {
          if (res && res.status === 'succeed') {
            if (submit) {
              // this.handleSubmit();
              this.showSelectCommodityModal();
            } else {
              this.setState({
                isPostLoading: false,
              });
              message.success('保存成功');
            }
          } else {
            this.setState({
              isPostLoading: false,
            });
            message.warning(res && res.resultMsg ? res.resultMsg : '提交失败');
          }
        },
        error: err => {
          if (err && err.resultMsg) {
            message.warning(err.resultMsg);
          } else {
            message.warning('系统繁忙，请稍后重试。');
          }
          this.setState({
            isPostLoading: false,
          });
        },
      });
    });
  }
  handleSubmit(selectedCommodity) {
    ajax({
      url: window.APP.kbservindustryprodUrl + '/item/leads/batchApplyItemLeadsOnSale.json',
      method: 'post',
      type: 'json',
      data: {
        leadsIds: [this.props.params.id],
        partnerId: this.pid,
        commodityId: selectedCommodity.commodityId,
      },
      success: res => {
        if (res && res.status === 'succeed') {
          this.setState({
            isPostLoading: false,
            selectCommodityModalVisible: false,
          });
          message.success('提交成功，3秒后回到列表页');
          if (window.top !== window) {
            setTimeout(() => {
              window.top.postMessage(JSON.stringify({ action: 'goback' }), '*');
            }, 3000);
          }
        } else {
          this.setState({
            isPostLoading: false,
          });
          message.warning(res && res.resultMsg ? res.resultMsg : '提交失败');
        }
      },
      error: err => {
        if (err && err.resultMsg) {
          message.warning(err.resultMsg);
        } else {
          message.warning('系统繁忙，请稍后重试。');
        }
        this.setState({
          isPostLoading: false,
        });
      },
    });
  }
  handleSelectCommodityModalOk = (selectedCommodity) => {
    this.handleSubmit(selectedCommodity);
  }
  handleSelectCommodityModalCancel = () => {
    this.setState({
      isPostLoading: false,
      selectCommodityModalVisible: false,
    });
  }
  handleQrcodeModalOk = () => {
    this.setState({
      qrCodeVisible: false,
      isPostLoading: false,
    });
  }
  handleQrcodeModalCancel = () => {
    this.setState({
      qrCodeVisible: false,
      isPostLoading: false,
    });
  }
  /* eslint-disable */
  renderForm = () => {
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }
    const { getFieldValue } = this.props.form;
    const { detailInfo, buyerNotes, isPostLoading, initData, selectCommodityModalVisible, commodityData, qrCodeVisible, allCategorys, max, min, highSecurity, goodsLock } = this.state;
    return (
      <div className="one-click-move" style={{ marginTop: '32px', marginBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <CommonSimulator
          caption="商品券展示页面"
          background="https://zos.alipayobjects.com/rmsportal/OQTSPzOAmyydMUUQcbAo.png"
          backgroundStyle={{
            backgroundSize: '223px 785px',
            height: '785px',
          }}
          withScroll
        />
        <Form onSubmit={this.handleSave()} style={{ float: 'left', width: '600px', marginLeft: '40px' }} form={this.props.form} horizontal>
          <FormBanner>
            基本信息
          </FormBanner>
          {ReduceToFormCfg.slice().map(cfg => {
            /* eslint-enable */
            let fmProps = cloneDeep(cfg);
            if (cfg.field === 'categoryId') {
              fmProps.allCategorys = allCategorys;
              fmProps.changeCategory = this.changeCategory;
              if (highSecurity && getFieldValue('categoryId').length > 0) {
                fmProps.extra = (<span style={{ color: '#f94' }}>该类目为特殊行业，对商品的适用门店有特殊资质要求。</span>);
              }
            } else if (cfg.field === 'saleShopIds') {
              fmProps.shopList = this.state.shopList;
              fmProps.disabledIds = this.state.disabledIds;
              fmProps.shopLoading = this.state.shopLoading;
              // fmProps.goodsLock = goodsLock; // 门店暂时不锁
              fmProps.shopName = this.state.shopName;
              if (!getFieldValue('categoryId') || getFieldValue('categoryId').length === 0) {
                fmProps.extra = (<p style={{ color: '#f94' }}>请先选择所属类目</p>);
              }
            } else if (cfg.field === 'subject') {
              let disabled = false;
              if (initData && initData.config && initData.config.canModifyCoreFields !== 1 && !!initData.subject || goodsLock) {
                disabled = true;
              }
              fmProps.disabled = disabled;
            } else if (fmProps.field && (fmProps.field.origin === 'oriPrice' || fmProps.field.changed === 'price')) {
              let isShow = false;
              let maxValue = 0;
              let minValue = 0;
              let disabled = { origin: false, changed: false };
              if (initData && initData.config && initData.config.priceMaxLimit) {
                isShow = true;
                maxValue = initData.config.priceMaxLimit / 100;
              }
              if (max) {
                maxValue = max / 100;
              }
              if (min) {
                minValue = min / 100;
                fmProps.rules.origin.push((r, v, cb) => {
                  if (v && +v < minValue) {
                    cb(`原价不能小于 ${minValue}`);
                  }
                  cb();
                });
                fmProps.rules.changed.push((r, v, cb) => {
                  if (v && +v < minValue) {
                    cb(`优惠价不能小于 ${minValue}`);
                  }
                  cb();
                });
              }
              if (initData && initData.config && initData.config.canModifyCoreFields !== 1) {
                if (initData.oriPrice > 0) {
                  disabled.origin = true;
                }
                if (initData.price > 0) {
                  disabled.changed = true;
                }
              }
              if (goodsLock) {
                disabled.origin = true;
                disabled.changed = true;
              }
              if (!getFieldValue('categoryId') || getFieldValue('categoryId').length === 0) {
                disabled = true;
                fmProps.extra = ([<span style={{ color: '#f94' }}>请先选择所属类目</span>, <br/>, <span>部分特殊行业(白名单商户)的原价、优惠价最高可设置金额为30000元。</span>]);
              }
              if (maxValue > 0) {
                fmProps.rules.changed.push((r, v, cb) => {
                  if (+v > maxValue) {
                    cb(`优惠价不能超过 ${maxValue}`);
                  }
                  cb();
                });
                fmProps.rules.origin.push((r, v, cb) => {
                  if (+v > maxValue) {
                    cb(`原价不能超过 ${maxValue}`);
                  }
                  cb();
                });
              }
              fmProps = { ...fmProps, isShow, disabled };
            } else if (cfg.field === 'inventory' && goodsLock) {
              fmProps.disabled = true;
            }
            return componentGetter({ ...formItemLayout, ...fmProps });
          })}
          <FormBanner>
            其他设置
          </FormBanner>
          {/* OtherConfigForm.slice().map(cfg => {
            return componentGetter({ ...formItemLayout, ...cfg, data: this.state.data });
          })*/}
          {componentGetter({ ...formItemLayout, ...OtherToFormCfg.slice()[0], data: detailInfo })}
          {componentGetter({ ...formItemLayout, ...OtherToFormCfg.slice()[1], data: buyerNotes })}
          <FormItem wrapperCol={{ span: 15, offset: 6 }}>
            <Button type="primary" onClick={this.handleSave(true)} loading={isPostLoading}>
              提 交
            </Button>
            {/* <Button loading={isPostLoading} htmlType="submit" >
              保 存
            </Button>*/}
          </FormItem>
          <SelectCommodityModal visible={selectCommodityModalVisible} list={commodityData} onOk={this.handleSelectCommodityModalOk} onCancel={this.handleSelectCommodityModalCancel} top={modalTop} />
          <Modal
            style={{ top: modalTop }}
            className="selectcommodity-qrcode-modal "
            visible={qrCodeVisible}
            title="选择应用"
            onOk={this.handleQrcodeModalOk}
            onCancel={this.handleQrcodeModalCancel}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.handleQrcodeModalOk}>
                知道了
              </Button>,
            ]}>
            <p className="title"><Icon type="info-circle" style={{ color: '#1F90E6', marginRight: '10px' }} />商户未订购可用的商品管理服务</p>
            <p>您可以打开“钉钉－扫一扫”，扫描下方二维码，</p>
            <p>为商户订购商品管理服务，并在手机中完成剩余操作。</p>
            {
              this.partnerName ? <QRCode value={`https://render.alipay.com/p/h5/IntelligentProd-dingtalk/www/index.html#/goodslist?pid=${this.pid}&merchantName=${encodeURIComponent(this.partnerName)}`} size={128} />
              :
              <img src="https://zos.alipayobjects.com/rmsportal/hQNpPekyfwMWrwIvyKyV.png" />
            }
          </Modal>
        </Form>
      </div>
    );
  }

  render() {
    window.f = this.props.form;
    return (
      <div>
        <div className="kb-detail-main" style={{ overflow: 'hidden' }}>
          {
            this.state.isLoading ? <div style={{ textAlign: 'center', marginTop: 80 }}><Spin /></div>
              : this.renderForm()
          }
        </div>
      </div>
    );
  }
}

export default Form.create()(ReduceToPromo);
