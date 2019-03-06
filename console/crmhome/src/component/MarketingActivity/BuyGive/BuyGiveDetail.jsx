import React, {PropTypes} from 'react';
import {message, Spin, Button, Modal, Icon} from 'antd';
import ajax from '../../../common/ajax';
import { customLocation, getValueFromQueryString } from '../../../common/utils';
import AADetail from './AADetail';
import ABDetail from './ABDetail';
import './BuyGive.less';

const BuyGiveDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      showShopListModal: false,
      discountForm: {},
      testLoading: true,
      showSKUCodeModal: false,
      loading: false, // 下架按钮
      modal: false,
    };
  },

  componentWillMount() {
    if (this.props.params.orderId) {
      this.fetch();
    }
  },

  fetch() {
    const { orderId } = this.props.params;
    // 如果是在kbsale看，接口不同
    const url = getValueFromQueryString('fromSource') === 'KB_SERVICE' ? `/goods/koubei/promotionNewCampDetail.json` :
      '/goods/itempromo/campaignDetail.json';

    ajax({
      url: url,
      method: 'get',
      type: 'json',
      data: {
        campId: orderId,
      },
      success: (res) => {
        if (res && res.result) {
          this.setState({
            testLoading: false,
            discountForm: res.discountForm,
          });
        } else {
          message.error(res && res.errorMsg ? res.errorMsg : '获取活动信息失败');
        }
      },
      error: (error) => {
        if (error && error.resultMsg) {
          message.warning(error.resultMsg);
        } else {
          message.warning('系统繁忙，请稍后重试。');
        }
      },
    });
  },

  hideShopList() {
    this.setState({ showShopListModal: false });
  },

  showShopList() {
    this.setState({ showShopListModal: true });
  },

  handleOffline() {
    const self = this;
    const url = window.APP.ownUrl + '/goods/itempromo/offlineCampaign.json?campId=' + self.props.params.orderId;
    self.setState({
      loading: true,
    });
    ajax({
      url: url,
      method: 'get',
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.result) {
          message.success('下架成功', 3);
          customLocation('/goods/itempromo/activityList.htm');
        } else {
          self.setState({loading: false, modal: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
      error: (result) => {
        self.setState({loading: false, modal: false});
        if (result && result.errorMsg) {
          message.error(result.errorMsg);
        } else {
          message.error('系统繁忙');
        }
      },
    });
  },

  confirmBtn(_key) {
    const self = this;
    console.log(_key);
    let confirmUrl = '';
    switch (_key) {
    case 'allowConfirm':
      confirmUrl = '/goods/itempromo/agreePromotion.json';
      break;
    case 'allowModifyConfirm':
      confirmUrl = '/goods/itempromo/agreePromoModify.json';
      break;
    case 'allowOfflineConfirm':
      confirmUrl = '/goods/itempromo/agreePromoOffline.json';
      break;
    default:
      break;
    }

    ajax({
      url: confirmUrl,
      method: 'post',
      data: {
        campId: this.props.params.orderId,
      },
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status === 'true') {
          message.success('确认成功', 3);
          customLocation('/goods/itempromo/activityList.htm');
        } else {
          self.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  rejectBtn(_key) {
    const self = this;
    let rejectUrl = '';
    switch (_key) {
    case 'allowReject':
      rejectUrl = '/goods/itempromo/rejectPromotion.json';
      break;
    case 'allowModifyReject':
      rejectUrl = '/goods/itempromo/rejectPromoModify.json';
      break;
    case 'allowOfflineReject':
      rejectUrl = '/goods/itempromo/rejectPromoOffline.json';
      break;
    default:
      break;
    }

    ajax({
      url: rejectUrl,
      method: 'post',
      data: {
        campId: this.props.params.orderId,
      },
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status === 'true') {
          message.success('拒绝成功', 3);
          customLocation('/goods/itempromo/activityList.htm');
        } else {
          self.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  render() {
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    const { loading, discountForm, testLoading } = this.state;

    return (
      <div>
        {
          (!testLoading && discountForm && discountForm.voucherVOs && discountForm.voucherVOs[0]) ?
            <div>
              {
                discountForm.voucherVOs[0].itemDiscountRule.itemSendType === 'BUY_A_SEND_A' &&
                <AADetail discountForm={discountForm} />
              }

              {
                discountForm.voucherVOs[0].itemDiscountRule.itemSendType === 'BUY_A_SEND_B' &&
                <ABDetail discountForm={discountForm} />
              }
            </div>
            :
            <div style={{margin: '30px 0 0 30px'}}>
              <Spin spinning={testLoading} />
            </div>
        }

        <div style={{paddingLeft: 150}}>
          {
            (discountForm && discountForm.allowOffline) &&
            <Button type="primary" loading={loading} style={{ marginRight: 10 }} onClick={() => {this.setState({modal: true});}}>下架</Button>
          }
          {
            discountForm.allowConfirm && (
              <div>
                <Button
                  style={{marginRight: '10px'}}
                  type="primary"
                  onClick={() => {
                    this.confirmBtn('allowConfirm');
                  }}
                >确认</Button>
                <Button
                  onClick={() => {
                    this.rejectBtn('allowReject');
                  }}
                >拒绝</Button>
              </div>
            )
          }
          {
            discountForm.allowModifyConfirm && (
              <div>
                <Button
                  style={{marginRight: '10px'}}
                  type="primary"
                  onClick={() => {
                    this.confirmBtn('allowModifyConfirm');
                  }}
                >确认</Button>
                <Button
                  onClick={() => {
                    this.rejectBtn('allowModifyReject');
                  }}
                >拒绝</Button>
              </div>
            )
          }
          {
            discountForm.allowOfflineConfirm && (
              <div>
                <Button
                  style={{marginRight: '10px'}}
                  type="primary"
                  onClick={() => {
                    this.confirmBtn('allowOfflineConfirm');
                  }}
                >确认</Button>
                <Button
                  onClick={() => {
                    this.rejectBtn('allowOfflineReject');
                  }}
                >拒绝</Button>
              </div>
            )
          }
        </div>
        <Modal
          style={{top: modalTop}}
          visible={this.state.modal}
          title="提示"
          onCancel={() => {this.setState({modal: false});}}
          footer={[
            <Button key="back" type="ghost" size="large" onClick={() => {this.setState({modal: false});}}>取消</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.handleOffline}>确定</Button>,
          ]}
        >
          <div style={{padding: '10px 20px', fontSize: 14}}>
            <div style={{float: 'left', marginRight: 10, marginTop: 10}}>
              <Icon type="info-circle" style={{color: '#fa0', fontSize: 24}} />
            </div>
            <p>下架后活动将立即结束，已发出的券在有效期内依然可以使用，是否继续？</p>
          </div>
        </Modal>
      </div>
    );
  },
});

export default BuyGiveDetail;
