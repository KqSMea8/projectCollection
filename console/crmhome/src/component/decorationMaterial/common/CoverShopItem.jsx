import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import CoverShopModal from './CoverShopModal';
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
    fileGroupId: PropTypes.string,
    url: PropTypes.string,
    subUrl: PropTypes.string,
    dealData: PropTypes.func,
    afterLoad: PropTypes.func,
    onFirstShopChange: PropTypes.func,
    relatedShops: PropTypes.string,
    relatedShopsCount: PropTypes.string,
  },

  getInitialState() {
    this.merchantId = getMerchantId();
    const {relatedShops, relatedShopsCount} = this.props;
    return {
      showLoading: false,
      loading: true,
      hasAvailableShops: true,
      showShopModal: false,
      shopData: null,
      rightData: [],
      shops: [],
      disabledShops: [],
      relatedShops,
      relatedShopsCount,
    };
  },

  componentDidMount() {
    const {fileGroupId, url} = this.props;
    const params = {op_merchant_id: this.merchantId};
    if (fileGroupId) params.fileGroupId = fileGroupId;
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
      const {showLoading} = this.state;
      const { shopCountGroupByCityVO = [], selectedCityShopsByAlbumId = [], selectedCityShopsByPid = [] } = typeof dealData === 'function' ? dealData(result) : result;

      const shopIds = loop(Object.keys(selectedCityShopsByAlbumId).map(item => selectedCityShopsByAlbumId[item])).reduce((memo, next) => {
        return memo.concat(next.shops.map(item => item.shopId));
      }, []);

      const disabledShopIds = loop(Object.keys(selectedCityShopsByPid).map(item => selectedCityShopsByPid[item])).reduce((memo, next) => {
        return memo.concat(next.shops.map(item => item.shopId));
      }, []).filter(id => shopIds.indexOf(id) === -1);

      if (typeof this.props.afterLoad === 'function' && !!shopCountGroupByCityVO.length) {
        this.props.afterLoad(selectedCityShopsByAlbumId, shopIds);
      }
      this.setState({
        showLoading: false,
        loading: false,
        hasAvailableShops: !!shopCountGroupByCityVO.length,
        shopData: loop(shopCountGroupByCityVO, true),
        shops: shopIds,
        disabledShops: disabledShopIds,
        rightData: loop(selectedCityShopsByPid, true),
      });
      if (showLoading) this.showShopModal();
    });
  },

  componentWillUnmount() {
    shopAjax = null;
  },

  onChange(shops, nodes) {
    this.setState({
      shops,
      showShopModal: false,
    });
    this.props.onChange(shops);
    if (nodes) this.onFirstShopChange(nodes);
  },

  onFirstShopChange(nodes) {
    const node = nodes[0];
    this.setState({
      relatedShops: node.shopName,
      relatedShopsCount: nodes.length,
    });
    this.props.onFirstShopChange(node);
  },

  showShopModal() {
    const {loading} = this.state;
    if (loading) {
      this.setState({showLoading: true});
    } else {
      this.setState({
        showShopModal: true,
      });
    }
  },

  closeShopModal() {
    this.setState({
      showShopModal: false,
    });
  },

  render() {
    const {showLoading, loading, hasAvailableShops, shops, disabledShops, showShopModal, shopData, rightData, relatedShops, relatedShopsCount} = this.state;

    let content;
    if (showLoading && loading) {
      content = <Spin />;
    } else {
      if (hasAvailableShops) {
        content = relatedShops
          ? <div className="item-wrap-break-word">
              {relatedShopsCount > 1 ? relatedShops + '等' + relatedShopsCount + '家门店' : relatedShops}
              <a className="modify" onClick={this.showShopModal}>修改</a>
            </div>
          : <a onClick={this.showShopModal}>选择门店</a>;
      } else {
        content = <p style={{color: '#f50'}}>没有可以选择的门店</p>;
      }
    }
    return (<div>
      {content}
      {shopData ? <CoverShopModal max={500} subUrl={this.props.subUrl} onOk={this.onChange} checked={shops} disabled={disabledShops} visible={showShopModal} onCancel={this.closeShopModal} leftData={shopData} rightData={rightData}/> : null}
    </div>);
  },
});

export default ShopItem;
