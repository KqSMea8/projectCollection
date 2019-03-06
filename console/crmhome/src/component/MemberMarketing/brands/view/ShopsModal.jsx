import React, {PropTypes} from 'react';
import {Modal, Tree} from 'antd';
import ajax from '../../../../common/ajax';

const TreeNode = Tree.TreeNode;

const ShopsModal = React.createClass({
  propTypes: {
    unConfirmedMerchants: PropTypes.array,
    confirmedMerchants: PropTypes.array,
    showModal: PropTypes.bool,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    return {
      merchants: this.props.confirmedMerchants,
    };
  },

  onLoadData(treeNode) {
    return new Promise((resolve) => {
      const key = treeNode.props.eventKey;

      const {cardNo, orderId} = this.props.confirmedMerchants[key];

      ajax({
        url: 'promo/brand/queryConfirmShops.json',
        method: 'get',
        data: {
          orderId: orderId,
          merchantId: cardNo,
        },
        type: 'json',
        success: (res) => {
          resolve();

          if (res.status === 'success') {
            const { merchants } = this.state;
            merchants[key].cityShops = res.cityShops;
            this.setState({
              merchants,
            });
          }
        },
      });
    });
  },

  render() {
    const {unConfirmedMerchants, confirmedMerchants, showModal, onCancel} = this.props;

    return (
      <Modal title={'商家列表'}
             visible={showModal}
             onCancel={onCancel}
             footer={[]}>
        <div className="check-shop-list">
          <h4 style={{fontSize: 16}}>未确认</h4>
          {
            unConfirmedMerchants.map((item, i) => {
              return (
                <p key={i} className="shop-item">{item && item.name}</p>
              );
            })
          }
          <h4 style={{fontSize: 16, marginTop: 10}}>已确认</h4>
            {
              confirmedMerchants.map((item, index) => {
                return (
                  <Tree loadData={this.onLoadData} key={index}>
                    <TreeNode title={item.name} key={index}>
                      {
                        item.cityShops && item.cityShops.map((city) => {
                          return (<TreeNode title={city.cityName} key={city.cityCode}>
                            {
                              city.shops && city.shops.map((shop) => {
                                return <TreeNode title={shop.name} key={shop.id} isLeaf />;
                              })
                            }
                          </TreeNode>);
                        })
                      }
                    </TreeNode>
                  </Tree>
                );
              })
            }

        </div>
      </Modal>
    );
  },
});

export default ShopsModal;
