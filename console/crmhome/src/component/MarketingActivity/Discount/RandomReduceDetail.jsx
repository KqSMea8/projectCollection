import React, { PropTypes, createClass } from 'react';
import { message, Modal, Breadcrumb, Row, Col, Alert, Button } from 'antd';
import ajax from '../../../common/ajax';
import { customLocation, getValueFromQueryString } from '../../../common/utils';
import VoucherTitle from '../common/VoucherTitle';
import ShopListModal from '../../mall/common/ShopListModal';
import GlobalDetail from '../../MemberMarketing/retailers/view/AllActivityView';

export default createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      loading: true,
      data: undefined,
      isFromKb: getValueFromQueryString('fromSource') === 'KB_SERVICE',
      showShopListModal: false,
      showSKUCodeModal: false,
    };
  },
  componentDidMount() {
    this.fetch();
  },
  fetch() {
    if (!this.state.loading) {
      this.setState({ loading: true });
    }
    let url;
    if (!this.state.isFromKb) {
      url = `${window.APP.ownUrl}/goods/itempromo/campaignDetail.json?campId=${this.props.params.id}`;
    } else {
      url = `${window.APP.ownUrl}/goods/koubei/promotionNewCampDetail.json?campId=${this.props.params.id}`;
    }
    ajax({
      url,
      method: 'get',
      type: 'json',
      success: (res) => {
        if (!res) {
          return;
        }
        if (res.result) {
          this.setState({ loading: false, data: res.discountForm });
        } else {
          message.error(res.errorMsg || '获取数据失败', 3);
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
          self.setState({ loading: false });
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
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

  /*eslint-disable */
  render() {
    /*eslint-enable */
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }
    const { data, loading, isFromKb } = this.state;
    if (!data || loading) return null;

    const voucher = data.voucherVOs[0];
    const promoType = voucher.promotionType === 'ALL_ITEM' ? '全场' : '单品';
    let ticketType = '';
    if (voucher.type === 'RATE') {
      ticketType = `${promoType}折扣券`;
    } else if (voucher.type === 'MONEY') {
      ticketType = `${promoType}代金券`;
    } else if (voucher.type === 'REDUCETO') {
      ticketType = `${promoType}换购券`;
    }

    if (!voucher.itemIds) { // 没有商品编码为全场代金券，修改也是这样处理。
      return <GlobalDetail params={{ campId: this.props.params.id }} />;
    }

    return (
      <div className="kb-groups-view">
        {!isFromKb && <h2 className="kb-page-title">活动管理</h2>}
        <div className="app-detail-content-padding">
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="/goods/itempromo/activityList.htm">活动管理</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href="/goods/itempromo/activityManage.htm">营销活动</a></Breadcrumb.Item>
            <Breadcrumb.Item>随机立减</Breadcrumb.Item>
          </Breadcrumb>
          <div className="kb-detail-main">
            {
              data.offlineReason && <Row><Col><Alert message="活动下架"
                description={data.offlineReason} type="info" showIcon />
              </Col></Row>
            }
          </div>
          <VoucherTitle {...data} logo={voucher.voucherImg} voucherName={data.campName}>
            {
              voucher.promotionType !== 'ALL_ITEM' && <p>{ticketType}</p>
            }
          </VoucherTitle>
          <p className="sub-title">活动商品设置</p>
          <style type="text/css">{'.kb-detail-table-label {background-color: rgb(244,244,244);}.kb-detail-table-6{font-size:12px;}'}</style>
          <table className="kb-detail-table-6">
            <tbody>
              <tr>
                <td className="kb-detail-table-label">品牌名称</td>
                <td>{voucher.subTitle}</td>
                <td className="kb-detail-table-label">品牌logo</td>
                <td>
                  {
                    voucher.logo && <img style={{ height: 60 }} src={voucher.logo} alt="品牌logo" />
                  }
                </td>
                <td className="kb-detail-table-label">商品名称</td>
                <td>{voucher.itemName}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">商品SKU编码</td>
                <td>
                  <a href="#" onClick={(e) => { e.preventDefault(); this.setState({ showSKUCodeModal: true }); }}>查看</a>
                  <Modal title="商品编码"
                    visible={this.state.showSKUCodeModal}
                    onCancel={() => { this.setState({ showSKUCodeModal: false }); }}
                    footer={[]}
                  >
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                      {
                        (voucher.itemIds || []).map((p, i) => {
                          return <p key={i}>{p}</p>;
                        })
                      }
                    </div>
                  </Modal>
                </td>
                <td className="kb-detail-table-label">商品详情</td>
                <td>{voucher.itemText}</td>
                <td className="kb-detail-table-label">商品图片</td>
                <td style={{ overflow: 'auto' }}>
                  <div style={{ display: 'flex' }}>
                    {
                      (voucher.itemHeadImg || []).map((img, i) =>
                        <img style={{ height: 60 }} src={img} key={`prdimg_${i}`} />
                      )
                    }
                    <img style={{ height: 60 }} src={voucher.voucherImg} alt="" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">更多商品详情</td>
                <td colSpan="5"><a href={voucher.itemLink} target="_blank">{voucher.itemLink}</a></td>
              </tr>
            </tbody>
          </table>

          <p className="sub-title">活动规则设置</p>
          <style type="text/css">{'.kb-detail-table-label {background-color: rgb(244,244,244);}.kb-detail-table-6{font-size:12px;}'}</style>
          <table className="kb-detail-table-6">
            <tbody>
              <tr>
                <td className="kb-detail-table-label">随机立减金额区间</td>
                <td>
                  {(voucher.reduceRanges || []).length} 个区间&nbsp;
                  <a onClick={() => this.setState({ showReduces: true })}>查看</a>
                  <Modal title="随机立减金额区间"
                    visible={this.state.showReduces}
                    onCancel={() => this.setState({ showReduces: false })}
                    footer={[]}>
                    <div>
                      {
                        (voucher.reduceRanges || []).map((r, i) =>
                          <p key={i} style={{ color: '#999' }}>区间{i + 1}： {r.minRange}–{r.maxRange}元，占比{r.percentage}%</p>
                        )
                      }
                    </div>
                  </Modal>
                </td>
                <td className="kb-detail-table-label">一笔订单购买商品最低限制</td>
                <td>{voucher.minConsumeNum ? `购买${voucher.minConsumeNum}件活动商品可享优惠` : '不限制'}</td>
                <td className="kb-detail-table-label">活动期间每人累计可{data.useMode === '0' ? '领券几张' : '参与几次'}</td>
                <td>{data.participateLimited ? `最多${data.participateLimited}次` : '不限制'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">活动期间每人每天累计可{data.useMode === '0' ? '领券几张' : '参与几次'}</td>
                <td>{data.dayParticipateLimited ? `最多${data.dayParticipateLimited}次` : '不限制'}</td>
                <td className="kb-detail-table-label">券发放总量</td>
                <td colSpan="3">{data.budgetAmount || '不限制'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">使用说明</td>
                <td colSpan="5">
                  {
                    voucher.useInstructions && voucher.useInstructions.map((desc, i) => {
                      return (
                        <p key={i}>{desc}</p>
                      );
                    })
                  }
                </td>
              </tr>
            </tbody>
          </table>

          <p className="sub-title">邀请参与商户</p>
          <table className="kb-detail-table-6">
            <tbody>
              <tr>
                <td className="kb-detail-table-label" style={{ width: '3%' }}>适用门店</td>
                <td colSpan="5">
                  {voucher.cityShopVOs.length &&
                    <ShopListModal title={'券适用门店'}
                      visible={this.state.showShopListModal}
                      onCancel={this.hideShopList}
                      style={{ top: modalTop }}
                      data={voucher.cityShopVOs}
                      isCityShop="true"
                    />}
                  {voucher.shopIds && voucher.shopIds.length ? voucher.shopIds.length : 0} 家门店 {voucher.shopIds && voucher.shopIds.length && <a onClick={this.showShopList}>查看</a>}
                </td>
              </tr>
            </tbody>
          </table>

        </div>

        <div style={{ textAlign: 'center' }}>
          {data.allowOffline && <Button type="primary" onClick={this.handleOffline}>下架</Button>}
          {data.allowConfirm && (
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
          )}
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
        </div>
      </div>
    );
  },
});
