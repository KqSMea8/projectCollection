/**
 * WARNING:
 * 高能预警，要修改此控件前请询问 @团结，此警告一直有效到把该控件的潜在坑修复为止
 */
/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { Row, Col, Input, Button, Modal, Form, Cascader } from 'antd';
import ajax from '../../../../../common/ajax';
import Tree from '../../../../../common/Tree/async/index.jsx';
import { noop, groupBy, pick } from 'lodash';
const FormItem = Form.Item;

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

class ShopTree extends Component {
  static propTypes = {
    isEdit: PropTypes.bool,
    selectedShops: PropTypes.array,
    shopUrl: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    cityUrl: PropTypes.string,
    categoryUrl: PropTypes.string,
    form: PropTypes.object.isRequired,
    canReduce: PropTypes.bool,
    onShopSelectFunction: PropTypes.func,
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
      checked: [],
      disabled: [],
      visible: false,
      allCategorys: [],
    };
    if (props.selectedShops && props.selectedShops.length) {
      this.state.checked = flattenData(props.selectedShops).map(d => Object.assign({}, d, { shopId: d.id }));
      this.props.form.setFieldsValue({selecshop: this.state.checked});//
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


  onCheck(/* id */) {
  }

  onExpand(/* id */) {
  }

  onChange(checked, model) {
    const checkedshop = checked.map((d) => ({ id: d, shopId: d }));
    this.setState({
      checked: checkedshop,
    });
    
    const shopIdList = checked;
    const allShops = model.database;
    let length = 0;
    length = shopIdList && shopIdList.length;
    this.shopData = shopIdList || [];
    const postShops = [];
    let idx = 0;
    let curShopId;
    shopIdList.map((item, index) => {
      const shop = allShops[item];
      if (shop && shop.$$children && shop.$$children.length === 0 && shop.$$ancestors && shop.$$ancestors.length) {
        const ancestor = shop.$$ancestors[0] + '';
        let city = {
          cityCode: ancestor,
          cityName: allShops[shop.$$ancestors[0]].name,
          shops: []
        }
        postShops.push(city);
        city.shops.push({id: item + '', shopId: item + '', name: shop.name, provinceCode: allShops[shop.$$ancestors[0]].provinceCode, provinceName: allShops[shop.$$ancestors[0]].provinceName});
      }
    });
    const map = {};
    const arr = [];
    for(let i = 0; i < postShops.length; i++) {
      const di = postShops[i];
      const n = di.cityCode;
      if (!map[n]) {
        map[n] = di.shops;
        arr.push(di);
      } else {
        for(let j = 0; j < arr.length; j++){
            const aj = arr[j];
            if(aj.cityCode == n){
                aj.shops.push(di.shops[0]);
                break;
            }
        }
      }
    }
    this.props.form.setFieldsValue({selecshop: arr});// 
    this.props.onShopSelectFunction(arr);// 回传门店上层
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
    const seachParams = pick(Object.assign({}, getFieldsValue(), {
      categoryId: getFieldValue('categoryId').length ?
        getFieldValue('categoryId')[getFieldValue('categoryId').length-1] : '',
    }), ['brandName', 'shopName', 'categoryId']);
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

  render() {
    const { rightData, leftData, checked, disabled, allCategorys } = this.state;
    const { isEdit, canReduce } = this.props;
    const form = this.props.form;
    const { getFieldProps } = form;
    const checkedShopIds = checked.map((d) => d.id);
    return (
      <div ref="shopCompContainer">
          <div style={{ width: 640, margin: '0 auto' }}>
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
              onCheck={this.onCheck.bind(this)}
              checked={checkedShopIds}
              onChange={this.onChange.bind(this)}
              onExpand={this.onExpand.bind(this)}
              />
          </div>
      </div>
    );
  }
}

export default Form.create()(ShopTree);
