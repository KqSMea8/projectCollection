import React, { Component, PropTypes } from 'react';
import { Modal } from 'antd';
import { nest } from '../../../common/dataGeneraterUtil';

class ShopListModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
    isCityShop: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, this.props);

    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    this.state.modalTop = modalTop;
  }

  state = {
    visible: false,
    onCancel: () => {
      this.setState({ visible: false });
    },
  }

  componentWillReceiveProps(newProps) {
    const { data, visible } = newProps;
    this.setState({ data: data, visible: visible });
  }

  render() {
    let allShops = [];
    const { title, visible, onCancel, data, modalTop, isCityShop } = this.state;
    if (isCityShop) {
      for (let idx1 = 0; idx1 < data.length; ++idx1) {
        const city = data[idx1];
        for (let idx2 = 0; idx2 < city.shops.length; ++idx2) {
          const shop = city.shops[idx2];
          allShops.push(shop);
        }
      }
    } else {
      allShops = allShops.concat(data);
    }

    const shops = nest(allShops, 'recruitConfirmStatus.cityName');
    const _shops = [];
    const shopsOwnProps = Object.getOwnPropertyNames(shops);
    for (let idx = 0; idx < shopsOwnProps.length; ++idx) {
      const status = shopsOwnProps[idx];
      const obj = {};
      if (status === 'PASS') {
        obj.title = '【已确认】';
      } else {
        obj.title = '【未确认】';
      }
      obj.city = [];
      const cityProps = Object.getOwnPropertyNames(shops[status]);
      for (let idx2 = 0; idx2 < cityProps.length; ++idx2) {
        const city = cityProps[idx2];
        obj.city.push({ name: city, shops: shops[status][city] });
      }
      _shops.push(obj);
    }

    return (
      <Modal title={title}
        style={{ top: modalTop }}
        visible={visible}
        onCancel={onCancel}
        footer={[]}>
        <div className="check-shop-list" style={{border: 'none'}}>
          {
            _shops.map((d, i) => {
              return (
                <div key={i}>
                  <h4 key={i}>{d.title}</h4>
                  {
                    d.city.map((_d, _i) => {
                      return (
                        <dl key={_i}>
                          <dt key={_i} style={{fontSize: 14}}>{_d.name}</dt>
                          <dd key={`_i${name}`} style={{ fontSize: 12, color: '#666', paddingTop: 0 }}>
                          {
                            _d.shops.map((__d) => {
                              return __d.name;
                            }).join('、')
                          }
                          </dd>
                        </dl>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>
      </Modal>
    );
  }
}

export default ShopListModal;
