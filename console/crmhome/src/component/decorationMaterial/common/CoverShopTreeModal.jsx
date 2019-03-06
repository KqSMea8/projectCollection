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

const CoverShopTreeModal = React.createClass({
  propTypes: {
    onCancel: PropTypes.func,
    fileGroupId: PropTypes.string,
  },

  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      loading: true,
      shops: [],
    };
  },

  componentDidMount() {
    const {fileGroupId} = this.props;
    const params = {op_merchant_id: this.merchantId};
    if (fileGroupId) params.fileGroupId = fileGroupId;
    if (this.merchantId) params.merchantId = this.merchantId;
    ajax({
      url: '/shop/shopsurface/selectedShops.json',
      method: 'get',
      data: params,
      success: (res) => {
        if (res.selectedCityShopsByAlbumId) {
          this.setState({
            shops: res.selectedCityShopsByAlbumId,
            loading: false,
          });
        }
      },
    });
  },

  render() {
    const {loading, shops} = this.state;
    return (<div>
      <Modal visible onCancel={this.props.onCancel} footer={null} >
        {loading ? <Spin /> : <div className="decoration-tree">
          {shops && shops.length ? <Tree autoExpandParent defaultExpandedKeys={loopKeys(shops)}>
            {loop(shops)}
          </Tree> : null}
        </div>}
      </Modal>
    </div>);
  },
});

export default CoverShopTreeModal;
