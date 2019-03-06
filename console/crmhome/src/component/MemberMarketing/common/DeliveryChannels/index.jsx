import React, {PropTypes} from 'react';
import { Modal, Row, Col} from 'antd';
import {retailersDeliveryChannels} from '../../config/AllStatus';


const DeliveryChannelView = React.createClass({
  propTypes: {
    discountForm: PropTypes.object,
  },
  getInitialState() {
    return {
      showPreviewModal: false,
    };
  },
  closePreview() {
    this.setState({
      showPreviewModal: false,
    });
  },
  showPreview(event) {
    event.preventDefault();
    this.setState({
      showPreviewModal: true,
    });
  },
  render() {
    const { discountForm } = this.props;

    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    let showChannelsPreview = false;
    let showChannels = false;
    discountForm.deliveryChannels.map((item) => {
      showChannels = true;
      if (item === 'SPECIAL_LIST') {
        showChannelsPreview = true;
      }
    });
    return showChannels === true ?
      (<div>
        <p className="sub-title">投放渠道</p>
        <table className="kb-detail-table-6">
          <tbody>
          <tr>
            <td className="kb-detail-table-label">投放渠道</td>
            <td style={{width: 'auto'}}>
              {
                discountForm.deliveryChannels.map((item, i) => {
                  if (retailersDeliveryChannels[item]) {
                    return (
                      <span key={i}>{retailersDeliveryChannels[item].label} &nbsp; {item === 'BIG_BRAND_BUY' && discountForm.dayAvailableNum ? '每日快抢优惠券数量' + discountForm.dayAvailableNum + '张' : null}
                        {retailersDeliveryChannels[item] && i !== discountForm.deliveryChannels.length - 1 ? ', ' : null}
                      </span>
                    );
                  }
                })
              }
              {
                discountForm.deliveryChannels.length > 0 && showChannelsPreview === true ?
                <div style={{display: 'inline-block', marginLeft: 10}}>
                  <a href="#" onClick={this.showPreview}>预览</a>
                  <Modal ref="modal"
                         style={{top: modalTop}}
                         visible={this.state.showPreviewModal}
                         onCancel={this.closePreview}
                         title="投放渠道预览"
                         width="800"
                         footer={[]}>
                    <Row type="flex" justify="space-around">
                      {
                        discountForm.deliveryChannels.map((item, index) => {
                          if (retailersDeliveryChannels[item].img !== '') {
                            return (
                              <Col key={index} span={item === 'BIG_BRAND_BUY' || item === 'SHOP_DETAIL' ? '8' : '7'}>
                                {
                                  item === 'BIG_BRAND_BUY' || item === 'SHOP_DETAIL' ?
                                  <div style={{textAlign: 'center', padding: '10px 0 25px', fontSize: 15}}>{retailersDeliveryChannels[item].label}</div> :
                                  retailersDeliveryChannels[item].label
                                }
                                <img width="100%" src={retailersDeliveryChannels[item].img}/>
                                {
                                  item === 'SHOP_DETAIL' ?
                                  <div style={{textAlign: 'center', marginTop: 10}}>店铺详情页露出<br/>可丰富店铺内容，线上线下结合引流<br/>不需要审核活动参与资格</div> :
                                  <div style={{textAlign: 'center', marginTop: 10}}>口碑大牌快抢频道<br/>集中大品牌的活动渠道，利用线上流量优势推荐<br/>需要审核活动参与资格</div>
                                }
                              </Col>
                            );
                          }
                        })
                      }
                    </Row>
                  </Modal>
                </div> : null
                }
            </td>
            {
              discountForm.deliveryChannelSlogan ? [
                (<td key="reason" className="kb-detail-table-label">专属优惠推荐理由</td>),
                (<td key="slogan" >{discountForm.deliveryChannelSlogan}</td>)
              ] : null
            }
            {
              discountForm.deliveryChannelImgUrl ? [
                (<td key="label" className="kb-detail-table-label">专属优惠图片</td>),
                (<td key="img"><img src={discountForm.deliveryChannelImgUrl}/></td>)
              ] : null
            }
          </tr>
          {discountForm.deliveryResult.PASSWORD ?
          <tr>
            <td className="kb-detail-table-label">券口令</td>
            <td>{discountForm.deliveryResult.PASSWORD}</td>
            <td className="kb-detail-table-label">口令背景图</td>
            <td><img src={discountForm.deliveryResult.BACKGROUND_LOGO_URL}/></td>
          </tr> : null}
          </tbody>
        </table>
      </div>) : <div></div>;
  },
})
;

export default DeliveryChannelView;
