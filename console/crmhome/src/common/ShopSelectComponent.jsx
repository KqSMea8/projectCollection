import React, {PropTypes} from 'react';
import { Modal } from 'antd';
import lodash from 'lodash';
import Tree from '@alipay/hermes-asynctree';
import '@alipay/hermes-asynctree/tree.css';
import ajax from './ajax';

let isModalVisible = false;

const ShopSelectComponent = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.array,
    readonly: PropTypes.bool,
    shopUrl: PropTypes.string,
    isEdit: PropTypes.bool,
  },
  getInitialState() {
    const that = this;
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const merchantId = merchantIdInput ? merchantIdInput.value : '';
    const shopAsyncTree = new Tree({
      controls: false,
      ajax: (option) => {
        const p = ajax(option);
        p.done = p.then;
        return p;
      },
      ajaxOpts(node) {
        if (node.id === '#') {
          return {
            url: '/goods/itempromo/getShops.json',
            data: {
              op_merchant_id: merchantId,
            },
          };
        }
        return {
          url: that.props.shopUrl || '/goods/itempromo/getShopsByCityForNewCamp.json',
          data: {
            cityCode: node.id,
            op_merchant_id: merchantId,
          },
        };
      },
      parse(res, node) {
        let parseResult;
        if (node.id === '#') {
          if (that.props.value) {
            const array = that.transformInitValue(that.props.value);
            this.initChecked(array);
          }
          parseResult = res.shopCountGroupByCityVO;
        } else {
          parseResult = res.shopComps;
        }
        return parseResult;
      },
      transformOpts: [
        {id: 'cityCode', text: 'cityName', count: 'shopCount', children: 'shopComps'},
        {id: 'shopId', text: 'shopName'},
      ],
      onChange(node) {
        if (this.model.level(node.id) === 1) {
          if (this.model.fetch(node.id) !== undefined) {
            this.model.fetch(node.id).then(() => {
              that.setState({
                selectedShopList: this.model.checked('LAST').concat(that.initShopList),
              });
              this.renderRight('#');
              return;
            });
          }
        }
        that.setState({
          selectedShopList: this.model.checked('LAST').concat(that.initShopList),
        });
      },
    });
    this.initShopList = that.transformInitValueForAppend(this.props.value);
    return ({
      asyncTree: shopAsyncTree.$xBox.render(),
      showModal: false,
      isModalVisible: false,
      selectedShopList: this.initShopList || [],
    });
  },
  componentDidUpdate() {
    if (isModalVisible) {
      const treeContainer = this.state.asyncTree.element[0].querySelector('.J-tree-container');
      if (treeContainer) {
        this.data.appendChild(treeContainer);
      }
      this.data.querySelector('.J-tree-container').style.width = '616px';
      this.data.querySelector('.J-tree-footer').style.display = 'none';
      this.data.querySelector('.J-tree-header').style.display = 'none';
      isModalVisible = false;
    }
  },
  onOk() {
    const selectedShopList = this.state.selectedShopList;
    this.props.onChange(selectedShopList);
    this.setState({showModal: false, selectedShopList: selectedShopList});
  },
  onCancel() {
    this.setState({showModal: false});
  },
  transformInitValueForAppend(value) {
    if (!value) {
      return [];
    }
    const newValue = lodash.cloneDeep(value);
    const shopIdList = [];
    newValue.forEach((row) => {
      const shops = row.shops || [];
      shops.forEach((r) => {
        shopIdList.push({id: r.id, shopId: r.id});
      });
    });
    return shopIdList;
  },
  transformInitValue(value) {
    const newValue = lodash.cloneDeep(value);
    const cityCodeArray = [];
    newValue.forEach((row) => {
      if (cityCodeArray.indexOf(row.cityCode) === -1) {
        cityCodeArray.push(row.cityCode);
      }
    });
    const cityArray = [];
    cityCodeArray.forEach((cityCode) => {
      const cityObj = {};
      cityObj.cityCode = cityCode;
      const shopArray = [];
      newValue.forEach((row) => {
        if (row.cityCode === cityCode) {
          shopArray.push({
            shopId: row.shopId,
            shopName: row.shopName,
          });
        }
      });
      cityObj.shopComps = shopArray;
      cityObj.shopCount = Number.POSITIVE_INFINITY;
      cityArray.push(cityObj);
    });
    return cityArray;
  },
  showModal() {
    isModalVisible = true;
    this.setState({showModal: true});
  },
  render() {
    const {isEdit} = this.props;
    const shopNum = this.state.selectedShopList.length;
    if (this.props.readonly) {
      return <div>已选择{shopNum}家门店</div>;
    }
    return (<div>
      {shopNum > 0 ? <span>已选择{shopNum}家门店<a style={{marginLeft: '16px'}} onClick={this.showModal}>{isEdit ? '新增' : '查看'}</a></span> : <a onClick={this.showModal}>选择门店</a>}
      <Modal width={650} zIndex={1000} title="选择门店" visible={this.state.showModal} onOk={this.onOk} onCancel={this.onCancel}>
        <div ref = {node => this.data = node} />
      </Modal>
    </div>);
  },
});

export default ShopSelectComponent;
