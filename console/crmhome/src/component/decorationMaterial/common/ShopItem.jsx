import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import ShopModal from './ShopModal';
import {getMerchantId} from './utils';
import {Spin} from 'antd';

let shopAjax;
const loop = (data, findChild)=> {
  if (data && data.length) {
    data.forEach((item)=> {
      const {cityCode, shopId, shopName, cityName, shopCount, shops} = item;
      item.id = shopId || cityCode;
      item.name = shopName || cityName;
      item.count = item.leafCount = shopCount || 0;

      if (findChild) {
        item.children = shops;
        if (shops) {
          loop(shops);
        }
      }
    });
  }
  return data;
};

const ShopItem = React.createClass({
  propTypes: {
    checked: PropTypes.array,
    menuId: PropTypes.string,
    envId: PropTypes.string,
    url: PropTypes.string,
    dealData: PropTypes.func,
    afterLoad: PropTypes.func,
  },

  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      loading: true,
      hasAvailableShops: true,
      showShopModal: false,
      shopData: null,
      rightData: [],
      shops: [],
    };
  },

  componentDidMount() {
    const {menuId, envId, url} = this.props;
    const params = {op_merchant_id: this.merchantId, menuId};
    if (menuId) params.menuId = menuId;
    if (envId) params.id = envId;
    if (this.merchantId) params.merchantId = this.merchantId;
    if (!shopAjax) {
      shopAjax = ajax({
        url: url,
        method: 'get',
        data: params,
      });
    }
    shopAjax.then((result) => {
      const {dealData} = this.props;
      const { shopCountGroupByCityVO = [], selectedCityShops = [] } = typeof dealData === 'function' ? dealData(result) : result;

      const shopIds = loop(Object.keys(selectedCityShops).map(item => selectedCityShops[item])).reduce((memo, next) => {
        return memo.concat(next.shops.map(item => item.shopId));
      }, []);

      if (typeof this.props.afterLoad === 'function' && !!shopCountGroupByCityVO.length) {
        this.props.afterLoad(selectedCityShops, shopIds);
      }
      this.setState({
        loading: false,
        hasAvailableShops: !!shopCountGroupByCityVO.length,
        shopData: loop(shopCountGroupByCityVO, true),
        shops: shopIds,
        rightData: loop(selectedCityShops, true),
      });
    });
  },

  componentWillUnmount() {
    shopAjax = null;
  },

  onChange(shops) {
    this.setState({
      shops,
      showShopModal: false,
    });
    this.props.onChange(shops);
  },

  showShopModal() {
    this.setState({
      showShopModal: true,
    });
  },

  closeShopModal() {
    this.setState({
      showShopModal: false,
    });
  },

  render() {
    const {loading, hasAvailableShops, shops, showShopModal, shopData, rightData} = this.state;

    let content;
    if (loading) {
      content = <Spin />;
    } else {
      if (hasAvailableShops) {
        content = shops.length
          ? <div className="item-wrap-break-word">
              {shops.length}家门店
              <a className="modify" onClick={this.showShopModal}>修改</a>
            </div>
          : <a onClick={this.showShopModal}>选择门店</a>;
      } else {
        content = <p style={{color: '#f50'}}>没有可以选择的门店</p>;
      }
    }
    return (<div>
      {content}
      {shopData ? <ShopModal max={500} subUrl={this.props.subUrl} onOk={this.onChange} checked={shops} visible={showShopModal} onCancel={this.closeShopModal} leftData={shopData} rightData={rightData}/> : null}
    </div>);
  },
});

export default ShopItem;
