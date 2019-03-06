import React, {PropTypes} from 'react';
import {Modal, message} from 'antd';
import ajax from '../../../common/ajax';
import { saveJumpTo } from '../../../common/utils';

const disabledLabelStyle = {
  display: 'inline-block', borderRadius: '4px', padding: '3px 4px',
  color: '#fff', backgroundColor: 'orange', lineHeight: '12px',
  marginLeft: '5px',
};

function jumpToShop() {
  saveJumpTo(window.APP.kbservcenterUrl + '/sale/index.htm#/shop', '_blank');
}
class ShopListModal extends React.Component {
  propTypes = {
    visible: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      shopList: [],
    };
  }

  componentWillMount() {
    this.fetch();
  }

  fetch() {
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leads/queryItemOrigCityShops.json`,
      method: 'get',
      useIframeProxy: true,
      data: { itemId: this.props.itemId },
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            shopList: result.data,
          });
        }
      },
      error: (result) => {
        if (result && result.resultMsg) {
          message.error(result.resultMsg);
        }
      },
    });
  }

  render() {
    const { shopList } = this.state;
    return (
      <Modal footer={null}
        title="门店列表"
        visible={this.props.visible}
        onCancel={this.props.cancelShopListModal}>
        <div className="check-shop-list">
        {
          shopList.map((item, key) => {
            return (
              <dl key={`city${key}`}>
                <dt>{item.cityName}</dt>
                {
                  item.shops.map((shop, i) => {
                    let noLicense = null;
                    if (shop.ext) {
                      if (shop.ext.shopLicenseUnpublished === '1') {
                        noLicense = <span style={disabledLabelStyle}>{shop.ext.shopCanNotPubItem === '1' ? '无证' : '无证(90天试用)'}</span>;
                      }
                    }
                    return (
                      <dd key={`shop${i}`}>{shop.shopName}{noLicense}</dd>
                    );
                  })
                }
              </dl>
            );
          })
        }
        </div>
        <div style={{ paddingTop: '10px' }}>
          <span style={disabledLabelStyle}>
            无证
          </span>&nbsp;
          打标门店未上传证照信息，不符合活动参与要求，请先到“<a onClick={jumpToShop}>我的门店</a>”中上传证照
        </div>
      </Modal>
    );
  }
}

export default ShopListModal;
