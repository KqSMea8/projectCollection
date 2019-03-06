/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { Row, Col, Input, Button, Modal, Form, Cascader, Tabs, Tooltip, message} from 'antd';
import ajax from '../../../../common/ajax';
import Tree from 'hermes-treeselect/asynctree.jsx';
import ShopUploadBox from '../ShopUpload/ShopUploadBox';
import { noop, groupBy } from 'lodash';
import './style.less';
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
      return Object.assign({}, d, { provinceCode, provinceName });
    }
    return d;
  });
}

function parseData(treeData) {
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
        newShop.id = shop.shopId || shop.id;
        newShop.name = shop.shopName || shop.name;
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

function parseCityShops(shopData) {
  if (shopData) {
    return shopData.map((shop) => {
      const newShop = {};
      newShop.id = shop.shopId;
      newShop.name = shop.shopName;
      return newShop;
    });
  }
  return [];
}

function parseCityShopsId(shopData) {
  let newShop = [];
  if (shopData) {
    shopData.map((shop, index) => {
      newShop.push({id: shop.shops[index].id, shopId: shop.shops[index].id});
    });
  }
  return newShop;
}

class ShopTree extends Component {
  static propTypes = {
    isEdit: PropTypes.bool,
    selectedShops: PropTypes.array,
    shopUrl: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
    cityUrl: PropTypes.string,
    categoryUrl: PropTypes.string,
    form: PropTypes.object.isRequired,
    cityShops: PropTypes.array,
    canReduce: PropTypes.bool,
    orderId: PropTypes.string,
  }
  static defaultProps = {
    isEdit: false,
    selectedShops: [],
    shopUrl: '/goods/itempromo/getShopsByCityForNewCamp.json',
    onChange: noop,
    cityUrl: '/goods/itempromo/getShops.json',
    categoryUrl: '/goods/queryAllCategorys.json',
    canReduce: false,
  }
  constructor(props) {
    super(props);
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    this.merchantId = merchantIdInput ? merchantIdInput.value : '';
    this.state = {
      rightData: parseData(parseRightData(props.selectedShops)),
      leftData: [],
      checked: this.props.cityShops ? parseCityShopsId(this.props.cityShops) : [],
      disabled: [],
      visible: this.props.visible,
      allCategorys: [],
      disabledTabs: [],
      logId: '',
    };
    if (props.selectedShops && props.selectedShops.length) {
      this.state.checked = flattenData(props.selectedShops);
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
      data: { op_merchant_id: this.merchantId },
      type: 'json',
      success: (res) => {
        self.setState({
          leftData: parseData(res.shopCountGroupByCityVO),
        });
      },
    });
  }


  onCheck(/* id*/) {
  }

  onExpand(/* id*/) {
  }

  onChange(checked) {
    this.onShopSelectFunction(checked.map((d) => ({ id: d, shopId: d })));
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
          data: { cityCode: id, op_merchant_id: this.merchantId },
          method: 'get',
          type: 'json',
          success: (res) => {
            resolve(parseCityShops(res.shopComps));
          },
        });
      });
    }
    const { getFieldsValue, getFieldValue } = this.props.form;
    const seachParams = Object.assign({}, getFieldsValue(), {
      categoryId: getFieldValue('categoryId').length ?
        getFieldValue('categoryId')[getFieldValue('categoryId').length-1] : '',
    });
    if (id === '#') {
      return new Promise((resolve) => {
        ajax({
          url: this.props.cityUrl,
          method: 'get',
          type: 'json',
          data: { ...seachParams, op_merchant_id: this.merchantId },
          success: (res) => {
            resolve(parseData(res.shopCountGroupByCityVO));
          },
        });
      });
    }
    return new Promise((resolve) => {
      ajax({
        url: this.props.shopUrl,
        method: 'GET',
        type: 'json',
        data: { ...seachParams, cityCode: id, op_merchant_id: this.merchantId },
        success: (res) => {
          resolve(parseCityShops(res.shopComps));
        },
      });
    });
  }


  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    const type = this.props.form.getFieldValue('activeTab')
    if (type === 'upload') {
      if (this.state.logId === '') {
        message.error('上传门店不符合条件, 不能提交');
      } else {
        const data = {logId: this.state.logId, shopType: 'upload'}
        this.props.modalProps.onOk(data);
      }
    } else {
      const data = {shops: this.state.checked, shopType: 'select'}
      this.props.onChange(this.state.checked);
      this.props.modalProps.onOk(data);
    }
  }

  handleLogId(data) {
    if (data) {
      this.setState({
        logId: data,
      });
    }
  }

  onShopSelectFunction(shop) {
    // 置灰 TabPane

    const pickedShop = shop.length;
    if (pickedShop > 0) {
      this.setState({
        disabledTabs: ['upload'],
      });
    } else {
      this.setState({
        disabledTabs: [],
      });
    }
  }

  onShopUploadFunction(uploadFile) {
    // 置灰 TabPane
    if (uploadFile > 0) {
      this.setState({
        disabledTabs: ['select'],
      });
    } else {
      this.setState({
        disabledTabs: [],
      });
    }
  }

  handleCancel() {
    this.props.modalProps.onCancel();
  }

  handleChange(key) {
    this.props.form.setFieldsValue({'activeTab': key});
  }

  render() {
    const { rightData, leftData, checked, disabled, allCategorys, disabledTabs} = this.state;
    const { isEdit, canReduce } = this.props;
    const form = this.props.form;
    const { getFieldProps } = form;
    const checkedShopIds = checked.map((d) => d.id);
    const defaultActiveKey = 'select';
    // 当前选中哪个tab
    this.props.form.getFieldProps('activeTab', {
      initialValue: defaultActiveKey,
    });

    return (
      <div ref="shopCompContainer" >
        <Modal title=" "
          className="shopCompContainer"
          closable={true}
          visible={this.props.visible}
          width={700}
          footer={<div>
            <Button onClick={this.handleOk.bind(this)} type="primary">确定</Button>
          </div>}
          onCancel={this.handleCancel.bind(this)}
        >
          <div className="single-voucher-wrapper">
            { // 由于tabs 在disabled时无法加hover事件, 也没有tabOnClick事件，这里只能在外部放一个正方形，实现Tab 在disabled的时候hover特效
              disabledTabs.indexOf('select') !== -1 && <div className="hover-for-tab"><Tooltip title="删除上传文件方可点击"><div className="hover-tab-left">选择门店</div></Tooltip></div>
            }
            { // 由于tabs 在disabled时无法加hover事件, 也没有tabOnClick事件，这里只能在外部放一个正方形，实现Tab 在disabled的时候hover特效
              disabledTabs.indexOf('upload') !== -1 && <div className="hover-for-tab"><div className="hover-tab-left">选择门店</div><Tooltip title="取消已经选择门店方可点击"><div className="hover-tab-left" style={{marginLeft: 24}}>批量上传门店</div></Tooltip></div>
            }
            <Tabs defaultActiveKey={defaultActiveKey} onChange={(val) => {this.handleChange(val);}}>
              <TabPane tab="选择门店" key="select" disabled={disabledTabs.indexOf('select') !== -1}>
                <div style = {{ width: 640, margin: '0 auto' }}>
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
                          <Input {...getFieldProps('brandName')} placeholder="输入品牌名" />
                        </FormItem>
                      </Col>
                      <Col span="7">
                        <FormItem style={{ paddingRight: 16 }}>
                          <Input {...getFieldProps('shopName')} placeholder="输入门店名称" />
                        </FormItem>
                      </Col>
                      <Col span="2">
                        <Button type="primary" htmlType="submit">搜索</Button>
                      </Col>
                    </Row>
                  </Form>
                  <Tree
                    {...{ rightData, leftData, disabled, fetch: this.fetch.bind(this) }}
                    onCheck = {this.onCheck.bind(this)}
                    checked = {checkedShopIds}
                    onChange = {this.onChange.bind(this)}
                    onExpand = {this.onExpand.bind(this)}
                  />
                </div>
              </TabPane>
              <TabPane tab="批量上传门店" key="upload" disabled={disabledTabs.indexOf('upload') !== -1}>
                <ShopUploadBox {...this.props} onLogId={this.handleLogId.bind(this)} onShopUploadFunction={(value) => {this.onShopUploadFunction(value);}}/>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ShopTree);
