/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { Row, Col, Input, Button, Modal, Form, Cascader, Tag, Tabs, Tooltip, message } from 'antd';
import ajax from '../../../../common/ajax';
import Tree from 'hermes-treeselect/asynctree.jsx';
import { noop, groupBy, uniq, get } from 'lodash';
import { saveJumpTo } from '../../../../common/utils';
import ShopUploadBox from '../../../../common/SelectShops/ShopUploadBox';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

/**
 * @param {Array} [allCategory=[]]
 * @param {bool} onlyToSecond  只取到二级目录
 * @returns Cascader 用数据格式
 */
export function flattenCategory2CascaderOptions(allCategory = [], onlyToSecond) {
  const res = [];
  allCategory.forEach(cate => {
    const node = {
      label: cate.name,
      value: cate.id,
    };
    if (cate.subCategorys && cate.subCategorys.length) {
      if (onlyToSecond) {
        node.children = cate.subCategorys.map(d => ({ label: d.name, value: d.id }));
      }
      else {
        node.children = flattenCategory2CascaderOptions(cate.subCategorys);
      }
    }
    res.push(node);
  });
  return res;
}

export function flattenData(data) {
  if (!data || !data.length) return [];
  let shops = [];
  data.forEach(d => {
    if (d.shops && d.shops.length) {
      shops = shops.concat(d.shops);
    } else {
      shops.push(d);
    }
  });
  return shops;
}

function parseRightData(data) {
  return data.filter(d => d.shops && d.shops.length).map(d => {
    const provinceCode = d.shops.every(f => !!f.provinceCode) ? d.shops[0].provinceCode : '';
    const provinceName = d.shops.every(f => !!f.provinceName) ? d.shops[0].provinceName : '';
    if (provinceCode && provinceName) {
      Object.assign(d, { provinceCode, provinceName });
    }
    d.shops = [...(d.shops || [])]
      .map(shop => ({ ...shop, shopId: shop.id }));
    return d;
  });
}


function parseCityShops(shopData, checkedIds = [], needCheckShop = false) {
  if (shopData) {
    const cityShops = shopData.map((shop) => {
      const newShop = {};
      const ext = shop.extInfo || {};
      newShop.id = shop.shopId;
      newShop.name = shop.shopName;
      newShop.newHuaihai = ext.newHuaihai === 'true';
      newShop.ninetyDay = ext.ninetyDay === 'true';
      newShop.haveLicense = !!shop.haveLicense;
      if (needCheckShop && !newShop.haveLicense && !newShop.newHuaihai
        && !newShop.ninetyDay && checkedIds.indexOf(newShop.id) === -1) {
        newShop.disabled = 1;
      }
      return newShop;
    });
    return cityShops;
  }
  return [];
}

function renderNodeGen(needCheckShop = false) {
  // 不需要验证无证门店时，不显示 90 天标
  return (node) => (
    <span>{node.name} {
      needCheckShop && (node.leafCount === 0 || node.leafCount === undefined) && !node.haveLicense && (node.ninetyDay || node.newHuaihai) && (
        <Tag color="yellow">
          无证(90天试用)
        </Tag>
      )}
      {(node.leafCount === 0 || node.leafCount === undefined) && !node.haveLicense && !node.ninetyDay && !node.newHuaihai && (
        <Tag color="yellow">
          无证
        </Tag>
      )}
      {/* {(node.leafCount === 0 || node.leafCount === undefined) && node.newHuaihai === true && (
        <Tag color="blue">淮海</Tag>
      )} */}
    </span>
  );
}

function parseData(treeData, checkedIds = [], needCheckShop = false) {
  if (!treeData || !treeData.length) return [];
  const cityShops = treeData.map((city) => {
    const newCity = {};
    newCity.id = city.cityCode;
    newCity.name = city.cityName;
    newCity.count = city.shopCount;
    newCity.leafCount = city.leafCount;
    newCity.provinceCode = city.provinceCode;
    newCity.provinceName = city.provinceName;
    if (city.shops) {
      newCity.children = city.shops.map((shop) => {
        const newShop = {};
        const ext = shop.extInfo || {};
        newShop.id = shop.shopId;
        newShop.name = shop.shopName || shop.name;
        newShop.newHuaihai = ext.newHuaihai === 'true';
        newShop.ninetyDay = ext.ninetyDay === 'true';
        newShop.haveLicense = !!shop.haveLicense;
        if (needCheckShop && !newShop.haveLicense && !newShop.newHuaihai
          && !newShop.ninetyDay && checkedIds.indexOf(newShop.id) === -1) {
          newShop.disabled = 1;
        }
        return newShop;
      });
    }
    return newCity;
  });
  if (treeData.some(d => d.provinceCode === undefined)) {
    return cityShops;
  }
  const groupByProvince = groupBy(cityShops, d => d.provinceCode);
  const res = [];
  Object.keys(groupByProvince).forEach(pid => {
    const tmp = groupByProvince[pid];
    if (!tmp || !tmp.length) return;
    res.push({
      id: pid,
      name: tmp[0].provinceName,
      children: tmp,
      count: tmp.length,
      leafCount: tmp.reduce((p, c) => p + c.leafCount, 0),
    });
  });
  return res;
}

function jumpTo() {
  if (window.top !== window) {
    saveJumpTo(window.APP.kbservcenterUrl + '/sale/index.htm#/shop', '_blank');
  } else {
    saveJumpTo('/shop.htm#/shop', '_blank');
  }
}

class ShopTree extends Component {
  static propTypes = {
    isEdit: PropTypes.bool,
    selectedShops: PropTypes.array,
    shopUrl: PropTypes.string,
    onChange: PropTypes.func,
    cityUrl: PropTypes.string,
    categoryUrl: PropTypes.string,
    form: PropTypes.object.isRequired,
    canReduce: PropTypes.bool,
    needCheckShop: PropTypes.bool,  // 是否需要检查门店证照
    activeKey: PropTypes.oneOf(['select', 'upload']),
    onUpload: PropTypes.func,   // 上传成功
  }
  static defaultProps = {
    isEdit: false,
    selectedShops: [],
    shopUrl: '/goods/catering/getShopsByCityForNewCamp.json',
    // shopUrl: 'http://pickpost.alipay.net/mock/tuanjie/getShopsByCityForNewCamp.json',
    onChange: noop,
    cityUrl: '/goods/catering/queryShops.json',
    // cityUrl: 'http://pickpost.alipay.net/mock/tuanjie/queryShops.json',
    categoryUrl: '/goods/queryAllCategorys.json',
    canReduce: false,
    needCheckShop: false,
  }
  constructor(props) {
    super(props);
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    this.merchantId = merchantIdInput ? merchantIdInput.value : '';
    this.state = {
      rightData: parseData(parseRightData(props.selectedShops), [], props.needCheckShop),
      leftData: [],
      checked: [],
      disabled: [],
      visible: false,
      allCategorys: [],
      disabledTabs: [],
      activeKey: 'select',
    };
    if (props.selectedShops && props.selectedShops.length) {
      this.state.checked = flattenData(props.selectedShops).map(d => Object.assign({}, d, { shopId: d.id }));
      if (props.isEdit && !props.canReduce) {
        this.state.disabled = this.state.checked.map(d => d.id);
      }
    }
  }

  componentDidMount() {
    this.queryCategory();
    const self = this;
    ajax({
      url: this.props.cityUrl,
      method: 'get',
      data: { op_merchant_id: this.merchantId, limitMode: this.props.limitMode },
      type: 'json',
      success: (res) => {
        self.setState(state => {
          const next = { ...state };
          next.leftData = parseData(res.shopCountGroupByCityVO,
            state.checked.map(d => d.id), this.props.needCheckShop);
          return next;
        });
      },
    });
  }


  onCheck(/* id*/) {
  }

  onExpand(/* id*/) {
  }

  onChange(checked) {
    this.setState({
      checked: checked.map((d) => ({ id: d, shopId: d })),
    });
  }

  onSearch(e) {
    e.preventDefault();
    this.setState({
      searching: true,
      leftData: [],
    });
  }

  queryCategory() {
    const self = this;
    ajax({
      url: this.props.categoryUrl,
      type: 'json',
      method: 'get',
      data: { op_merchant_id: this.merchantId },
      success: (res) => {
        const options = flattenCategory2CascaderOptions(res.CategoryResult, true);
        options.unshift({ label: '全部品类', value: '' });
        self.setState({
          allCategorys: options,
        });
      },
    });
  }

  fetch(id /* , level*/) {
    const { searching } = this.state;
    if (!searching) {
      if (id === '#') {
        return Promise.resolve([]);
      }
      return new Promise((resolve) => {
        ajax({
          url: this.props.shopUrl,
          data: { cityCode: id, op_merchant_id: this.merchantId, limitMode: this.props.limitMode },
          method: 'get',
          type: 'json',
          success: (res) => {
            resolve(parseCityShops(res.shopComps, this.state.checked.map(d => d.id), this.props.needCheckShop));
          },
        });
      });
    }
    const { getFieldsValue, getFieldValue } = this.props.form;
    const seachParams = Object.assign({}, getFieldsValue(), {
      categoryId: getFieldValue('categoryId').length ?
        getFieldValue('categoryId')[getFieldValue('categoryId').length - 1] : '',
    });
    if (id === '#') {
      return new Promise((resolve) => {
        ajax({
          url: this.props.cityUrl,
          method: 'get',
          type: 'json',
          data: { ...seachParams, op_merchant_id: this.merchantId, limitMode: this.props.limitMode },
          success: (res) => {
            resolve(parseData(res.shopCountGroupByCityVO, this.state.checked.map(d => d.id), this.props.needCheckShop));
          },
        });
      });
    }
    return new Promise((resolve) => {
      ajax({
        url: this.props.shopUrl,
        method: 'GET',
        type: 'json',
        data: { ...seachParams, cityCode: id, op_merchant_id: this.merchantId, limitMode: this.props.limitMode },
        success: (res) => {
          resolve(parseCityShops(res.shopComps, this.state.checked.map(d => d.id), this.props.needCheckShop));
        },
      });
    });
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  validateCheck() {// 检测是否选择门店
    let bool = true;
    let data;
    const checked = this.state.checked || [];
    const activeKey = this.state.activeKey;// 当前选中的tab
    if (activeKey === 'select') {// 手动选择
      bool = checked.length > 0 ? false : true;
      data = {
        checked,
        checkedShopQuatity: checked.length,
        shopType: 'select',
      };
    } else {
      // 文件上传
      const uploadStatu = this.props.form.getFieldValue('uploadStatu');
      bool = !uploadStatu.hasUpload;
      data = {
        logId: uploadStatu.logId,
        checkedShopQuatity: uploadStatu.shopTotalCnt,
        shopType: 'upload',
      };
    }
    return { data, error: bool, activeTab: activeKey };
  }

  handleOk = () => {
    const modalData = this.validateCheck();
    const { data, error, activeTab } = modalData;
    if (error) {
      message.error('请选择或者上传门店');
      return;
    }

    if (activeTab === 'select') {
      this.props.onChange(modalData.data.checked);
    } else {
      const logId = modalData.data.logId;
      if (!logId) {
        message.error('请先上传文件');
      }
      this.props.onUpload(logId);
      this.setState({
        checkedShopQuatity: modalData.data.checkedShopQuatity,
      });
    }
    this.setState({
      visible: false,
    });
  }

  handleTabSwitch = activeKey => this.setState({ activeKey });

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onShopUploadFunction = uploadFile => {
    // 置灰手动选择门店tab
    if (uploadFile > 0) {
      this.setState({
        disabledTabs: ['select'],
      });
    } else {// 取消置灰
      this.setState({
        disabledTabs: [],
      });
    }
  }

  uploadFileSuccess = val => {
    this.setState({
      uploadStatu: val,
    });
  }

  render() {
    const { rightData, leftData, checked, disabled, allCategorys, disabledTabs } = this.state;
    const { isEdit, canReduce } = this.props;
    const form = this.props.form;
    const { getFieldProps } = form;
    const checkedShopIds = checked.map((d) => d.id);
    const checkedShopQuatity = this.state.activeKey === 'select' ?
      checkedShopIds.length : this.state.checkedShopQuatity;

    return (
      <div ref="shopCompContainer">
        {
          checkedShopQuatity && checkedShopQuatity > 0 ? <span>已选择{checkedShopQuatity}家门店<a style={{ marginLeft: '16px' }}
            onClick={this.showModal.bind(this)}>{isEdit && canReduce ? '修改' : isEdit && !canReduce ? '新增' : '查看'}</a></span>
            : <a onClick={this.showModal.bind(this)}>选择门店</a>
        }
        <Modal title="选择门店"
          closable={false}
          visible={this.state.visible}
          width={700}
          footer={<div>
            <Button onClick={this.handleOk} type="primary">确定</Button>
          </div>}
          onCancel={this.handleCancel}
        >
          <div className="single-voucher-wrapper">
            { // 由于tabs 在disabled时无法加hover事件, 也没有tabOnClick事件，这里只能在外部放一个正方形，实现Tab 在disabled的时候hover特效
              disabledTabs.indexOf('select') !== -1 && <div className="hover-for-tab"><Tooltip title="删除上传文件方可点击"><div className="hover-tab-left">选择门店</div></Tooltip></div>
            }
            { // 由于tabs 在disabled时无法加hover事件, 也没有tabOnClick事件，这里只能在外部放一个正方形，实现Tab 在disabled的时候hover特效
              disabledTabs.indexOf('upload') !== -1 && !isEdit ? <div className="hover-for-tab"><div className="hover-tab-left">选择门店</div><Tooltip title="取消已经选择门店方可点击"><div className="hover-tab-left">上传门店</div></Tooltip></div>
                : null
            }
            <Tabs
              activeKey={this.state.activeKey}
              onChange={this.handleTabSwitch}
            >
              <TabPane key="select" tab="选择门店" disabled={disabledTabs.indexOf('select') !== -1}>
                <Form form={form} horizontal onSubmit={this.onSearch.bind(this)} >
                  <Row>
                    <Col span="7">
                      <FormItem style={{ paddingRight: 16 }}>
                        <Cascader
                          style={{ marginTop: '-1px' }}
                          changeOnSelect
                          {...getFieldProps('categoryId', { initialValue: [''] }) }
                          options={allCategorys}
                        />
                      </FormItem>
                    </Col>
                    <Col span="7">
                      <FormItem style={{ paddingRight: 16 }}>
                        <Input {...getFieldProps('brandName') } placeholder="输入品牌名" />
                      </FormItem>
                    </Col>
                    <Col span="7">
                      <FormItem style={{ paddingRight: 16 }}>
                        <Input {...getFieldProps('shopName') } placeholder="输入门店名称" />
                      </FormItem>
                    </Col>
                    <Col span="2">
                      <Button type="primary" htmlType="submit">搜索</Button>
                    </Col>
                  </Row>
                </Form>
                <Tree
                  {...{ rightData, leftData, disabled, fetch: this.fetch.bind(this) }}
                  onCheck={this.onCheck.bind(this)}
                  checked={checkedShopIds}
                  onChange={this.onChange.bind(this)}
                  onExpand={this.onExpand.bind(this)}
                  nodeText={renderNodeGen(this.props.needCheckShop)}
                />
                <div style={{ paddingTop: '10px' }}>
                  <Tag color="yellow">
                    无证
                  </Tag>&nbsp;
                  打标门店未上传证照信息，不符合活动参与要求，请先到“<a onClick={jumpTo}>我的门店</a>”中上传证照
                </div>
              </TabPane>
              <TabPane
                key="upload"
                tab="上传门店列表"
                disabled={disabledTabs.indexOf('upload') !== -1 || checked.length > 0}
              >
                <ShopUploadBox form={form} onShopUploadFunction={this.onShopUploadFunction} />
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ShopTree);
