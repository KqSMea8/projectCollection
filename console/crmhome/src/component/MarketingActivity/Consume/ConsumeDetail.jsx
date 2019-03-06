import React, { PropTypes } from 'react';
import { Breadcrumb, Icon, Form, Button, message, Row, Col, Spin, Alert, Modal } from 'antd';
import ConsumeSimulator from './ConsumeSimulator';
import ViewCoupon from '../common/coupon/ViewCoupon';
import { customLocation, getValueFromQueryString } from '../../../common/utils';
import ajax from '../../../common/ajax';
import ShopListLabel from '../common/ShopListLabel';
import GoodsCodeLabel from '../common/GoodsCodeLabel';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 9 },
};

const ConsumeDetail = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      data: {
        voucherVOs: [],
      },
      loading: true,
    };
  },
  componentDidMount() {
    this.fetch();
  },
  fetch() {
    this.setState({
      loading: true,
    });
    let url = window.APP.ownUrl + '/goods/itempromo/campaignDetail.json?campId=' + this.props.params.id;
    if (getValueFromQueryString('fromSource') === 'KB_SERVICE') {
      url = window.APP.ownUrl + '/goods/koubei/promotionNewCampDetail.json?campId=' + this.props.params.id;
    }
    ajax({
      url: url,
      method: 'get',
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.result) {
          this.setState({ loading: false, data: result.discountForm });
        } else {
          message.error(result.errorMsg || '获取数据失败', 3);
        }
      },
    });
  },
  handleOffline() {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '下架后活动将立即结束，已发出的券在有效期内依然可以使用，是否继续？',
      onOk() {
        const url = window.APP.ownUrl + '/goods/itempromo/offlineCampaign.json?campId=' + self.props.params.id;
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
              self.setState({ loading: false });
              if (result.errorMsg) {
                message.error(result.errorMsg, 3);
              }
            }
          },
        });
      },
    });
  },
  forwardToManage() {
    customLocation('/goods/itempromo/activityList.htm');
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
    // confirm ajax
    self.setState({
      loading: true,
    });
    ajax({
      url: confirmUrl,
      method: 'post',
      data: {
        campId: this.props.params.id,
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
          self.setState({ loading: false });
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
    // reject ajax
    self.setState({
      loading: true,
    });
    ajax({
      url: rejectUrl,
      method: 'post',
      data: {
        campId: this.props.params.id,
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
          self.setState({ loading: false });
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },
  crowdRepresent() {
    const { data } = this.state;
    let rpt = '';
    if (data.crowdRestriction && data.crowdRestriction === 'NEW_MEMBER_PROMO') {
      rpt = '商户新客';
    } else if (!data.crowdGroupId) {
      rpt = '不限人群';
    } else {
      rpt = data.crowdGroupName;
    }
    return (
      <FormItem
        label="活动人群"
        labelCol={{ span: 4, offset: 2 }}
        wrapperCol={{ span: 12 }}
      >
        {rpt}
      </FormItem>
    );
  },
  render() {
    const { data, loading } = this.state;
    const voucherList = [];
    const voucher = data.voucherVOs.map((item, index) => {
      const v = {
        ...item,
        consumeSendType: data.consumeSendType,
        index,
        len: data.voucherVOs.length - 1,
      };
      return <ViewCoupon value={v} />;
    });
    voucherList.push(voucher);
    return (
      <div>
        {
          loading && <Row style={{ textAlign: 'center', marginTop: 80 }}><Spin /></Row>
        }
        {
          !loading && (
            <div>
              <div className="app-detail-header">营销活动</div>
              <div className="kb-detail-main" style={{ overflow: 'hidden' }}>
                <Breadcrumb>
                  <Breadcrumb.Item style={{ fontSize: '14px', color: '#0ae' }}>
                    <a onClick={this.forwardToManage}><Icon type="circle-o-left" />营销活动</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item style={{ fontSize: '14px' }}>消费送礼</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ marginTop: '32px' }}>
                  <ConsumeSimulator />
                  <Form horizontal form={this.props.form} style={{ float: 'left', width: '600px' }}>
                    {
                      data.offlineReason && <Row><Col offset={3}><Alert message="活动下架"
                        description={data.offlineReason}
                        type="info"
                        showIcon /></Col></Row>
                    }
                    <FormItem
                      label="活动时间："
                      labelCol={{ span: 4, offset: 2 }}
                      wrapperCol={{ span: 12 }}>
                      {data.startTime}~{data.endTime}
                    </FormItem>
                    <FormItem
                      label="活动名称："
                      {...formItemLayout}>
                      {data.campName}
                    </FormItem>
                    {this.crowdRepresent()}
                    <FormItem
                      label="活动门店："
                      {...formItemLayout}>
                      <ShopListLabel shopLen={data.shopIds.length} shopList={data.cityShopVOs} />
                    </FormItem>
                    <FormItem
                      label="参与限制："
                      labelCol={{ span: 4, offset: 2 }}
                      wrapperCol={{ span: 12 }}>
                      {data.participateLimited && parseFloat(data.participateLimited) ? (<label className="ant-checkbox-vertical">
                        总共参与{data.participateLimited}次/人
                      </label>) : <label className="ant-checkbox-vertical">总共参与次数不限</label>}
                      {data.dayParticipateLimited && parseFloat(data.dayParticipateLimited) ? (<label className="ant-checkbox-vertical" style={{ marginTop: '10px' }}>
                        每天参与{data.dayParticipateLimited}次/人
                      </label>) : <label className="ant-checkbox-vertical">每天参与次数不限</label>}
                    </FormItem>
                    <FormItem
                      label="活动规则："
                      {...formItemLayout}>
                      {data.campRule || ''}
                    </FormItem>
                    <FormItem
                      label="商品限制："
                      {...formItemLayout}>
                      {data.itemIds.length > 0 ? '指定商品' : '不限制'}
                    </FormItem>
                    {/** 兼容一期的活动页面  只有在活动下面有多券且设置了budgetAmount时才显示 */
                      voucher.length > 1 && Number(data.budgetAmount) > 0 ?
                        <FormItem
                          label="活动预算："
                          {...formItemLayout}>
                          {data.budgetAmount}
                        </FormItem>
                        : null
                    }
                    {data.itemIds.length > 0 ?
                      (<FormItem
                        label="商品编码："
                        {...formItemLayout}>
                        <GoodsCodeLabel goodsCodeList={data.itemIds} />
                      </FormItem>) : ''}
                    <FormItem
                      label="奖品设置："
                      labelCol={{ span: 4, offset: 2 }}
                      wrapperCol={{ span: 14 }}>
                      {voucherList}
                    </FormItem>
                    {data.autoDelayFlag && (<FormItem
                      label="自动续期："
                      {...formItemLayout}>
                      <p className="ant-form-text">{data.autoDelayFlag === 'Y' ? '是' : '否'}</p>
                    </FormItem>)}
                    <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                      {
                        data.allowOffline && <Button
                          style={{ marginRight: '10px' }}
                          type="primary"
                          onClick={this.handleOffline}
                        >下架</Button>
                      }
                      {
                        data.allowConfirm && (
                          <div>
                            <Button
                              style={{ marginRight: '10px' }}
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
                        data.allowModifyConfirm && (
                          <div>
                            <Button
                              style={{ marginRight: '10px' }}
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
                        data.allowOfflineConfirm && (
                          <div>
                            <Button
                              style={{ marginRight: '10px' }}
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
                    </FormItem>
                  </Form>
                </div>
              </div>
            </div>)
        }
      </div>
    );
  },
});

export default Form.create()(ConsumeDetail);
