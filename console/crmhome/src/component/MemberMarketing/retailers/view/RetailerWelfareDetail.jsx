/* eslint-disable */
import React, {PropTypes} from 'react';
import { Breadcrumb, message, Modal, Button, Checkbox, Spin} from 'antd';

import ajax from '../../../../common/ajax';
import './WelfareDetail.less';

const dimensionMap = {
  'WD': '工作日',
  'H': '周末、国家法定节假日'
};

const WelfareDetail = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      dealVisible: false,
      showShopListModal: false,
      detail: {}, // 优惠券数据
      dealChecked: true,
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

  showShopList() {
    this.setState({
      showShopListModal: true,
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

          // Mock
          // res.discountForm.displayStatus = 'PLAN_GOING';
          // res.discountForm.orderStatus = 'INIT';

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

  handleCancel() {
    const { discountForm } = this.state.detail;

    Modal.confirm({
      title: '是否确认取消参加口碑福利活动？',
      content: '取消前请确认活动生效时间，活动生效后将不能继续参加活动。',
      onOk() {
        ajax({
          url: 'promo/recruit/cancel.json',
          method: 'get',
          data: {
            orderId: discountForm.orderId,
          },
          type: 'json',
          success: (req) => {
            if (req.status === 'success') {
              message.success('取消成功');

              this.fetch();
            } else {
              message.error(req.resultMsg);
            }
          },
        });
      },
    });
  },

  handleSubmit() {
    const { discountForm } = this.state.detail;

    ajax({
      url: '/promo/recruit/apply.json',
      method: 'post',
      data: {
        orderId: discountForm.orderId,
        shops: discountForm.shopIds.join(','),
      },
      type: 'json',
      success: (req) => {
        if (req.status === 'success') {
          message.success('同意创建成功');

          // 跳列表页
          location.hash = "/marketing/retailers/manage/brandType";
        } else {
          message.error(req.resultMsg);
        }
      },
    });
  },

  render() {
    const { discountForm } = this.state.detail;

    if (discountForm) {
      let { displayStatus, orderStatus} = discountForm;
      let modalTop = 100;
      if (window.top !== window) {
        modalTop = window.top.scrollY - 100;
      }

      const enterpriseBenifitForm = discountForm.enterpriseBenifitForm;

      return (
        <Spin spinning={this.state.testLoading}>
          <div className="kb-groups-view" >
            <h2 className="kb-page-title">营销管理</h2>
            <div className="app-detail-content-padding">
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <a href="#/marketing/retailers/manage/brandType">
                    管理
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>口福活动详情</Breadcrumb.Item>
              </Breadcrumb>

              <div className="kb-detail-main kb-detail-qf">
                <div className="simulator-wrap">
                  <div className="simulator">
                    <img className="sample" src="https://zos.alipayobjects.com/rmsportal/SdKcadRcWWVCJdWERjGy.png"/>
                  </div>
                </div>
                <div className="kb-qf-main">
                  <div>
                    <table>
                      <tbody>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">福利企业:</td>
                        <td className="enterprisePerksDetail_table_tdR">{enterpriseBenifitForm.enterpriseName}</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">福利部门:</td>
                        <td className="enterprisePerksDetail_table_tdR">{enterpriseBenifitForm.departmentName}</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">福利地区:</td>
                        <td className="enterprisePerksDetail_table_tdR">{enterpriseBenifitForm.cityName}</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">福利类型:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {enterpriseBenifitForm.benifitType} <br />
                          {enterpriseBenifitForm.benifitType}可抵扣餐费 <span className="cprice">{discountForm.couponValue}</span> 元
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <h3 className="kb-form-sub-title">
                    <div className="kb-form-sub-title-icon"></div>
                    <span className="kb-form-sub-title-text">资金设置</span>
                    <div className="kb-form-sub-title-line"></div>
                  </h3>
                  <div>
                    <table>
                      <tbody>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">服务商出资百分比:</td>
                        <td className="enterprisePerksDetail_table_tdR">{enterpriseBenifitForm.thirdPartyRatio}%</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <h3 className="kb-form-sub-title">
                    <div className="kb-form-sub-title-icon"></div>
                    <span className="kb-form-sub-title-text">活动基本信息</span>
                    <div className="kb-form-sub-title-line"></div>
                  </h3>
                  <div>
                    <table>
                      <tbody>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">活动名称:</td>
                        <td className="enterprisePerksDetail_table_tdR">{discountForm.campaignName}</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">活动类型:</td>
                        <td className="enterprisePerksDetail_table_tdR">实时优惠</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">优惠金额:</td>
                        <td className="enterprisePerksDetail_table_tdR">立减{discountForm.couponValue}元</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">活动库存:</td>
                        <td className="enterprisePerksDetail_table_tdR">不限制</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">活动时间:</td>
                        <td className="enterprisePerksDetail_table_tdR">{discountForm.startTime} ~ {discountForm.endTime}</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">商户确认截止时间:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {discountForm.recruit.endTime}
                        </td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">适用门店:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          { discountForm.cityShop && discountForm.cityShop.length > 0 ? (
                              <div>
                                {discountForm.shop.length}家门店
                                <span onClick={this.showShopList} style={{ color: '#2db7f5', marginLeft: 10, cursor: 'pointer' }}>查看</span>

                                <Modal title={'门店列表'}
                                       style={{ top: modalTop }}
                                       visible={this.state.showShopListModal}
                                       onCancel={() => {this.setState({showShopListModal: false});}}
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
                            ) : null }
                        </td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">品牌名称:</td>
                        <td className="enterprisePerksDetail_table_tdR">{discountForm.brandName}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <h3 className="kb-form-sub-title">
                    <div className="kb-form-sub-title-icon"></div>
                    <span className="kb-form-sub-title-text">规则设置</span>
                    <div className="kb-form-sub-title-line"></div>
                  </h3>
                  <div>
                    <table>
                      <tbody>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">参与人群:</td>
                        <td className="enterprisePerksDetail_table_tdR">{enterpriseBenifitForm.crowdGroupName}</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">券可用时段:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {
                            (discountForm.availableTimes || []).map((item, index) => <p key={index}>{dimensionMap[item.dimension]} | {item.times.replace(',', '-')}</p>)
                          }
                        </td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">每日参与限制:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {enterpriseBenifitForm.isAmountSplitSupport ? `每人每天限制${discountForm.couponValue}元（${discountForm.couponValue}元可拆分多次使用）` : '每人每天参与 1 次'}
                        </td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">可与其他优惠叠加:</td>
                        <td className="enterprisePerksDetail_table_tdR">是</td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">可拆分使用:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {
                            enterpriseBenifitForm.isAmountSplitSupport ? ' 是' : '否'
                          }
                        </td>
                      </tr>
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL">使用须知:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {discountForm.vouchers[0].descList.join('\n')}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {
                (displayStatus === 'PLAN_GOING' && orderStatus === 'INIT') &&
                <div className="qf-action-row">
                  <div>
                    <Button type= "primary" size="large" onClick={this.handleSubmit} disabled={!this.state.dealChecked}>同意创建</Button>
                  </div>
                  <div className="check-row">
                    <Checkbox defaultChecked={this.state.dealChecked} style={{fontSize: 14}} onChange={this.checkDeal}>已仔细阅读并同意 <a href="#" onClick={(e) => { e.preventDefault(); this.setState({dealVisible: true});}}>《口碑口碑福利商户协议》</a></Checkbox>
                  </div>

                  <Modal title="口碑福利商户协议"
                     style={{top: modalTop}}
                     visible={this.state.dealVisible}
                     onCancel={() => {this.setState({dealVisible: false});}}
                     footer={null}
                     width={750}
                  >
                    <iframe src="https://render.alipay.com/p/f/koufu/business-contract.html" width="720" height="400" style={{border: 'none'}}></iframe>
                  </Modal>
                </div>
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

export default WelfareDetail;
