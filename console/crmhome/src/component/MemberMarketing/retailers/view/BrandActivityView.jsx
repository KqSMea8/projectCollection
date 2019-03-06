/* eslint-disable */
import React, {PropTypes} from 'react';
import {Breadcrumb, message, Modal, Button, Checkbox, Spin} from 'antd';
import VoucherView from '../../common/VoucherView';
import ConsumeView from '../../common/VoucherView/consume';
import BargainView from '../../common/VoucherView/bargain';
import DeliveryChannels from '../../common/DeliveryChannels';
import {retailersActStatusNEW, activityType} from '../../config/AllStatus';
const confirm = Modal.confirm;

import ajax from '../../../../common/ajax';
import SelectShops from '../../common/SelectShops';
import ShopUpload from '../../common/ShopUpload';
import TreeModal from '../../common/TreeModal';

const BrandActivityView = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      showShopModal: false,
      dealVisible: false,
      detail: {}, // 优惠券数据
      dealChecked: false,
      shops: {},
      chooseShopList: false, // 展示门店选择
      cityShops: [], // 适用门店
      shopSize: 0, // 适用门店,
      testLoading: false,
    };
  },

  componentWillMount() {
    if (this.props.params.orderId) {
      this.fetch();
    }
  },

  onCancel() {
    this.setState({
      showShopModal: false,
    });
  },

  getShopList(planId, orderId) {
    const {discountForm} = this.state.detail;
    ajax({
      url: discountForm.planOutBiztype === 'BIZTYPE_MALL_CAMPAIGN' ? '/goods/itempromo/getShopsRecruit.json' : '/goods/itempromo/getShops.json',
      method: 'get',
      type: 'json',
      data: {
        planId,
        orderId,
      },
      success: (res) => {
        if (res.shopCountGroupByCityVO) {
          const { shopCountGroupByCityVO } = res;

          const activityLbs = [];
          const cityCodes = [];
          const symbols = activityLbs;

          const promiseArray = shopCountGroupByCityVO.map(({ cityCode, cityName, shopCount }) =>
            new Promise(resolve => {
              if (cityCodes.includes(cityCode)) {
                this.loadChildren(cityCode).then(children => {
                  resolve({ name: cityName, symbol: cityCode, children, count: shopCount });
                });
              } else {
                resolve({ name: cityName, symbol: cityCode, children: [], count: shopCount });
              }
            })
          );
          Promise.all(promiseArray).then(treeData => {
            this.setState({
              shops: { treeData, checkedSymbols: symbols },
            });
          });
        } else {
          message.error(res.errorMsg || '获取门店信息失败');
        }
      },
    });
  },

  showModal() {
    this.setState({
      showShopModal: true,
    });
  },


  fetch() {
    const { orderId } = this.props.params;
    ajax({
      url: '/promo/recruit/detail.json',
      method: 'get',
      type: 'json',
      data: {
        orderId,
      },
      success: (res) => {
        if (res.status === 'success') {
          const { discountForm: { planId, displayStatus, orderStatus } } = res;
          this.setState({
            detail: res,
          });
          this.planId = planId;
          if (displayStatus === 'PLAN_GOING' && orderStatus === 'INIT') {
            this.getShopList(planId, orderId);
            // this.getShopList('', '');
          }
          if (orderStatus === 'SUCCESS' || (orderStatus === 'AUDIT' && displayStatus === 'PLAN_GOING')) {
            this.fetchShops(orderId);
            this.getShopList(planId, orderId);
          }
        } else {
          message.error(res.errorMsg || '获取券信息失败');
        }
      },
    });
  },

  checkDeal() {
    this.setState({
      dealChecked: !this.state.dealChecked,
    });
  },

  chooseShop() {
    this.setState({
      chooseShopList: true,
    });
  },

  loadChildren(symbol) {
    const { orderId } = this.props.params;

    return new Promise(resolve => {
      ajax({
        url: '/goods/itempromo/getShopsByCityRecruit.json',
        method: 'GET',
        data: {
          cityCode: symbol,
          orderId: orderId,
          planId: this.planId,
        },
        type: 'json',
        success: data => {
          const { shopComps } = data;

          const children = [];
          shopComps.map(({ cityCode, shopName, shopId, disabled}) => {
            if (!disabled) {
              children.push({
                cityCode,
                name: shopName,
                symbol: shopId,
                disabled,
              });
            }
          });

          resolve(children);
        },
      });
    });
  },

  fetchShops(orderId) {
    ajax({
      url: '/promo/recruit/queryConfirmShops.json',
      method: 'GET',
      data: {
        orderId: orderId,
      },
      type: 'json',
      success: res => {
        if (res.status === 'success') {
          this.setState({
            cityShops: res.cityShops,
            shopSize: res.shopSize,
          });
        } else {
          message.error(res.errorMsg || '获取适用门店信息失败');
        }
      },
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

  activityTest() {
    const self = this;
    const { orderId } = this.props.params;

    confirm({
      title: '测试活动生成确认',
      content: (
        <ul>
          <li>1.系统将按照当前活动的内容为你生成一个副本测试活动，测试活动跟品牌商邀约活动是两个活动，测试活动所产生优惠不计算到品牌商邀约活动中；</li>
          <li>2. 生成的测试活动标题前都会出现【品牌优惠测试】</li>
          <li>3.. 该测试活动仅对测试名单可见（配置测试名单），你可在活动管理中查看测试优惠的情况</li>
        </ul>
        ),
      onOk() {
        self.setState({
          testLoading: true,
        });

        ajax({
          url: '/promo/recruit/test.json',
          method: 'GET',
          data: {
            orderId: orderId,
          },
          type: 'json',
          success: res => {
            self.setState({
              testLoading: false,
            });

            if (res.status === 'success') {
              location.hash = '/marketing/brands/test-success';
            } else {
              message.error(res.errorMsg);
            }
          },
          error: (res) => {
            self.setState({
              testLoading: false,
            });

            message.error(res.errorMsg);
          },
        });
      },
    });
  },

  ReviewOk(e) {
    const self = this;
    const { orderId } = this.props.params;

    confirm({
      title: e === 'agree' ? '审批通过确认' : '审批驳回确认',
      onOk() {
        self.setState({
          testLoading: true,
        });

        ajax({
          url: '/promo/recruit/audit.json',
          method: 'GET',
          data: {
            orderId: orderId,
            type: e,
          },
          type: 'json',
          success: res => {
            self.setState({
              testLoading: false,
            });

            if (res.status === 'success') {
              location.reload();
            } else {
              message.error(res.errorMsg);
            }
          },
          error: (res) => {
            self.setState({
              testLoading: false,
            });

            message.error(res.errorMsg);
          },
        });
      },
    });
  },

  confirmActivity(symbols) {
    const { discountForm } = this.state.detail;
    let symbolsList = [];
    const self = this;
    let content = [
      '确认参加品牌商优惠活动， 请核实优惠信息并完成测试。',
      '本活动为"自动结算"方式，优惠资金以补贴形式T+1自动转入参与门店的收款账户，无额外收款。',
      '您知晓并认可：活动可能存在品牌商预存资金不足无法按约定时间（T+1）借款风险。',
      '接受活动，结束后，用户发生了优惠商品退货，口碑有权向您的相应收款账户扣回补贴资金。',
    ];
    if (discountForm.settleType === 'T0') {
      content = [
        '确认参加品牌商优惠活动， 请核实优惠信息并完成测试。',
        '本活动为“实时结算”方式，优惠自己以补贴形势T+0自动转账到参与活动门店的收款号，无额外收款。',
        '接受活动，结束后，用户发生了优惠商品退货，口碑有权向您的相应收款账户扣回补贴资金。',
      ];
    }
    if (discountForm.settleType === 'T1' && discountForm.planOutBiztype !== 'BIZTYPE_MALL_CAMPAIGN') {
      content = [
        '确认参加品牌商优惠活动， 请核实优惠信息并完成测试。',
        '本活动为“实时结算”方式，优惠自己以补贴形势T+0自动转账到参与活动门店的收款号，无额外收款。',
        '接受活动，结束后，用户发生了优惠商品退货，口碑有权向您的相应收款账户扣回补贴资金。',
      ];
    }

    Modal.confirm({
      title: discountForm.needKBSettle ? (discountForm.settleType === 'T0' ? '确认上架品牌商实时结算形式的活动' : '确认上架并接受自动结算功能') : '确认上架',
      content: discountForm.needKBSettle ? (
          <ul>
            {
              content.map((item, key) => {
                return (
                  <li key={key} style={{marginBottom: 10}}>{`${key + 1}. ${item}`}</li>
                );
              })
            }
          </ul>
      ) : '确认参加品牌商优惠活动，请核实优惠信息并完成测试。',
      okText: discountForm.needKBSettle ? '同意上架' : '确定',
      cancelText: discountForm.needKBSettle ? '拒绝' : '取消',
      onOk() {
        if ( symbols.shopType === 'select' && symbols.shops.length < 1 ) {
          message.error('门店数不能为空');
          return;
        }
        if ( symbols.shopType === 'upload' && symbols.logId === '' ) {
          message.error('上传文件不能为空');
          return;
        }
        if (discountForm.planOutBiztype === 'BIZTYPE_MALL_CAMPAIGN') {
          symbolsList = symbols;
        } else if ( symbols.shopType === 'select' ) {
          const symbolsArray = symbols.shops ? symbols.shops : symbols;
          symbolsArray.map((p) => {
            symbolsList.push(p.shopId);
          })
        }
        ajax({
          url: '/promo/recruit/apply.json',
          method: 'post',
          data: {
            orderId: discountForm.orderId,
            shopType: symbols.shopType,
            logId: symbols.logId,
            shops: symbolsList.join(','),
          },
          type: 'json',
          success: (req) => {
            if (req.status === 'success') {
              message.success('上架成功');

              self.fetch();
            } else {
              message.error(req.resultMsg);
            }
          },
        });
      },
    });
  },

  confirmActivityEditShop(symbols) {
    const { discountForm } = this.state.detail;
    let symbolsList = [];
    const self = this;
    Modal.confirm({
      title: '确认修改活动门店',
      content: '将提交修改后的门店作为活动门店',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        if ( symbols.shopType === 'select' && symbols.shops.length < 1 ) {
          message.error('门店数不能为空');
          return;
        }
        if ( symbols.shopType === 'upload' && symbols.logId === '' ) {
          message.error('上传文件不能为空');
          return;
        }
        if (discountForm.planOutBiztype === 'BIZTYPE_MALL_CAMPAIGN') {
          symbolsList = symbols;
        } else if ( symbols.shopType === 'select' ) {
          const symbolsArray = symbols.shops ? symbols.shops : symbols;
          symbolsArray.map((p) => {
            const id = p.shopId || p.id;
            symbolsList.push(id);
          })
        }
        const data = {
          activityId: discountForm.activityId,
          shopIds: symbolsList,
        };
        ajax({
          url: window.APP.kbretailprod + '/gateway.htm',
          data: {
            biz: 'supermarket.retailer',
            action: '/confirmShop/modify',
            data: JSON.stringify(data)
          },
          method: 'post',
          type: 'json',
          success: (req) => {
            if (req.success) {
              message.success('修改成功！');
              self.fetch();
            } else {
              message.error(req.errorMsg === 'null' ? '修改失败' : req.errorMsg);
            }
          },
        });
      },
    });
  },

  cancelParticipate() {
    const { discountForm} = this.state.detail;
    const self = this;
    Modal.confirm({
      title: '确认退出活动',
      content: (<div>
        <p>1.退出活动将会把全部报名活动门店从活动中剔除，用户将不能在活动门店中进行领券参与活动</p>
        <p>2.退出活动后将不能重新报名参加该活动</p>
      </div>),
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const data = {
          activityId: discountForm.activityId,
        };
        ajax({
          url: window.APP.kbretailprod + '/gateway.htm?biz=supermarket.retailer&action=/confirmShop/remove&op_merchant_id=&data=' + JSON.stringify(data),
          method: 'get',
          type: 'json',
          success: (req) => {
            if (req.success) {
              message.success('取消活动门店成功！');
              self.fetch();
            } else {
              message.error(req.errorMsg);
            }
          },
        });
      },
    });
  },

  render() {
    const { discountForm, isKbservLogin, isAllowModifyShop} = this.state.detail;
    const { shopSize, cityShops, detail} = this.state;
    if (discountForm) {
      const { displayStatus, orderStatus } = discountForm;
      let modalTop = 100;
      if (window.top !== window) {
        modalTop = window.top.scrollY - 100;
      }

      let treeModalprops;
      if (this.state.shops.treeData) {
        treeModalprops = {
          defaultTreeData: this.state.shops.treeData,
          defaultCheckedSymbols: this.state.shops.checkedSymbols,
          visible: this.state.chooseShopList,
          loadChildren: this.loadChildren,
          selectedShops: cityShops,
          modalProps: {
            title: '门店选择',
            onOk: symbols => {
              this.setState({
                chooseShopList: false,
              });
              this.confirmActivity(symbols);
              // 确认参加品牌商优惠活动，确认上架后将无法撤销，请核实优惠信息并完成测试。
              // setFieldsValue({ activityLbs: symbols });
            },
            onCancel: () => this.setState({ chooseShopList: false }),
          },
        };

        if ((displayStatus === 'STARTED' || displayStatus === 'PLAN_ENDING' ) && orderStatus === 'SUCCESS' && discountForm.planOutBiztype === 'BIZTYPE_BRAND_CAMPAIGN') {
          treeModalprops = {
            defaultTreeData: this.state.shops.treeData,
            defaultCheckedSymbols: this.state.shops.checkedSymbols,
            visible: this.state.chooseShopList,
            loadChildren: this.loadChildren,
            selectedShops: cityShops,
            modalProps: {
              title: '门店选择',
              onOk: symbols => {
                this.setState({
                  chooseShopList: false,
                });
                this.confirmActivityEditShop(symbols);
                // 已确认活动开始后，修改门店数据
              },
              onCancel: () => this.setState({ chooseShopList: false }),
            },
          };
        }
      }

      let shopModal;
      if (treeModalprops) {
        if (discountForm.planOutBiztype === 'BIZTYPE_MALL_CAMPAIGN') {
          shopModal = (<TreeModal {...treeModalprops}/>);
        } else {
          shopModal = (<ShopUpload {...treeModalprops} />);
        }
      }
      return (
      <Spin spinning={this.state.testLoading}>
        <div className="kb-groups-view" >
          { isKbservLogin === false && <h2 className="kb-page-title">营销管理</h2>}
          <div className="app-detail-content-padding">
            <Breadcrumb separator=">">
              <Breadcrumb.Item>管理</Breadcrumb.Item>
              <Breadcrumb.Item>查看营销活动</Breadcrumb.Item>
            </Breadcrumb>

            <div className="kb-detail-main">
              <div className="coupon-info">
                {
                  // 消费送 买一送一 不展示券图片
                  (discountForm.type !== 'CONSUME_SEND' && discountForm.type !== 'BUY_ONE_SEND_ONE') && <img src={discountForm.logoFixUrl}/>
                }
                <div className="coupon-detail">
                  <h4>{discountForm.campaignName}
                    <span className={'status ' + retailersActStatusNEW[(orderStatus === 'AUDIT' && displayStatus === 'PLAN_GOING') ? orderStatus : displayStatus].color}>
                    {retailersActStatusNEW[(orderStatus === 'AUDIT' && displayStatus === 'PLAN_GOING') ? orderStatus : displayStatus].text}
                    </span>
                    {
                      displayStatus === 'CLOSED' && <span style={{marginLeft: 10, fontSize: '12px', color: '#666'}}>
                        {discountForm.offlineReason && discountForm.offlineReason.trim().length !== 0 && '下架原因:' + discountForm.offlineReason}
                      </span>
                    }
                    {
                      discountForm.needKBSettle && (discountForm.settleType === 'T0' ? <span className="status orangeLight">实时结算</span> : <span className="status orangeLight">自动结算</span>)
                    }
                  </h4>
                  {
                    // 消费送/买一送一 不展示券类型
                    discountForm.type !== 'CONSUME_SEND' && discountForm.type !== 'BUY_ONE_SEND_ONE' && <p>{activityType[discountForm.type]}</p>
                  }

                  {
                    discountForm.type === 'BUY_ONE_SEND_ONE' &&
                    <p>{discountForm.itemDiscountType === 'BUY_A_SEND_A' ? '买A送A' : '买A送B'} </p>
                  }
                  <p>{discountForm.startTime} - {discountForm.endTime}</p>
                  { discountForm.crowdId &&
                    <p style={{marginTop: 10}}>
                      <span style={{color: '#ff6600', fontWeight: 'bold'}}>{discountForm.crowdName}</span>
                    </p>
                  }
                </div>
              </div>

              {
                // CONSUME_SEND：    消费送
                discountForm.type === 'CONSUME_SEND' && <ConsumeView discountForm={discountForm} />
              }

              {
                // RANDOM_REDUCE     随机立减
                // BUY_ONE_SEND_ONE  买一送一
                (discountForm.type === 'BUY_ONE_SEND_ONE' || discountForm.type === 'RANDOM_REDUCE') && <BargainView discountForm={discountForm} />
              }

              {
                (discountForm.type !== 'CONSUME_SEND' && discountForm.type !== 'BUY_ONE_SEND_ONE' && discountForm.type !== 'RANDOM_REDUCE') && <VoucherView discountForm={discountForm} />
              }


              <p className="sub-title">商家设置</p>
              <table className="kb-detail-table-6">
                <tbody>
                <tr>
                  <td className="kb-detail-table-label">适用门店</td>
                  <td style={{width: 'auto'}}>
                    {
                      cityShops && cityShops.length > 0 ? (
                        <div>
                          {shopSize}家门店
                          <span onClick={this.showModal} style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>
                          {
                            discountForm.planOutBiztype === 'BIZTYPE_BRAND_CAMPAIGN' && isAllowModifyShop  && (displayStatus === 'STARTED' || displayStatus === 'PLAN_ENDING' ) && orderStatus === "SUCCESS" &&
                            <span onClick={this.chooseShop} style={{color: '#2db7f5', marginLeft: 5, cursor: 'pointer'}}>|  重选门店</span>
                          }
                          {
                            discountForm.planOutBiztype !== 'BIZTYPE_MALL_CAMPAIGN' && shopModal
                          }
                          <Modal title={'门店列表'}
                                 style={{top: modalTop}}
                                 visible={this.state.showShopModal}
                                 onCancel={this.onCancel}
                                 footer={[]}>
                            <div className="check-shop-list">
                              {
                                cityShops.map((item, key) => {
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
                      ) : null
                    }
                  </td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">商家确认截止时间</td>
                  <td style={{width: 'auto'}}>{discountForm.confirmTime}</td>
                </tr>
                </tbody>
              </table>

              { discountForm.type !== 'BUY_ONE_SEND_ONE' && <DeliveryChannels discountForm={discountForm} />}

              <p className="sub-title">结算方式</p>
              <table className="kb-detail-table-6">
                <tbody>
                <tr>
                  <td className="kb-detail-table-label">结算方式</td>
                  <td style={{ width: '88%'}}>{discountForm.needKBSettle ? (discountForm.settleType === 'T0' ? '实时结算' : '资金自动结算') : '活动后与商户线下结算'}</td>
                </tr>
                </tbody>
              </table>
            </div>

            {
              cityShops && cityShops.length > 0 && discountForm.planOutBiztype === 'BIZTYPE_BRAND_CAMPAIGN' && this.props.params.cancel === 'cancelactivity'
              && <Button type="primary" size="large" style={{margin: '20px 128px'}} onClick={this.cancelParticipate}>退出活动</Button>
            }

            {
              (displayStatus === 'PLAN_GOING' && orderStatus === 'INIT') &&
                <div className="view-bottom">
                  <Checkbox defaultChecked={false} style={{fontSize: 14}} onChange={this.checkDeal}>同意 <a href="#" onClick={this.showDeal}>《承诺核销服务协议》</a></Checkbox>
                  <br/>
                  <Button type="primary" disabled={ !this.state.dealChecked } size="large" style={{marginTop: 10}} onClick={this.chooseShop}>下一步 - 选择门店</Button>

                  {
                    shopModal
                  }

                  <Modal title="承诺核销服务协议"
                         style={{top: modalTop}}
                         visible={this.state.dealVisible}
                         onCancel={this.closeDeal}
                         footer={[]}
                         width={750}
                  >
                    { discountForm.settleType === 'T0' ? <iframe src="https://ds.alipay.com/fd-brand5m/write.html" width="720" height="400" scrolling="no" style={{border: 'none'}}></iframe> : <iframe src="https://ds.alipay.com/fd-brands5m/index.html" width="720" height="400" scrolling="no" style={{border: 'none'}}></iframe> }
                  </Modal>
                </div>
            }

            {
              orderStatus === 'AUDIT' ? (
                <div className="view-bottom">
                  { detail.isKbservLogin === false && <Button type="primary" size="large" onClick={this.ReviewOk.bind(this, 'agree')}>审批通过</Button>}
                  { detail.isKbservLogin === false && <Button type="primary" size="large" onClick={this.ReviewOk.bind(this, 'reject')} style={{marginLeft: 10}}>审批驳回</Button>}
                </div>
              ) : null
            }

            {
              (discountForm.supportTest && this.props.params.cancel !== 'cancelactivity') ? (
                <div className="view-bottom">
                  {detail.isKbservLogin === false && <Button type="primary" size="large" onClick={this.activityTest}>活动测试</Button>}
                </div>
              ) : null
            }
          </div>
        </div>
      </Spin>
    ); }

    return (
        <div></div>
    );
  },
});

export default BrandActivityView;
