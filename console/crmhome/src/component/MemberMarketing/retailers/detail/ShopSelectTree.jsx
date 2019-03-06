/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import ajax from '../../../../common/ajax';
import { getUriParam } from '../../../../common/utils';
import Tree from 'hermes-treeselect/asynctree.jsx';
import { noop, forEach, groupBy } from 'lodash';

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

function findNode(root, targetId) {
  if (root.id === targetId) {
    return root;
  }
  if (root.children && root.children.length > 0) {
    for (let i = 0; i < root.children.length; i += 1) {
      const found = findNode(root.children[i], targetId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function checkLeaves(root, checkedKeys) {
  if (!root) {
    return;
  }
  // 只操作叶子节点
  if (!root.children) {
    const foundAt = checkedKeys.indexOf(root.id);
    if (foundAt === -1) {
      checkedKeys.push(root.id);
    } else {
      checkedKeys.splice(foundAt, 1);
    }
  }
  if (root.children && root.children.length > 0) {
    root.children.forEach(child => checkLeaves(child, checkedKeys));
  }
}

class ShopSelectTree extends Component {
  static propTypes = {
    shopUrl: PropTypes.string,
    cityUrl: PropTypes.string,
    checked: PropTypes.array,
    disabled: PropTypes.array,
    onCheck: PropTypes.func,
    onChange: PropTypes.func,
    onExpand: PropTypes.func,
  }
  // 使用新的过滤餐饮门店的接口 @平路
  static defaultProps = {
    shopUrl: '/goods/kbsmartplan/queryRestaurantShopsByCityCode.json',
    cityUrl: '/goods/kbsmartplan/queryAllRestaurantShop.json',
    onCheck: noop,
    onChange: noop,
    onExpand: noop,
  }
  constructor(props) {
    super(props);
    this.state = {
      leftData: [],
    };
    this.merchantId = getUriParam('op_merchant_id', location.search);
  }

  componentDidMount() {
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

  onCheck = (checkedKey) => {
    // 找到节点，并选中它的所有子孙节点
    // # 代表全选
    const root = { children: this.state.leftData };
    const checkedNode = checkedKey === '#' ? root : findNode(root, checkedKey);
    const checkedKeys = [...this.props.checked];
    checkLeaves(checkedNode, checkedKeys);
    this.props.onCheck(checkedKeys);
  }

  fetch = (id) => {
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
          // 在门店树上添加子节点
          const children = parseCityShops(res.shopComps);
          const root = { children: this.state.leftData };
          const node = findNode(root, id);
          node.children = children;
          this.setState({
            leftData: this.state.leftData,
          });
          resolve(children);
        },
      });
    });
  }

  render() {
    const { leftData } = this.state;
    const { checked, disabled } = this.props;
    return (
      <Tree
        fetch={this.fetch}
        onlyLeft
        leftData={leftData}
        disabled={disabled}
        checked={checked}
        onChange={this.props.onChange}
        onCheck={this.onCheck}
        onExpand={this.props.onExpand}
      />
    );
  }
}

export default ShopSelectTree;
