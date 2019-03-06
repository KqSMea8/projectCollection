import React, {PropTypes} from 'react';
import {Modal, Tree} from 'antd';
import ajax from 'Utility/ajax';

const TreeNode = Tree.TreeNode;

const ShopsModal = React.createClass({
  propTypes: {
    unConfirmedMerchants: PropTypes.array,
    confirmedMerchants: PropTypes.array,
    showModal: PropTypes.bool,
    onCancel: PropTypes.func,
    pid: PropTypes.string,
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
        url: window.APP.crmhomeUrl + '/promo/koubei/queryConfirmShopsForSale.json',
        method: 'get',
        data: {
          orderId: orderId,
          merchantId: cardNo,
          pid: this.props.pid,
        },
        type: 'json',
        success: (res) => {
          resolve();

          if (res.status === 'success') {
            const { merchants } = this.state;
            const provinceShop = this.reformCityShops(res.cityShops);
            merchants[key].provinceShop = provinceShop;
            this.setState({
              merchants,
            });
          }
        },
      });
    });
  },
  reformCityShops(cityShops) {
    const province = [];
    let provinceArry = [];
    // 数据初始化
    cityShops.map((city) => {
      province.push({provinceName: city.shops[0].provinceName, provinceCode: city.shops[0].provinceCode, cityShops: [city]});
      provinceArry.push({provinceName: city.shops[0].provinceName, provinceCode: city.shops[0].provinceCode});
    });

    // provinceName/provinceCode省份去重
    const unique = {};
    provinceArry.forEach((a) => { unique[ JSON.stringify(a) ] = 1; });
    provinceArry = Object.keys(unique).map((u) => {return JSON.parse(u); });

    // 省份相同的cityShops数据合并
    provinceArry.map((t, index) => {
      const list = t;
      const i = index;
      province.map((p) => {
        if ( p.provinceName === list.provinceName) {
          if (provinceArry[i].cityShops && provinceArry[i].cityShops.length > 0 ) {
            provinceArry[i].cityShops.push(...p.cityShops);
          } else {
            provinceArry[i].cityShops = p.cityShops;
          }
        }
      });
    });

    return provinceArry;
  },
  /*eslint-disable */
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
                const merchanttilte = item.name + '(' + item.cardNo + ')';
                return (
                    <p key={i} className="shop-item">{merchanttilte}</p>
                );
              })
            }
            <h4 style={{fontSize: 16, marginTop: 10}}>已确认</h4>
            {
              confirmedMerchants.map((item, index) => {
                const merchanttilte = item.name + '(' + item.cardNo + ')';
                return (
                    <Tree loadData={this.onLoadData}>
                      <TreeNode title={merchanttilte} key={index}>
                        {
                          item.provinceShop && item.provinceShop.map((province) => {
                            return (<TreeNode title={province.provinceName} key={province.provinceCode}>
                              {
                                province.cityShops && province.cityShops.map((city) => {
                                  return (<TreeNode title={city.cityName} key={city.cityCode}>
                                    {
                                      city.shops && city.shops.map((shop) => {
                                        const shoptilte = shop.name + '(' + shop.id + ')';
                                        return <TreeNode title={shoptilte} key={shop.id} isLeaf />;
                                      })
                                    }
                                  </TreeNode>);
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
