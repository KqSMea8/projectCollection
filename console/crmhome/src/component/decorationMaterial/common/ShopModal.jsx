import React, {PropTypes} from 'react';
import {Modal} from 'antd';
import ajax from '../../../common/ajax';
import {getMerchantId} from './utils';
import Tree from 'hermes-treeselect/asynctree.jsx';

const loop = (data)=> {
  if (data && data.length) {
    data.forEach((item)=> {
      const {shopId, shopName} = item;
      item.id = shopId;
      item.name = shopName;
    });
  }
  return data;
};

const ShopModal = React.createClass({
  propTypes: {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    menuId: PropTypes.string,
    leftData: PropTypes.array,
  },

  getInitialState() {
    const {checked = []} = this.props;
    this.merchantId = getMerchantId();
    this.checked = checked;
    return {
      searchValue: '',
      cityData: [],
    };
  },

  onChange(checked) {
    // const {leftData} = this.props;
    this.checked = checked.filter(item => item);
  },

  onOk() {
    this.props.onOk(this.checked);
  },

  fetch(id) {
    if (id !== '#') {
      return ajax({
        url: this.props.subUrl,
        data: {
          cityCode: id,
          op_merchant_id: this.merchantId,
        },
      }).then((data) => {
        return loop(data.shopComps);
      });
    }
  },

  disPlayNode(item, isRight) {
    return <span>{item.name} {!isRight && item.count ? `(${item.count})` : ''}</span>;
  },

  render() {
    const {searchValue} = this.state;
    const {onCancel, checked} = this.props;
    return (
      <Modal className="decoration-shop-modal" visible={this.props.visible} onOk={this.onOk} onCancel={onCancel} title="选择门店" width="700px">
          <Tree {...this.props}
            search={this.seachValue}
            onChange={this.onChange}
            onExpand={() => {}}
            onCheck={() => {}}
            nodeText = {this.disPlayNode}
            fetch={this.fetch}
            checked={checked}
            searchValue={searchValue}/>
      </Modal>
    );
  },
});

export default ShopModal;
