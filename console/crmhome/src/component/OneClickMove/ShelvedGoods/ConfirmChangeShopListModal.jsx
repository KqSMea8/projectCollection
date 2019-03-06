import React, {PropTypes} from 'react';
import {Modal, Tabs, message, Alert} from 'antd';
import ajax from '../../../common/ajax';
import { saveJumpTo } from '../../../common/utils';

const TabPane = Tabs.TabPane;
const disabledLabelStyle = {
  display: 'inline-block', borderRadius: '4px', padding: '3px 4px',
  color: '#fff', backgroundColor: 'orange', lineHeight: '12px',
  marginLeft: '5px',
};

function jumpToShop() {
  saveJumpTo('/shop.htm#/shop', '_blank');
}
class ConfirmChangeShopListModal extends React.Component {
  static propTypes = {
    shopListModal: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      originalShopList: [],
      changeShopList: [],
      visible: false,
    };
  }
  componentWillMount() {
    this.requestOriginalShops(this.props.itemId);
    this.requestChangeShops(this.props.confirmOrderId, this.props.viewStatus);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemId !== this.props.itemId) {
      this.requestOriginalShops(nextProps.itemId);
    }
    if (nextProps.confirmOrderId !== this.props.confirmOrderId || nextProps.viewStatus !== this.props.viewStatus) {
      this.requestChangeShops(nextProps.confirmOrderId, nextProps.viewStatus);
    }
  }

  requestOriginalShops(itemId) {
    if (!itemId) {
      return;
    }
    this.setState({
      loading: true,
    });
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leads/queryItemOrigCityShops.json`,
      // url: 'http://pickpost.alipay.net/mock/kb-sale/item/leads/change/queryShopsByItemId.json',
      method: 'get',
      useIframeProxy: true,
      data: { itemId },
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            originalShopList: result.data,
            loading: false,
          });
        }
      },
      error: (result) => {
        this.setState({
          loading: false,
        });
        if (result.resultMsg) {
          message.error(result.resultMsg);
        }
      },
    });
  }

  requestChangeShops(confirmOrderId, viewStatus) {
    if (!viewStatus || viewStatus === 'COMPLETED') {
      this.setState({
        changeShopList: [],
      });
    } else {
      this.setState({
        loading: true,
      });
      ajax({
        url: `${window.APP.kbservindustryprodUrl}/item/leadschange/confirmorder/queryItemLeadsChangeCityShops.json`,
        // url: 'http://pickpost.alipay.net/mock/kb-sale/item/leads/change/queryShopsByItemId.json',
        method: 'get',
        useIframeProxy: true,
        data: { confirmOrderId },
        type: 'json',
        success: (result) => {
          if (result.status && result.status === 'succeed') {
            this.setState({
              changeShopList: result.data || [],
              loading: false,
            });
          }
        },
        error: (result) => {
          this.setState({
            loading: false,
          });
          if (result && result.resultMsg) {
            message.error(result.resultMsg);
          }
        },
      });
    }
  }

  render() {
    const { originalShopList, changeShopList } = this.state;
    const { viewStatus } = this.props;
    if (viewStatus === 'COMPLETED') {
      return (<Modal
        className="shelved-shop-list-modal"
        footer={null}
        title="门店列表"
        visible={this.props.shopListModal}
        onCancel={this.props.cancelShopListModal}>
        <div className="shelved-shop-list" style={{borderTop: '1px solid #ddd'}}>
          {
            originalShopList.map((item, key) => {
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
      </Modal>);
    }
    return (<Modal
    className="shelved-shop-list-modal"
    footer={null}
    title="门店列表"
    visible={this.props.shopListModal}
    onCancel={this.props.cancelShopListModal}>
    <Tabs type="card">
      <TabPane tab="本次新增门店" key="1">
        <div className="shelved-shop-list">
        <Alert message="Warning" type="warning" message="普通无证门店暂不支持参与活动。" showIcon />
        {
            changeShopList.map((item, key) => {
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
      </TabPane>
      <TabPane tab="原有适用门店" key="2">
        <div className="shelved-shop-list">
        <Alert message="Warning" type="warning" message="原适用门店中不包含本次新增门店。" showIcon />
        {
            originalShopList.map((item, key) => {
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
      </TabPane>
    </Tabs>
    <div style={{ paddingTop: '10px' }}>
      <span style={disabledLabelStyle}>
        无证
      </span>&nbsp;
      打标门店未上传证照信息，不符合活动参与要求，请先到“<a onClick={jumpToShop}>我的门店</a>”中上传证照
    </div>
  </Modal>);
  }
}

export default ConfirmChangeShopListModal;
