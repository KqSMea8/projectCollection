import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import {getMerchantId} from './utils';
import {Spin, Tree, Modal} from 'antd';

const TreeNode = Tree.TreeNode;

const loop = (data)=> {
  if (data && data.length) {
    return data.map((item)=> {
      const {cityCode, shopId, shopName, cityName, shopCount, shops} = item;
      return (<TreeNode title={shopName || `${cityName} (${shopCount})`} key={shopId || cityCode} isLeaf={!!shopId}>
        {shops ? loop(shops) : null}
      </TreeNode>);
    });
  }
  return null;
};

const loopKeys = (data) => {
  return data.reduce((memo, next) => {
    const {cityCode, shopId, shops} = next;
    if (shops && shops.length) {
      return memo.concat([cityCode], loopKeys(shops));
    }
    return shopId ? [shopId] : [];
  }, []);
};

const ShopItem = React.createClass({
  propTypes: {
    menuId: PropTypes.string,
  },

  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      loading: true,
      showShopModal: false,
      shops: [],
    };
  },

  componentDidMount() {
    const {menuId} = this.props;
    const params = {op_merchant_id: this.merchantId, menuId};
    if (menuId) params.menuId = menuId;
    if (this.merchantId) params.merchantId = this.merchantId;
    ajax({
      url: '/shop/kbmenu/detailShopQuery.json',
      method: 'get',
      data: params,
      success: (res) => {
        if (res.menuShopVO) {
          this.setState({
            shops: res.menuShopVO,
            loading: false,
          });
        }
      },
    });
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
    const {loading, shops, showShopModal} = this.state;
    if (loading) {
      return <Spin />;
    }

    return (<div>
      {shops.length ? <div className="item-wrap-break-word">
        {shops.reduce((memo, item) => { return memo + Number(item.shopCount);}, 0)}家门店
        <a className="modify" onClick={this.showShopModal} style={{paddingLeft: 10}}>查看</a>
      </div> : <a>没有选择相应门店</a>}
      <Modal visible={showShopModal} onCancel={this.closeShopModal} footer={null} >
        <div className="decoration-tree">
          {shops && shops.length ? <Tree autoExpandParent defaultExpandedKeys={loopKeys(shops)}>
            {loop(shops)}
          </Tree> : null}
        </div>
      </Modal>
    </div>);
  },
});

export default ShopItem;
