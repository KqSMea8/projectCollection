import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import {Button, Modal, Tree, message} from 'antd';

const TreeNode = Tree.TreeNode;

const InfoShopModal = React.createClass({
  propTypes: {
    mallId: PropTypes.string,
  },
  getInitialState() {
    return {
      visible: false,
      locatedShop: [],
      unlocatedShop: [],
      shopType: 'locatedShop',
      shopCount: '',
    };
  },
  componentDidMount() {
    this.getMallCategoryShop();
  },

  componentDidUpdate() {
    const updateKey = localStorage.getItem('update');
    if (updateKey === 'true') {
      this.getMallCategoryShop();
    }
  },

  getMallCategoryShop() {
    const self = this;
    const mallId = this.props.mallId;
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/mallCategoryShop/query&data=' + JSON.stringify({'mallId': mallId}),
      method: 'get',
      type: 'json',
      withCredentials: true,
      success: (res) => {
        if (res.success === true) {
          if (res.shopInfo) {
            self.setState({
              locatedShop: res.shopInfo.LOCATED_SHOP,
              unlocatedShop: res.shopInfo.UNLOCATED_SHOP,
              shopCount: res.shopCount,
            });
          }
        } else {
          if (res.errorMsg) {
            message.error(res.errorMsg || '系统繁忙，请稍候');
          }
        }
      },
      error: (res) => {
        if (res.errorMsg) {
          message.error(res.errorMsg || '系统繁忙，请稍候');
        }
      },
    });
    localStorage.setItem('update', 'false');
  },

  showModal(e) {
    this.setState({
      visible: true,
      shopType: e,
    });
  },

  handleOk() {
    this.setState({
      visible: false,
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  generateData(type) {
    const {locatedShop, unlocatedShop} = this.state;
    const loop = (type === 'locatedShop' ? locatedShop : unlocatedShop).map((item) => {
      if (item.shopList.length && item.shopList) {
        return (<TreeNode key={item.categoryId} title={item.categoryName} >{
          (item.shopList).map((eShop) => {
            return <TreeNode key={eShop.shopId} title={eShop.shopName} />;
          })
        }</TreeNode>);
      }
    });
    return loop;
  },

  dataSize(type) {
    const {locatedShop, unlocatedShop} = this.state;
    let size = 0;
    (type === 'locatedShop' ? locatedShop : unlocatedShop).map((item) => {
      if (item.shopList.length && item.shopList) {
        (item.shopList).map(() => {
          size++;
        });
      }
    });
    return size;
  },

  render() {
    const {shopType, shopCount} = this.state;
    return (<div>
         <div style={{position: 'absolute', right: '30px', top: 0}}>
          <Button type="ghost" onClick={this.showModal.bind(this, 'locatedShop')}>查看已定位门店</Button>
          <Button type="ghost" style={{marginLeft: '10px'}} onClick={this.showModal.bind(this, 'unlocatedShop')} >查看未定位门店</Button>
        </div>
        <Modal title={shopType === 'locatedShop' ? '已定位门店' : '未定位门店'}
          visible={this.state.visible}
          width={400}
          footer={null}
          onCancel={this.handleCancel}
          className="shopModal"
          >
            <div className="node-container">
              <div className="header">
                <span style={{verticalAlign: '16px'}}>
                  <span>{shopType === 'locatedShop' ? '所有已定位门店' : '所有未定位门店'}</span>
                  <span>({this.dataSize(shopType)})</span>
                  <span style={{float: 'right'}}>门店总数：{shopCount}</span>
                </span>
              </div>

              <div style={{overflow: 'auto', height: '363px'}}>
                <Tree
                  className="draggable-tree"
                  defaultExpandedKeys={this.state.expandedKeys}
                  draggable
                  onDragEnter={this.onDragEnter}
                  onDrop={this.onDrop}>
                  {this.generateData(shopType)}
                </Tree>
              </div>
            </div>
        </Modal>
      </div>);
  },
});

export default InfoShopModal;
