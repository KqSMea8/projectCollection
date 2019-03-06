import React, {PropTypes} from 'react';
import {Breadcrumb, Form, message, Modal, Button, Icon, Input} from 'antd';
const FormItem = Form.Item;

import ajax from '../../../../common/ajax';
import './WelfareDetail.less';

const dimensionMap = {
  'WD': '工作日',
  'H': '周末、国家法定节假日',
};

const WelfareDetail = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      offlineModal: false,
      showPreviewModal: false,
      showShopListModal: false,
      detail: {}, // 优惠券数据
    };
  },

  componentWillMount() {
    if (this.props.params.campId) {
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
      url: '/promo/ebProvider/detail.json',
      method: 'get',
      type: 'json',
      data: {
        activityId: params.campId,
      },
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            detail: res,
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

  handleOffLine() {
    const { campId } = this.props.params;
    console.log('handleOffLIne - in');
    this.props.form.validateFields((errors, values) => {
      ajax({
        url: '/promo/ebProvider/offline.json',
        method: 'post',
        data: {
          activityId: campId,
          offlineReason: values.offlineReason,
        },
        type: 'json',
        success: (req) => {
          console.log('handleOffLIne - success', req);

          if (req.status === 'success') {
            message.success('下架成功');

            this.setState({offlineModal: false});
            this.fetch();
          } else {
            message.error(req.errorMsg);
          }
        },
      });
    });
  },

  render() {
    const { discountForm, confirmedMerchants, unConfirmedMerchants } = this.state.detail;
    const { getFieldProps } = this.props.form;

    if (discountForm) {
      let modalTop = 100;
      if (window.top !== window) {
        modalTop = window.top.scrollY - 100;
      }

      const { displayStatus, enterpriseBenifitForm } = discountForm;

      return (
          <div className="kb-groups-view" >
            <div>
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <a href="#/marketing/brands/manage">口碑福利活动</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>口福活动详情</Breadcrumb.Item>
              </Breadcrumb>

              <div className="kb-detail-qf">
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
                        <td className="enterprisePerksDetail_table_tdL">邀约商户:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {
                            (confirmedMerchants && confirmedMerchants.length > 0) &&
                            <p>
                              已确认: { confirmedMerchants.join(',')}
                            </p>
                          }
                          {
                            (unConfirmedMerchants && unConfirmedMerchants.length > 0) &&
                            <p>
                              未确认: { unConfirmedMerchants.join(',')}
                            </p>
                          }
                        </td>
                      </tr>
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
                          <p>
                            {enterpriseBenifitForm.benifitType}
                          </p>
                          <p>
                            {enterpriseBenifitForm.benifitType}可抵扣餐费 <span className="cprice">{discountForm.couponValue}</span> 元
                          </p>
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
                        <td className="enterprisePerksDetail_table_tdL">资金池名称:</td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {enterpriseBenifitForm.poolName}/{enterpriseBenifitForm.poolId}<br />
                          资金池有效期：{enterpriseBenifitForm.poolStartTime}~{enterpriseBenifitForm.poolEndTime}<br />
                          当前余额：<span className="cprice">{enterpriseBenifitForm.poolBalance}</span>元
                        </td>
                      </tr>
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

                                <Modal title={'券适用门店'}
                                       style={{ top: modalTop }}
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
                      <tr className="enterprisePerksDetail_table_tr">
                        <td className="enterprisePerksDetail_table_tdL"></td>
                        <td className="enterprisePerksDetail_table_tdR">
                          {
                            (displayStatus === 'STARTED' || displayStatus === 'PLAN_GOING') ? (
                                <Button type="primary" size="large" onClick={() => {this.setState({offlineModal: true});}}>下架</Button>
                              ) : null
                          }
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <Modal title="下架活动提示"
              style={{top: modalTop}}
              visible={this.state.offlineModal}
              onCancel={() => {this.setState({offlineModal: false});}}
              onOK={this.handleOffLine}
              footer={[
                <Button key="submit" type="primary" size="large" onClick={this.handleOffLine}>
                  确定
                </Button>,
              ]}
            >
              <p style={{marginBottom: 20, fontSize: 16}}>
                <Icon type="exclamation-circle" style={{color: '#0ae', fontSize: 16}}/> 下架后活动将立即停止，已确认的商户将被取消参加活动的资格。确认下架？
              </p>
              <Form horizontal>
                <FormItem
                  label="下架原因："
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 18 }}
                  required
                >
                  <Input type="textarea" placeholder="请输入下架原因，最多400个字符"
                    {...getFieldProps('offlineReason', { rules: [
                      { required: true, message: '请输入下架原因' },
                      { max: 400, message: '下架原因最多不超过400个字' },
                    ],
                    })}
                  />
                </FormItem>
              </Form>
            </Modal>
          </div>
      ); }

    return (
      <div></div>
    );
  },
});

export default Form.create()(WelfareDetail);
