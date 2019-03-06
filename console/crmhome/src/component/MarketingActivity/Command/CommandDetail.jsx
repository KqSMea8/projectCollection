import React from 'react';
import { Form, Breadcrumb, Icon, Row, Spin, message, Modal, Button } from 'antd';
import IM from 'immutable';
import ViewCoupon from '../common/coupon/ViewCoupon';
import {customLocation, getValueFromQueryString} from '../../../common/utils';
import ajax from '../../../common/ajax';
import CommonSimulator from '../common/CommonSimulator';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {span: 4, offset: 2},
  wrapperCol: {span: 15},
};

const CommandDetail = React.createClass({
  getInitialState() {
    return {
      loading: true,
      canSubmit: true,
      data: null,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  fetch() {
    this.setState({ loading: true });
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
          this.setState({loading: false, data: IM.fromJS(result.discountForm)});
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
        self.setState({ loading: true });
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

  confirmBtn(_key) {
    const self = this;
    const urlMap = {
      allowConfirm: '/goods/itempromo/agreePromotion.json',
      allowModifyConfirm: '/goods/itempromo/agreePromoModify.json',
      allowOfflineConfirm: '/goods/itempromo/agreePromoOffline.json',
    };
    const confirmUrl = urlMap[_key];
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
    const urlMap = {
      allowReject: '/goods/itempromo/rejectPromotion.json',
      allowModifyReject: '/goods/itempromo/rejectPromoModify.json',
      allowOfflineReject: '/goods/itempromo/rejectPromoOffline.json',
    };
    const rejectUrl = urlMap[_key];
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
          self.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },
  forwardToManage(e) {
    e.preventDefault();
    customLocation('/goods/itempromo/activityList.htm');
  },

  render() {
    const { loading, data } = this.state;
    if (loading || !data) return <Row style={{ textAlign: 'center', marginTop: 80 }}><Spin/></Row>;
    const vouchers = data.get('voucherVOs');
    let voucher = null;
    if (vouchers && vouchers.size > 0) {
      voucher = vouchers.get(0);
    }
    return (
      <div>
        <div className="app-detail-header">营销活动</div>
        <div className="kb-detail-main" style={{ overflow: 'hidden' }}>
          <Breadcrumb>
            <Breadcrumb.Item style={{ fontSize: '14px', color: '#0ae' }}>
              <a onClick={this.forwardToManage}><Icon type="circle-o-left" />营销活动</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ fontSize: '14px' }}>口令送礼</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{marginTop: '32px', display: 'flex', justifyContent: 'center'}}>
            <CommonSimulator caption="口碑口令优惠展示界面" background={data.get('guessBackgroundImage')}
              logo={voucher.get('logo')} couponName={voucher && voucher.get('promotionRule')}
              activeDuration={<p>领取时间:{data.get('startTime')} ~ {data.get('endTime')}</p>} guess={data.get('guessPassword')}
            />
            <Form horizontal style={{ width: '600px' }}>
              <FormItem label="活动时间：" {...formItemLayout}>
                {data.get('startTime')} ~ {data.get('endTime')}
              </FormItem>
              <FormItem label="活动口令：" {...formItemLayout}>{data.get('guessPassword')}</FormItem>
              <FormItem label="品牌名称：" {...formItemLayout}>{voucher.get('subTitle')}</FormItem>
              <FormItem label="商家logo：" {...formItemLayout}>
                <img style={{ width: 50, height: 50 }} src={voucher.get('logo')} />
              </FormItem>
              <FormItem label="背景图片：" {...formItemLayout}>
                <img style={{ width: 50, height: 50 }} src={data.get('guessBackgroundImage')} />
              </FormItem>
              <FormItem label="奖品设置：" {...formItemLayout}>
                <ViewCoupon value={{ ...voucher.toJS(), consumeSendType: data.get('consumeSendType'), index: 0, len: 1 }} />
              </FormItem>
              <div style={{ paddingLeft: '140px' }}>
              { data.get('allowOffline') && <Button type="primary" onClick={this.handleOffline}>下架</Button> }
              { data.get('allowConfirm') && (
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
              )}
              { data.get('allowModifyConfirm') && (
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
              )}
              { data.get('allowOfflineConfirm') && (
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
              )}
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  },
});

export default CommandDetail;
