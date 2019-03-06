import React, {PropTypes} from 'react';
import {Breadcrumb, message, Modal, Row, Col, Button, Alert, Icon, Checkbox} from 'antd';
import {retailersDeliveryChannels} from '../../config/AllStatus';
import ajax from '../../../../common/ajax';
import {formatAvailableVoucherTime, formatForbiddenVoucherTime, customLocation, getUriParam} from '../../../../common/utils';
import { getCateringPriceChangeStatus } from '../../common/utils';

const AllActivityViewForChange = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      showPreviewModal: false,
      showShopListModal: false,
      detail: {}, // 优惠券数据
      crowdNum: {
        memberMerchantGroupCount: 0,
        memberMerchantGroupRatio: '0%',
      },
      changeInfo: {},
      checked: true,
      offlineOldActivityFailModalVisible: false,
      confirming: false,
      rejecting: false,
    };
  },

  componentWillMount() {
    if (this.props.params.campId) {
      this.fetch();
      // this.queryChangeInfo();
    }
  },

  onCancel() {
    this.setState({
      showShopListModal: false,
    });
  },

  onCheckBoxChange(e) {
    this.setState({
      checked: e.target.checked,
    });
  },

  fetch() {
    const url = window.APP.ownUrl + '/promo/merchant/detail.json';
    ajax({
      url: url,
      method: 'get',
      type: 'json',
      data: {
        campaignId: this.props.params.campId,
      },
      success: (res) => {
        if (res.status === 'success') {
          if (res.discountForm.crowdId) {
            this.fetchNum(res.discountForm.crowdId);
          }
          this.setState({
            detail: res,
          });
        } else {
          message.error(res.errorMsg || '获取券信息失败');
        }
      },
    });
  },

  fetchNum(crowdId) {
    ajax({
      url: '/promo/merchant/memberMerchantBatchSum.json',
      method: 'get',
      data: {
        crowdGroupId: crowdId,
        needStatistics: 1,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            crowdNum: res.data,
          });
        } else {
          message.error(res.errorMsg || '获取人数失败');
        }
      },
    });
  },

  /* 一键搬家异动不再使用
  queryChangeInfo() {
    ajax({
      url: `${window.APP.crmhomeUrl}/goods/catering/queryCaterChangeInfo.json?bizId=${this.props.params.campId}`,
      // url: 'http://pickpost.alipay.net/mock/kb-crmhome/goods/catering/queryCaterChangeInfo.json',
      method: 'GET',
      type: 'json',
      success: (result) => {
        if (result && result.status === 'succeed') {
          const { shopNumBefore, shopNumAfter, changePriceBefore, changePriceAfter, type } = result;
          this.setState({
            changeInfo: {
              shopNumBefore,
              shopNumAfter,
              changePriceBefore,
              changePriceAfter,
              type,
            },
          });
        } else {
          message.error(result.resultMsg || '获取商品异动信息信息失败', 3);
        }
      },
      error: (err) => {
        message.error(err.resultMsg || '网络异常', 3);
      },
    });
  },
  */

  showPreview(event) {
    event.preventDefault();
    this.setState({
      showPreviewModal: true,
    });
  },

  closePreview() {
    this.setState({
      showPreviewModal: false,
    });
  },

  showShopList() {
    this.setState({
      showShopListModal: true,
    });
  },

  confirmBtn() {
    if (this.state.checked) {
      this.queryActivityIsLabeled().then((isLabel) => {
        let content = <p>上架成功后，将名下同类券／活动将进行下架。</p>;
        if (isLabel) {
          content = (<div>
            <p>上架成功后，将名下同类券／活动将进行下架。</p>
            <p>同类券／活动已参与平台活动，下架后将无法享受平台补贴。请谨慎操作。</p>
          </div>);
        }
        Modal.confirm({
          title: '是否确认上架该活动？',
          content: content,
          onOk: () => this.handleActivityChange(true),
          okText: '确定',
          cancelText: '取消',
        });
      });
    } else {
      Modal.confirm({
        title: '是否确认上架该活动？',
        onOk: () => this.handleActivityChange(true),
        okText: '确定',
        cancelText: '取消',
      });
    }
  },

  queryActivityIsLabeled() {
    return new Promise((resolve) => {
      ajax({
        url: `${window.APP.crmhomeUrl}/goods/catering/labelForActivity.json`,
        // url: 'http://pickpost.alipay.net/mock/kb-crmhome/goods/catering/auditChangeMovehome.json',
        method: 'get',
        data: {
          activityId: this.props.params.campId,
        },
        type: 'json',
        success: (result) => {
          if (!result) {
            resolve(false);
          }
          if (result.status === 'succeed') {
            resolve(result.isLabel === '1');
          } else {
            resolve(false);
          }
        },
        error: () => {
          resolve(false);
        },
      });
    });
  },

  handleActivityChange(isConfirm) {
    this.setState({
      confirming: isConfirm,
      rejecting: !isConfirm,
    });
    ajax({
      url: `${window.APP.crmhomeUrl}/goods/catering/auditChangeMovehome.json`,
      // url: 'http://pickpost.alipay.net/mock/kb-crmhome/goods/catering/auditChangeMovehome.json',
      method: 'get',
      data: {
        activityId: this.props.params.campId,
        optType: isConfirm ? 'PASS' : 'RETURN',
        offlineOlder: isConfirm && this.state.checked ? '1' : '0',
      },
      type: 'json',
      success: (result) => {
        this.setState({
          confirming: false,
          rejecting: false,
        });
        if (!result) {
          return;
        }
        if (result.status === 'succeed') {
          message.success('操作成功', 3);
          customLocation('/goods/itempromo/activityList.htm');
        } else {
          message.error(result.resultMsg || '操作失败', 3);
        }
      },
      error: (error) => {
        this.setState({
          confirming: false,
          rejecting: false,
        });
        message.error(error.resultMsg || '网络异常', 3);
      },
    });
  },

  goToOldActivityDetail() {
    const oldId = getUriParam('oldId');
    window.location.hash = `#/marketing/retailers/all-activity-view/${oldId}`;
  },
  /* eslint-disable complexity */
  render() {
    /* eslint-disable complexity */
    const { discountForm, allowConfirm } = this.state.detail;
    const hasValid = discountForm && discountForm.activityType !== 'REAL_TIME_SEND';
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }
    if (discountForm) {
      const filteredChannels = (discountForm.deliveryChannels || []).filter((item) => retailersDeliveryChannels[item] &&
        retailersDeliveryChannels[item].img !== '' ||
        (item === 'QR_CODE' && discountForm.deliveryResult && discountForm.deliveryResult[item]) ||
        (item === 'SHORT_LINK' && discountForm.deliveryResult && discountForm.deliveryResult[item])
      ); // 投放渠道预览需要展示 img，所以在这里排除掉 img 没有的渠道。

      const PayChannelMap = {
        USE_NO_LIMIT: '不限制',
        USE_ON_CURRENT_PAY_CHANNEL: '限储值卡付款可享',
        NOT_ALLOWED_USE: '储值卡付款不可享',
      };
      const allowUseUserGroupObj = {
        0: '全部用户',
        3: '新客用户',
        2: '生日用户',
      };

      // 新增支付渠道限制字段
      let limitRule = '';
      if (discountForm.limitRule) {
        limitRule = PayChannelMap[discountForm.limitRule];
      }


      // 券种类
      let itemDiscountType = (<td></td>);
      switch (discountForm.itemDiscountType) {
      case 'MONEY':
        itemDiscountType = (<td>全场代金券</td>);
        break;
      case 'RATE':
        itemDiscountType = (<td>折扣券</td>);
        break;
      case 'PER_FULL_CUT':
        itemDiscountType = (<td>每满减券</td>);
        break;
      case 'EXCHANGE':
        itemDiscountType = (<td>兑换券</td>);
        break;
      case 'REDUCETO':
        itemDiscountType = (<td>立减到券</td>);
        break;
      case 'SINGLE_DISCOUNT':
        itemDiscountType = (<td>单品折扣券</td>);
        break;
      default:
        itemDiscountType = (<td></td>);
      }

      const couponValue = [];
      if (discountForm.itemDiscountType === 'RATE') {
        couponValue.push(<td className="kb-detail-table-label">
                        折扣率
                      </td>);
        couponValue.push(<td>{discountForm.rate}折</td>);
      } else {
        couponValue.push(<td className="kb-detail-table-label">
                        券面额
                      </td>);
        couponValue.push(<td>{discountForm.couponValue}元</td>);
      }

      const { type, shopNumBefore, shopNumAfter, changePriceBefore, changePriceAfter } = this.state.changeInfo;
      let priceChange = null;
      let thresholdChange = null;
      let capAmountChange = null;
      const priceChangeStatus = getCateringPriceChangeStatus(type, changePriceBefore, changePriceAfter);
      if (priceChangeStatus.priceChanged) {
        if (type === 'MANJIAN') {
          // 全场每满减
          priceChange = (<div className="text">
            优惠修改：<span className="color-orange">{`原每消费${changePriceBefore.threshold}元立减${changePriceBefore.discountAmount}元，修改为每消费${changePriceAfter.threshold}元立减${changePriceAfter.discountAmount}元。`}</span>
          </div>);
        } else if (type === 'VOUCHER') {
          // 全场代金券
          priceChange = (<div className="text">
            优惠修改：<span className="color-orange">{`原券面额${changePriceBefore.discountAmount}元，修改为券面额${changePriceAfter.discountAmount}元。`}</span>
          </div>);
        } else if (type === 'RATE') {
          // 全场折扣
          priceChange = (<div className="text">
            优惠修改：<span className="color-orange">{`原折扣力度${changePriceBefore.rate}折，修改为折扣力度${changePriceAfter.rate}折。`}</span>
          </div>);
        }
      }
      if (priceChangeStatus.thresholdChanged) {
        thresholdChange = (<div className="text">
          最低消费修改：<span className="color-orange">{`原最低消费${changePriceBefore.threshold === '不限制' ? '不限制' : (changePriceBefore.threshold + '元')}，修改为${changePriceAfter.threshold === '不限制' ? '不限制' : (changePriceAfter.threshold + '元')}。`}</span>
        </div>);
      }
      if (priceChangeStatus.capAmountChanged) {
        capAmountChange = (<div className="text">
          最高优惠修改：<span className="color-orange">{`原最高优惠${changePriceBefore.capAmount === '不限制' ? '不限制' : (changePriceBefore.capAmount + '元')}，修改为${changePriceAfter.capAmount === '不限制' ? '不限制' : (changePriceAfter.capAmount + '元')}。`}</span>
        </div>);
      }
      const { rejecting, confirming } = this.state;
      return (
        <div className="kb-groups-view activity-detail-change">
          <h2 className="kb-page-title">营销管理</h2>
          <div className="app-detail-content-padding">
            <Breadcrumb separator=">">
              <Breadcrumb.Item>管理</Breadcrumb.Item>
              <Breadcrumb.Item>查看营销活动</Breadcrumb.Item>
            </Breadcrumb>

            <div className="kb-detail-main">
              {
                discountForm.offlineReason && <Row><Col><Alert message="活动下架"
                  description={discountForm.offlineReason}
                  type="info"
                  showIcon /></Col></Row>
              }
              { (shopNumBefore !== undefined && shopNumAfter !== undefined && shopNumBefore !== shopNumAfter) || priceChange || thresholdChange || capAmountChange
                  ?
                  <div className="change-tips">
                  <p><span className="icon-wrapper"><Icon className="icon-info" type="info-circle" /></span>上海口碑服务商有限公司提醒你，修改了优惠／门店信息，请仔细核对后确认上架。</p>
                  { priceChange }
                  { thresholdChange }
                  { capAmountChange }
                  { shopNumBefore !== undefined && shopNumAfter !== undefined && shopNumBefore !== shopNumAfter
                    ?
                    <div className="text">门店修改：<span className="color-orange">{`原${shopNumBefore}家适用门店，修改为${shopNumAfter}家适用门店。`}</span></div>
                    :
                    null
                  }
                  </div>
                :
                null
              }
              <div className="coupon-info">
                {discountForm.deliveryChannelImgUrl ? <img src={discountForm.deliveryChannelImgUrl} /> : null}
                <div className="coupon-detail">
                  <h4>{discountForm.campaignName} <span className="status"></span></h4>
                  <p>{discountForm.deliveryChannelSlogan}</p>
                  <p>{discountForm.startTime} ~ {discountForm.endTime}</p>
                  {discountForm.autoDelayFlag === 'Y' && <p>已设置自动续期</p>}
                  <p style={{marginTop: 10}}>
                    <span style={{color: '#ff6600', fontWeight: 'bold'}}>{discountForm.crowdName}</span>
                    {!discountForm.crowdId ? <div>{discountForm.allowUseUserGroup ? allowUseUserGroupObj[discountForm.allowUseUserGroup] : '不限人群'}</div> : <div>
                      {discountForm.crowdRestriction && discountForm.crowdRestriction === 'NEW_MEMBER_PROMO' ? <span style={{color: '#f60'}}>从未到该商家消费的新客</span> : <span style={{marginLeft: 10}}>选定会员{this.state.crowdNum.memberMerchantGroupCount}, 占比{this.state.crowdNum.memberMerchantGroupRatio}</span>}
                    </div>}
                  </p>
                </div>
              </div>

              <p className="sub-title">优惠券设置</p>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">券种类</td>
                    {itemDiscountType}
                    <td className="kb-detail-table-label">券名称</td>
                    <td>{discountForm.subject}</td>
                    <td className="kb-detail-table-label">品牌名称</td>
                    <td>{discountForm.brandName}</td>
                  </tr>
                  {discountForm.itemDiscountType !== 'PER_FULL_CUT' ? (<tr>
                      <td className="kb-detail-table-label">券logo</td>
                      <td>
                        <img src={discountForm.logoFixUrl}/>
                      </td>
                      {couponValue}
                      <td className="kb-detail-table-label">使用条件</td>
                      <td>{discountForm.minimumAmount ? `满${discountForm.minimumAmount}元可用` : '不限制'}</td>
                    </tr>) : <tr>
                      <td className="kb-detail-table-label">券logo</td>
                      <td>
                        <img src={discountForm.logoFixUrl}/>
                      </td>
                      <td className="kb-detail-table-label">优惠力度</td>
                      <td>每消费满{discountForm.perConsumeAmount}立减{discountForm.perDiscountAmount}元</td>
                      <td className="kb-detail-table-label">最高优惠</td>
                      <td>{discountForm.maxDiscountAmount ? `${discountForm.maxDiscountAmount}元` : '不限制'}</td>
                    </tr>}

                  <tr>
                    <td className="kb-detail-table-label">使用方式</td>
                    <td>{{'REAL_TIME_SEND': '无需用户领取', 'DIRECT_SEND': '需要用户领取'}[discountForm.activityType] || ''}</td>
                    <td className="kb-detail-table-label">每个用户总参与</td>
                    <td>{discountForm.receiveLimited ? `${discountForm.receiveLimited}次` : '不限制'}</td>
                    <td className="kb-detail-table-label" style={{whiteSpace: 'nowrap'}}>每个用户每天参与</td>
                    <td>{discountForm.dayReceiveLimited ? `${discountForm.dayReceiveLimited}次` : '不限制'}</td>
                  </tr>
                  <tr>
                    {hasValid ? <td className="kb-detail-table-label">券有效期</td> : null}
                    {hasValid ? <td>
                      {
                        discountForm.validTimeType === 'RELATIVE' ?
                            <span>领取后{discountForm.validPeriod}日内有效</span> :
                            <span>{discountForm.validTimeFrom} - {discountForm.validTimeTo}</span>
                        }
                    </td> : null}
                    <td className="kb-detail-table-label">券适用门店</td>
                    <td>
                      {discountForm.shop.length}家门店
                      <span onClick={this.showShopList} style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>

                      <Modal title={'券适用门店'}
                             style={{top: modalTop}}
                             visible={this.state.showShopListModal}
                             onCancel={this.onCancel}
                             footer={[]}>
                        <div className="check-shop-list">
                          {
                            discountForm.cityShop.map((item, key) => {
                              return (
                                <dl key={`city${key}`}>
                                  <dt>{item.cityName}</dt>
                                  {
                                    item.shops.map((shop, i) => {
                                      return (
                                        <dd key={`shop${i}`}>{shop.name}</dd>
                                      );
                                    })
                                  }
                                </dl>
                              );
                            })
                          }
                        </div>
                      </Modal>
                    </td>
                    <td className="kb-detail-table-label">发放总量</td>
                    <td>{discountForm.budgetAmount ? discountForm.budgetAmount : '不限制'}</td>
                    {!hasValid ? <td className="kb-detail-table-label"></td> : null}
                    {!hasValid ? <td></td> : null}
                  </tr>
                  <tr>
                    {hasValid ? <td className="kb-detail-table-label">领取当日可用</td> : null}
                    {hasValid ? <td>{discountForm.activityType !== 'REAL_TIME_SEND' ? <div>{(discountForm.actived === '0' || !discountForm.actived) ? '是' : '否'}</div> : null }</td> : null }
                    <td className="kb-detail-table-label">券可用时段</td>
                    <td>{(discountForm.availableTimes.length !== 0) ? formatAvailableVoucherTime(discountForm.availableTimes) : '不限制'}</td>
                    <td className="kb-detail-table-label">不可用日期</td>
                    <td>{discountForm.forbiddenTime ? formatForbiddenVoucherTime(discountForm.forbiddenTime) : '不限制'}</td>
                    {!hasValid ? <td className="kb-detail-table-label"></td> : null }
                    {!hasValid ? <td></td> : null }
                  </tr>
                  {/*  这是原来的逻辑
                    limitRule &&
                    <tr>
                      <td className="kb-detail-table-label">支付渠道限制</td>
                      <td colSpan="5">
                        { limitRule }
                      </td>
                    </tr>
                  */}
                  {
                    discountForm.itemDiscountType !== 'PER_FULL_CUT' ? (<tr style={{display: limitRule ? 'table-row' : 'none'}}>
                    {limitRule ? <td className="kb-detail-table-label">支付渠道限制</td> : null}
                    {limitRule ? <td colSpan={!discountForm.allowUseUserGroup ? 5 : 1}>{ limitRule }</td> : null}
                    {discountForm.allowUseUserGroup ? <td className="kb-detail-table-label">使用人群限制</td> : null}
                    {discountForm.allowUseUserGroup ? <td colSpan={discountForm.allowUseUserGroup === '2' ? 1 : 3}>{ allowUseUserGroupObj[discountForm.allowUseUserGroup] }</td> : null}
                    {discountForm.birthDateFrom ? <td className="kb-detail-table-label">指定生日日期</td> : null}
                    {discountForm.birthDateFrom ? <td>{discountForm.birthDateFrom} ~ {discountForm.birthDateTo} 日期范围内用户可享</td> : null}
                  </tr>) : (<tr>
                      <td className="kb-detail-table-label">支付渠道限制</td>
                      <td>
                        { limitRule }
                      </td>
                      <td className="kb-detail-table-label">是否允许转赠</td>
                      <td>{discountForm.donateFlag === '1' ? '是' : '否'}</td>
                      <td className="kb-detail-table-label">
                        <p>是否在口碑门店</p>
                        <p>露出</p>
                      </td>
                      <td>{discountForm.koubeiChannelDisplay ? '是' : '否'}</td>
                    </tr>)
                  }
                  {
                    discountForm.itemDiscountType !== 'PER_FULL_CUT' && discountForm.activityType === 'DIRECT_SEND' ?
                    <tr>
                      <td className="kb-detail-table-label">是否允许转赠</td>
                      <td colSpan="5">{discountForm.donateFlag === '1' ? '是' : '否'}</td>
                    </tr> : null
                  }
                  <tr>
                    <td className="kb-detail-table-label">备注</td>
                    <td colSpan="5">
                      { discountForm.voucherNote }
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">使用说明</td>
                    <td colSpan="5">
                      {
                        discountForm.descList && discountForm.descList.map((item, i) => {
                          return (
                            <p key={`desc${i}`}>{item}</p>
                          );
                        })
                      }
                    </td>
                  </tr>
                </tbody>
              </table>

              { discountForm.deliveryChannels ? (
              <div>
                <p className="sub-title">投放渠道</p>
                <table className="kb-detail-table-6">
                  <tbody>
                  <tr>
                    <td className="kb-detail-table-label">投放渠道</td>
                    <td style={{width: 'auto'}}>
                      {
                        filteredChannels.map((item, i) => {
                          return (
                            <span key={`chanel${i}`}>{item === 'SHOP_DETAIL' && !discountForm.crowdId ? '店铺详情页'
                              : retailersDeliveryChannels[item].label}
                              {retailersDeliveryChannels[item] && i !== filteredChannels.length - 1 ? ', ' : null}
                            </span>
                          );
                        })
                      }
                      {
                        filteredChannels.length > 0 ?
                          <div style={{display: 'inline-block', marginLeft: 10}}>
                          {
                            filteredChannels.every((item) => {
                              return item === 'SHOP_DETAIL';
                            }) && !discountForm.crowdId ? null : <a href="#" onClick={this.showPreview}>预览</a>
                          }
                            <Modal ref="modal"
                                   visible={this.state.showPreviewModal}
                                   onCancel={this.closePreview}
                                   title="投放渠道预览"
                                   width="800"
                                   style={{top: modalTop}}
                                   footer={[]}>
                              <Row type="flex" justify="space-between">
                                {
                                  discountForm.deliveryChannels.map((item, index) => {
                                    if (retailersDeliveryChannels[item].img !== '') {
                                      return (<Col key={`delivery${index}`} span="7">
                                        {retailersDeliveryChannels[item].label}
                                        <img width="100%" src={retailersDeliveryChannels[item].img}/>
                                      </Col>);
                                    }
                                    return (<Col key={`delivery${index}`} span="7">
                                      {discountForm.deliveryResult && retailersDeliveryChannels[item].label}
                                      {
                                        (item === 'QR_CODE' && discountForm.deliveryResult) && <img width="100%" src={discountForm.deliveryResult[item]}/>
                                      }
                                      {
                                        (item === 'SHORT_LINK' && discountForm.deliveryResult) && <p>{discountForm.deliveryResult[item]}</p>
                                      }
                                    </Col>);
                                  })
                                }
                              </Row>
                            </Modal>
                          </div> : null
                      }
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>) : null}
            </div>
            {/* changeinfo.type 不存在 也就是说changeInfo为空 */}
            { type && allowConfirm ?
            <div className="view-bottom">
              <div style={{marginBottom: '10px'}}>
                <Checkbox
                  checked={this.state.checked}
                  onChange={this.onCheckBoxChange}
                >
                  将名下同类券／活动进行下架。
                </Checkbox>
                <a onClick={this.goToOldActivityDetail}>查看详情</a>
              </div>
              <div>
                <Button
                  style={{marginRight: '10px'}}
                  onClick={() => this.handleActivityChange(false)}
                  loading={rejecting}
                  disabled={confirming}
                >退回修改</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.confirmBtn();
                  }}
                  loading={confirming}
                  disabled={rejecting}
                >同意上架</Button>
              </div>
            </div>
            :
            null
          }
          </div>
          <Modal wrapClassName="offlineOldActivityFailModal" visible={this.state.offlineOldActivityFailModalVisible}
            footer={
              <Button type="primary" size="large" onClick={() => {this.setState({ offlineOldActivityFailModalVisible: false });}}>知道了</Button>
            }
          >
            <div>
              <p className="title"><Icon className="icon-circle" type="exclamation-circle" />&nbsp;新活动上架成功，名下同类券／活动无法进行下架。</p>
              <p className="body">具体内容请点此 <a onClick={() => {
                this.setState({
                  offlineOldActivityFailModalVisible: false,
                });
                this.goToOldActivityDetail();
              }}>查看详情</a></p>
            </div>
          </Modal>
        </div>
      );
    }
    return (
      <div></div>
    );
  },
});

export default AllActivityViewForChange;
