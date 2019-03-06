import React, {PropTypes} from 'react';
import { Breadcrumb, message, Modal, Row, Col, Button, Checkbox } from 'antd';
import { retailersExternalActivityStatus, retailersExternalDeliveryChannels} from '../../config/AllStatus';

import TreeModal from '../../common/TreeModal';
import ajax from '../../../../common/ajax';

const ExternalActivityView = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      showPreviewModal: false,
      showShopListModal: false,
      showShopTree: false,
      showQuanIndex: 0,
      dealVisible: false,
      detail: {}, // 优惠券数据
      voucherItem: {}, // 券设置
      dealChecked: false,
      crowdNum: {
        memberMerchantGroupCount: 0,
        memberMerchantGroupRatio: '0%',
      },
    };
  },

  componentDidMount() {
    if (this.props.params.planId || this.props.params.campId) {
      this.fetch();
    }
  },

  onCancel() {
    this.setState({
      showShopListModal: false,
    });
  },

  fetch() {
    const { params } = this.props;

    ajax({
      url: '/promo/activity/activityQuery.json',
      method: 'get',
      type: 'json',
      data: {
        'planId': params.planId,
        'campId': params.campId,
        'op_merchant_id': params.merchantId,
      },
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            detail: res,
            voucherItem: res.data.vouchers[0],
          });
        } else {
          message.error(res.errorMsg || '获取券信息失败');
        }
      },
    });
  },

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

  showDeal(event) {
    event.preventDefault();

    this.setState({
      dealVisible: true,
    });
  },

  closeDeal() {
    this.setState({
      dealVisible: false,
    });
  },

  changeHandle() {
    this.setState({
      dealChecked: !this.state.dealChecked,
    });
  },

  switchQuan(index) {
    this.setState({
      showQuanIndex: index,
      voucherItem: this.state.detail.data.vouchers[index],
    });
  },

  handleActivityTest(event) {
    event.preventDefault();

    const { planId } = this.state.detail.data;

    /* const treeModalprops = {
      defaultTreeData: treeData,
      defaultCheckedSymbols: checkedSymbols,
      loadChildren: ::this.loadChildren,
      visible,
      modalProps: {
        title: shopType === 'city' ? '城市选择' : '门店选择',
        onOk: symbols => {
          this.setState({ visible: false });
          setFieldsValue({ activityLbs: symbols });
        },
        onCancel: () => this.setState({ visible: false }),
      },
    }; */

    Modal.confirm({
      title: '活动测试',
      content: '系统将在您选择的门店下生成测试活动，该活动仅对测试名单可见。',
      onOk() {
        ajax({
          url: 'promo/activity/activityTest.json?planId=' + planId,
          method: 'get',
          data: {
            planId: planId,
          },
          type: 'json',
          success: (req) => {
            if (req.status === 'success') {
              Modal.success({
                title: '生成测试成功',
                content: (<div>系统将在您选择的门店下生成测试优惠，该优惠仅对测试名单可见（<a href="goods/itempromo/testList.htm" target="_blank">配置测试名单</a>）。您可在折扣管理中查看测试优惠的情况。<p className="kb-page-sub-title">测试方法</p><p>1.使用测试名单中的账号打开支付宝客户端，在您的店铺下领取测试优惠（若品牌商发布的是实时优惠则无需领取）</p>。<p>2.选择品牌商优惠中指定的商品，使用测试账号买单，验证券是否能正确核销，规则是否满足。</p><p>3.每个门店有10次测试机会，测试中商品的优惠差价由零售商自行承担。</p></div>),
              });
            } else {
              message.error(req.resultMsg);
            }
          },
        });
      },
    });
  },

  handleJoinActivity(event) {
    const { planId } = this.state.detail.data;

    event.preventDefault();

    ajax({
      url: 'promo/activity/activityShopQuery.json?planId=' + planId,
      method: 'GET',
      type: 'json',
      success: result => {
        const { data } = result;
        const treeData = data.map(({ shopName: name, shopId: symbol }) => {
          return ({
            name,
            symbol,
          });
        });
        // console.log(treeData);
        // this.cities = { treeData, checkedSymbols: symbols };
        // this.setState(this.cities);

        this.setState({
          treeData: treeData,
        });

        this.setState({
          showShopTree: true,
        });
      },
    });
  },

  handleOffLine(event) {
    // const self = this;
    event.preventDefault();

    /* const { planId } = self.props.params;

    Modal.confirm({
      title: '下架活动提示:',
      content: '下架后活动将立即结束, 已发出的券在有限期内依然可以用, 是否继续?',
      onOk() {
        ajax({
          url: '/promo/merchant/offline.json',
          method: 'get',
          data: {
            campaignId: planId,
          },
          type: 'json',
          success: (req) => {
            if (req.status === 'success') {
              message.success('下架成功');

              self.fetch();
            } else {
              message.error(req.errorMsg);
            }
          },
        });
      },
    }); */
  },
  /*eslint-disable */
  render() {
    /*eslint-enable */
    const that = this;
    const { data } = this.state.detail;
    const { voucherItem, showQuanIndex } = this.state;
    const ButtonGroup = Button.Group;
    let treeModalprops;
    if (data) {
      const vouchers = data.vouchers;
      /* let limit;
      if (discountForm.itemDiscountType === 'RATE' || discountForm.itemDiscountType === 'REDUCETO') {
        limit = '同一件商品满' + discountForm.minItemNum + '件可享受优惠，且该商品最高优惠' + discountForm.maxDiscountItemNum + '件';
      } else {
        limit = discountForm.minimumAmount ? '满' + discountForm.minimumAmount + '元可用' : '不限制';
      }

      let discountDisplay;
      if (discountForm.itemDiscountType === 'RATE') {
        discountDisplay = discountForm.rate + '折';
      } else if (discountForm.itemDiscountType === 'REDUCETO') {
        discountDisplay = '减至' + discountForm.reduceToPrice + '元';
      } else {
        discountDisplay = '立减' + discountForm.couponValue + '元';
      } */
      let userWinCountTxt;
      if (data.userWinCount && data.userWinCount !== '-1') {
        userWinCountTxt = '参与限制' + data.userWinCount + '次/人';
      }

      let budgetTotalTxt;
      if (data.budgetTotal === '-1') {
        budgetTotalTxt = '无限制';
      } else {
        budgetTotalTxt = data.budgetTotal + '张';
      }

      let showBtnTest;
      let showBtnJoin;
      if (data.activityStatus === 'STARTING') {
        if (data.applyStatus === 'SUCCESS' && data.activityType === 'DIRECT_SEND') {
          showBtnTest = true;
        }
        if (data.applyStatus !== 'SUCCESS') {
          showBtnJoin = true;
        }
      }

      let minConsumeTxt;
      if (data.minConsume === '-1') {
        minConsumeTxt = '消费即送的会员';
      } else {
        minConsumeTxt = '消费满' + data.minConsume + '的会员';
      }

      if (this.state.treeData) {
        treeModalprops = {
          defaultTreeData: this.state.treeData,
          visible: this.state.showShopTree,
          modalProps: {
            title: '选择门店',
            onOk: symbols => {
              if (!symbols.length) {
                message.error('请选择门店');
                return;
              }
              this.setState({ showShopTree: false });
              Modal.confirm({
                title: '确认参加',
                content: '确认参加购物中心优惠活动并上架，活动邀约阶段可撤销，请核实优惠信息。',
                onOk() {
                  ajax({
                    url: 'promo/activity/activityApply.json',
                    method: 'get',
                    data: {
                      planId: data.planId,
                      shops: symbols.join(','),
                    },
                    type: 'json',
                    success: (req) => {
                      if (req.status === 'success') {
                        Modal.success({
                          title: '成功参加活动',
                          content: (<div>系统将在您选择的门店下生成测试优惠，该优惠仅对测试名单可见。<p>{showBtnTest ? <a href="#" onClick={that.handleActivityTest}>活动测试</a> : null}</p></div>),
                          onOk() {
                          },
                        });
                        that.fetch();
                      } else {
                        message.error(req.resultMsg);
                      }
                    },
                  });
                },
              });
            },
            onCancel: () => this.setState({ showShopTree: false }),
          },
        };
      }

      let modalTop = 100;
      if (window.top !== window) {
        modalTop = window.top.scrollY - 100;
      }

      return (
        <div className="kb-groups-view">
          <h2 className="kb-page-title">营销管理</h2>
          <div className="app-detail-content-padding">
            <Breadcrumb separator=">">
              <Breadcrumb.Item>管理</Breadcrumb.Item>
              <Breadcrumb.Item>活动详情</Breadcrumb.Item>
            </Breadcrumb>

            <div className="kb-detail-main">
              <div className="coupon-info">
                <div className="coupon-detail">
                  <h4>{data.activityName}
                    <span className={'status ' + retailersExternalActivityStatus[data.activityStatus].color}>
                      {data.activityStatusDesc}
                    </span>
                  </h4>
                  <p>{minConsumeTxt}</p>
                  <p>{data.startTime} ~ {data.endTime}</p>
                  <p style={{marginTop: 10}}>
                    <span style={{color: '#ff6600', fontWeight: 'bold'}}>{data.activityTypeDesc}</span>
                    <span style={{marginLeft: 10}}>{userWinCountTxt} 发放总量{budgetTotalTxt}</span>
                  </p>
                </div>
              </div>

              <p className="sub-title">优惠券设置</p>

              {
                vouchers.length > 1 ? <ButtonGroup>
                {
                  vouchers.map((item, key) => {
                    return (
                      <Button type={ key === showQuanIndex ? 'primary' : null } onClick={this.switchQuan.bind(this, key)} key={key}>券{key + 1}</Button>
                    );
                  })
                }
                 </ButtonGroup> : null
              }

              <table className="kb-detail-table-6">
                <tbody>
                <tr>
                  <td className="kb-detail-table-label">券种类</td>
                  <td>{voucherItem.typeDesc}</td>
                  <td className="kb-detail-table-label">券适用门店</td>
                  <td>
                    {voucherItem.suitShopCount} 家门店
                    { /* voucherItem.suitShopCount && voucherItem.suitShopCount > 0 ? (
                      <div>
                        {voucherItem.suitShopCount}家门店
                        <span onClick={this.showShopList} style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>

                        <Modal title={'适用门店'}
                               style={{top: modalTop}}
                               visible={this.state.showShopListModal}
                               onCancel={this.onCancel}
                               footer={[]}>
                          <div className="check-shop-list">
                            {
                               discountForm.cityShop.map((item, key) => {
                                return (
                                  <dl key={key}>
                                    <dt>{item.cityName}</dt>
                                    {
                                      item.shops.map((shop, i) => {
                                        return (
                                          <dd key={i}>{shop.name}</dd>
                                        );
                                      })
                                    }
                                  </dl>
                                );
                              })
                            }
                          </div>
                        </Modal>
                      </div>
                    ) : '-' */}
                  </td>
                  <td className="kb-detail-table-label">券名称</td>
                  <td>{voucherItem.name}</td>

                </tr>
                <tr>
                  <td className="kb-detail-table-label">品牌名称</td>
                  <td>{voucherItem.brandName}</td>
                  <td className="kb-detail-table-label">券logo</td>
                  <td>
                    {
                      voucherItem.logoUrl ? <img src={voucherItem.logoUrl}/> : null
                    }
                  </td>
                  <td className="kb-detail-table-label">券图片</td>
                  <td>
                    {
                      voucherItem.imgUrl ? <img src={voucherItem.imgUrl}/> : null
                    }
                  </td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">券面额</td>
                  <td>{voucherItem.discount}</td>
                  <td className="kb-detail-table-label">券有效期</td>
                  <td>{voucherItem.validTime}</td>
                  <td className="kb-detail-table-label">最低消费</td>
                  <td>{voucherItem.minConsume}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">可使用时段</td>
                  <td>{voucherItem.availableTime}</td>
                  <td className="kb-detail-table-label">不可用时段</td>
                  <td>{voucherItem.forbiddenTime}</td>
                  <td className="kb-detail-table-label">使用说明</td>
                  <td>{(voucherItem.useInstructions.join(''))}</td>
                </tr>
                </tbody>
              </table>

              <p className="sub-title">投放渠道</p>
              <table className="kb-detail-table-6">
                <tbody>
                <tr>
                  <td className="kb-detail-table-label">投放渠道</td>
                  <td style={{width: 'auto'}}>
                    {
                      /* data.chainList.map((item, i) => {
                        if (item.code === 'SHOP_DETAIL') {
                          return (
                            <span key={i}>{item.name}</span>
                          );
                        }
                      }) */
                      <span>门店详情页，购物中心首页</span>
                    }
                    {
                      // data.chainList.length > 0 ?
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
                                /* data.chainList.map((item) => {
                                  if (item.code === 'SHOP_DETAIL') {
                                  }
                                }) */
                                retailersExternalDeliveryChannels.map((channel, key) => {
                                  return (<Col key={key} span="7">
                                    {channel.label}
                                    <img width="100%" src={channel.img}/>
                                  </Col>);
                                })
                              }
                            </Row>
                          </Modal>
                        </div>
                         // : null
                    }
                  </td>
                </tr>
                </tbody>
              </table>

              <p className="sub-title">创建须知</p>
              <table className="kb-detail-table-2">
                <tbody>
                <tr>
                  <td className="kb-detail-table-label">参与门店</td>
                  <td style={{width: 'auto'}}>
                    { voucherItem.suitShopCount } 家门店
                  </td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">商户确认截止时间</td>
                  <td style={{width: 'auto'}}>{data.applyEndTime}</td>
                </tr>
                </tbody>
              </table>

              {
                showBtnTest ?
                  <div className="view-bottom"><Button type="primary" size="large" onClick={this.handleActivityTest}>活动测试</Button></div>
                : null
              }
              {
                showBtnJoin ?
                  <div className="view-bottom">
                    <div>
                        <Checkbox onChange={this.changeHandle}>同意</Checkbox>
                      <a style={{ fontSize: 12 }} href="#" onClick={this.showDeal}>口碑综合体商户合作协议</a>
                    </div>
                    <Button style={{ marginTop: 10 }} disabled={ !this.state.dealChecked } type="primary" size="large" onClick={this.handleJoinActivity}>确认参加</Button>

                    {
                      treeModalprops ? <TreeModal {...treeModalprops} /> : null
                    }

                    <Modal title="口碑综合体商户合作协议"
                           style={{top: modalTop}}
                           visible={this.state.dealVisible}
                           onCancel={this.closeDeal}
                           footer={[]}
                           width={700}
                    >
                      <iframe src="/promo/common/externalAgreement.htm" width="700" height="400" scrolling="no" style={{border: 'none'}}></iframe>
                    </Modal>
                  </div>
                : null

              }
            </div>

          </div>

        </div>
    ); }

    return (
        <div></div>
    );
  },
});

export default ExternalActivityView;
