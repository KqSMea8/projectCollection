import React from 'react';
import QRCode from 'qrcode.react';
import { message, Breadcrumb, Modal, Button, Checkbox, Spin, Row, Alert, Icon } from 'antd';
import { uniq } from 'lodash';
import ajax from '../../../common/ajax';
import { getUriParam, getImageById, formatAvailableVoucherTime, formatForbiddenVoucherTime, saveJumpTo, isFromKbServ } from '../../../common/utils';
// import {format} from '../../../common/dateUtils';
import RepastShopListModal from './RepastShopListModal';
import RejectedModal from './RejectedModal';
import ShopDetailsModal from './ShopDetailsModal';
import ApplySignModal from '../Activity/ApplySignModal';  // 在线购买协议
import BuyRulesDetail from '../common/BuyRulesDetail';
import './details.less';


function showRejectReason(reason) {
  Modal.info({
    title: '退回原因',
    content: <p>{reason}</p>,
  });
}

function renderAlert(status, reason, rejectReason = '') {
  // const defaultMsg = getUriParam('tmsg', location.search);
  if (status === 'AUDIT') {
    return <Alert message={reason} type="info" showIcon />;
  }
  if (status === 'ONLINE') {
    return <Alert message={reason} type="success" showIcon />;
  }
  if (status === 'RETURNED') {
    return (
      <Alert message={<span>{reason}
        {rejectReason && (
          <span> 查看
          <a onClick={() => showRejectReason(rejectReason)}>退回原因
          </a>
          </span>
        )}</span>} type="warning" showIcon />
    );
  }
  return null;
}

const TYPE_MAP = {
  TRADE_VOUCHER: '在线购买商品',
  ITEM: '在线购买商品',
  MANJIAN: '每满减',
  VOUCHER: '全场代金',
  RATE: '全场折扣',
};
const CANCEL_MAP = {
  'TICKET_CODE': '券码核销',
  'USER_PAY_CODE': '付款码核销（需与口碑单品打通）',
  'EXTERNAL_TICKET_CODE': '外部券码核销',
};
const CHANNELS_MAP = {
  'ALL': '正常投放',
  'ORIENTATION': '定向投放',
};
class RepastGoodsDetails extends React.Component {
  state = {
    data: [],
    protocalChecked: true,
    returnModifyModal: false,
    addedIsChecked: true, // 控制商家按钮是否选中
    loading: true,
    shopListModal: false,
    handleSignCancel: false,
    visibleSignModal: false,
    shopDetailsModal: false,
    previewImgUrl: '',
    previewImgShow: false,
    leadsId: getUriParam('leadsId', this.props.location.search),
    sequenceId: getUriParam('sequenceId', this.props.location.search),
    itemId: getUriParam('itemId', this.props.location.search),
    offlineSuccess: false,  // 下架按钮 锁
    hasSigned: false, // 是否签约了在线购买 （默认：false）
    showSignModal: false,
    onlineTradePayRate: null,
    isPostLoading: false,
    tipReason: null,  // 头部提示文案
    confirmed: false,
    changeInfo: {},
    visibleQrcode: false, // 显示二维码
    showGoodsModal: false,
    previewVisible: false,
  }
  componentDidMount() {
    Promise.all([this.fetch()/* , this.queryChangeInfo()*/]).then((res) => {
      this.setState({ loading: false });
      // console.log(res);
      const errs = res.filter(d => d instanceof Error);
      if (errs.length === 1) {
        message.error(errs[0].message, 3);
      } else if (errs.length === 2) {
        message.error(uniq(errs.map(d => d.message)).join('；'), 3);
      }
      const itemDetail = res[0] && !(res[0] instanceof Error) ? res[0] : {};
      const changeInfo = res[1] && !(res[1] instanceof Error) ? res[1] : {};
      const { shopNumBefore, shopNumAfter, changePriceBefore, changePriceAfter, type } = changeInfo;
      const itemId = itemDetail.data.itemId || this.state.itemId;
      this.setState({
        itemId,
        data: itemDetail.data || {},
        allowApproval: itemDetail.allowApproval,
        tipReason: itemDetail.approvalMsg,
        changeInfo: {
          shopNumBefore,
          shopNumAfter,
          changePriceBefore,
          changePriceAfter,
          type,
        },
      });
    }, () => {
      this.setState({
        loading: false,
      });
    });
    if (window.top !== window) {
      window.top.postMessage(JSON.stringify({ action: 'scrollTop', scrollTop: 0 }), '*');
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.leadsId !== nextProps.leadsId) {
      this.setState({
        leadsId: nextProps.leadsId,
      });
    }
  }
  onChange = (e) => {
    this.setState({
      protocalChecked: e.target.checked,
    });
  }

  reject = () => {
    this.setState({
      returnModifyModal: true,
    });
  }

  // 返回修改弹窗的取消按钮
  confirmHandleCancel = () => {
    this.setState({
      returnModifyModal: false,
    });
  }
  // 返回修改弹窗的确认
  confirmHandleOk = () => {
    this.setState({
      returnModifyModal: false,
    });
    setTimeout(() => {
      if (window.top !== window && window.top.location.hash.indexOf('#/catering/detail') !== -1) {
        window.top.postMessage(JSON.stringify({ action: 'goback' }), '*');
      } else {
        location.hash = '#/catering/list';
      }
    }, 3);
  }
  returnModifyHandleCancel = () => {
    this.setState({
      returnModifyvisible: false,
    });
  }
  fetch = () => {
    return new Promise((resolve) => {
      let url = '';
      if (this.state.leadsId) {
        url = `/goods/koubei/queryMovehomeDetail.json?leadsId=${this.state.leadsId}`;
        // url = 'http://local.alipay.net:8981/test/catering/detail';
      } else if (this.state.sequenceId || this.state.itemId) {
        const caterCallChannel = isFromKbServ() ? 'SALES_MG' : 'CRM_HOME';
        url = `/goods/caterItem/queryItemDetail.json?sequenceId=${this.state.sequenceId || ''}&itemId=${this.state.itemId || ''}&caterCallChannel=${caterCallChannel}`;
        // url = 'http://pickpost.alipay.net/mock/kb-crmhome/goods/caterItem/queryItemDetail.json';
      }
      ajax({
        url,
        method: 'GET',
        type: 'json',
        success: (result) => {
          if (result && result.status === 'succeed') {
            resolve(result);
            // this.setState({
            //   loading: false,
            //   data: result.data,
            //   allowApproval: result.allowApproval,
            //   tipReason: result.approvalMsg,
            // });
          } else {
            // this.setState({ loading: false });
            resolve(new Error(result.resultMsg || '获取商品信息失败'));
            // message.error(result.resultMsg || '获取商品信息失败', 3);
          }
        },
        error: (err) => {
          // this.setState({ loading: false });
          resolve(new Error(err && err.resultMsg || '网络异常'));
          // message.error(err.resultMsg || '网络异常', 3);
        },
      });
    });
  }
  /* 异动不再有用
  queryChangeInfo() {
    return new Promise((resolve) => {
      if (window.top !== window || (!this.state.sequenceId && !this.state.itemId)) {
        resolve({});
        return;
      }
      ajax({
        url: `/goods/catering/queryCaterChangeInfo.json?bizId=${this.state.sequenceId || ''}&itemId=${this.state.itemId || ''}`,
        // url: 'http://pickpost.alipay.net/mock/kb-crmhome/goods/catering/queryCaterChangeInfo.json',
        method: 'GET',
        type: 'json',
        success: (result) => {
          if (result && result.status === 'succeed') {
            resolve(result);
          } else {
            resolve(new Error((result && result.resultMsg) || '获取商品异动信息信息失败'));
            // message.error(result.resultMsg || '获取商品异动信息信息失败', 3);
          }
        },
        error: (err) => {
          resolve(new Error((err && err.resultMsg) || '网络异常'));
          // message.error(err.resultMsg || '网络异常', 3);
        },
      });
    });
  }
  */
  confirmOnline = () => { // 同意上架
    this.setState({
      showSignModal: false,
    });
    Modal.confirm({
      title: '同意上架',
      content: '确定要同意上架吗？',
      onOk: () => {
        if (this.state.hasSigned !== true) {
          this.setState({
            isPostLoading: true,
          });
          ajax({
            url: '/goods/catering/checkSign.json',
            method: 'POST',
            success: res => {
              const state = { isPostLoading: false };
              if (res && res.status === 'succeed') {
                state.onlineTradePayRate = res.rate;
                state.hasSigned = res.hasSigned;
                state.showSignModal = !res.hasSigned;
              } else {
                state.showSignModal = false;
                message.error(res && res.resultMsg || '查询在线购买协议失败');
              }
              this.setState(state);
              if (res.hasSigned) {
                this.confirmOnlineSubmit();
              }
            },
            error: err => {
              this.setState({
                isPostLoading: false,
              });
              message.error(err && err.resultMsg || '查询在线购买协议异常', 3);
            },
          });
        } else {
          this.confirmOnlineSubmit();
        }
      },
    });
  }
  confirmOnlineSubmit = () => {
    this.setState({
      isPostLoading: true,
      showSignModal: false,
    });
    const data = {
      sequenceId: this.state.sequenceId || '',
      optType: 1,
      itemId: this.state.itemId || '',
    };
    ajax({
      url: '/goods/caterItem/merchantVerify.json',
      method: 'POST',
      data,
      success: (res) => {
        const state = {
          isPostLoading: false,
        };
        if (res && res.status === 'succeed') {
          message.success('操作成功', 3);
          state.confirmed = true;
          state.hasSigned = true;
          setTimeout(() => {
            if (window.top === window) {
              saveJumpTo(`#/catering/success?firstNoLicenseShopId=${res.firstNoLicenseShopId || ''}`);
            } else {
              saveJumpTo('#/catering/list');  // 销售中台商品管理页（餐饮）
            }
          }, 3000);
        } else {
          message.error(res && res.resultMsg || '操作失败', 3);
        }
        this.setState(state);
      },
      error: err => {
        this.setState({
          isPostLoading: false,
        });
        message.error(err && err.resultMsg || '系统异常', 3);
      },
    });
  }
  showShopList = () => {
    this.setState({
      shopListModal: true,
    });
  }
  cancelShopListModal = () => {
    this.setState({
      shopListModal: false,
    });
  }
  showShopDetails = () => {
    this.setState({
      shopDetailsModal: true,
    });
  }
  cancelShopDetailsModal = () => {
    this.setState({
      shopDetailsModal: false,
    });
  }
  mapDetailInfoDom = data => {
    return <BuyRulesDetail className="goods-detail" value={{ buyTips: data.buyTips || [], buyTipsTemplate: data.buyTipsTemplate }} />;
  }
  previewImageShow = (imgUrl) => () => {
    this.setState({
      previewImgUrl: imgUrl,
      previewImgShow: true,
    });
  }
  hidePreviewImage = () => {
    this.setState({
      previewImgShow: false,
    });
  }
  showQrcode = () => {
    this.setState({
      visibleQrcode: true,
    });
  }
  cancelQrcode = () => {
    this.setState({
      visibleQrcode: false,
    });
  }
  showGoodsId = () => {
    this.setState({
      showGoodsModal: true,
    });
  }
  cancelGoodsId = () => {
    this.setState({
      showGoodsModal: false,
    });
  }
  handlePreview = () => {
    this.setState({
      previewVisible: true,
    });
  }
  previewCancel = () => {
    this.setState({ previewVisible: false });
  }
  offlineProd = (e) => {
    e.preventDefault();
    const data = {};
    if (this.state.itemId || this.state.sequenceId) {
      data.itemId = this.state.itemId || '';
      data.sequenceId = this.state.sequenceId || '';
    }
    Modal.confirm({
      title: '下架活动提示:',
      content: '下架后活动将立即结束, 已发出的券在有限期内依然可以用, 是否继续?',
      onOk() {
        ajax({
          url: '/goods/caterItem/merchantOffline.json?',
          method: 'POST',
          data,
          success: res => {
            const state = { isPostLoading: false };
            if (res && res.status === 'succeed') {
              state.offlineSuccess = true;
              Modal.success({
                title: '操作成功',
                onOk() {
                  saveJumpTo('#/catering/list');
                },
                okText: '知道了',
              });
            } else {
              message.error(res && res.resultMsg || '操作失败', 3);
            }
            this.setState(state);
          },
          error: err => {
            message.error(err && err.resultMsg || '系统异常', 3);
            this.setState({
              isPostLoading: false,
            });
          },
        });
      },
    });
  }
  /*
  sign = () => {
    this.setState({
      isPostLoading: true,
    });
    ajax({
      url: '/goods/catering/sign.json',
      method: 'POST',
      success: res => {
        if (res && res.status === 'succeed' && res.result) {
          this.setState({
            showSignModal: false,
            hasSigned: true,
          });
          this.confirmOnlineSubmit();
        } else {
          message.error(res && res.resultMsg || '在线购买失败');
        }
        this.setState({
          isPostLoading: false,
        });
      },
      error: err => {
        this.setState({
          isPostLoading: false,
        });
        message.error(err && err.resultMsg || '在线购买签约异常');
      },
    });
  }
  */
  /* eslint-disable */
  render() {
    /* eslint-enable */
    const { data, loading, shopDetailsModal, changeInfo, previewVisible } = this.state;
    const { shopNumBefore, shopNumAfter, changePriceBefore, changePriceAfter } = changeInfo;
    // const confirmOrderId = this.props.location.query.id;
    let titleWidth = '100%';
    if (data.verifyFrequency && data.detailUrl) {
      titleWidth = '75%';
    } else if (data.verifyFrequency || data.detailUrl) {
      titleWidth = '85%';
    }
    return (
      <div className="goods-detail">
        {window.top === window && (
          <div className="app-detail-header" style={{ borderBottom: 0 }}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item><a href="#/catering/list">商品管理</a></Breadcrumb.Item>
              <Breadcrumb.Item>商品详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        )}
        {
          loading && <Row style={{ textAlign: 'center', marginTop: 80 }}><Spin /></Row>
        }
        {
          !loading && (
            <div>
              <div className="kb-detail-main">
                {window.top === window && this.state.tipReason && renderAlert(data.status, this.state.tipReason, data.returnReason)}
                {(shopNumBefore !== undefined && shopNumAfter !== undefined && shopNumBefore !== shopNumAfter) || (changePriceBefore && changePriceAfter && changePriceBefore.price !== undefined && changePriceAfter.price !== undefined && changePriceBefore.price !== changePriceAfter.price)
                  ?
                  <div className="change-tips">
                    <p><span className="icon-wrapper"><Icon className="icon-info" type="info-circle" /></span>上海口碑服务商有限公司提醒你，修改了优惠／门店信息，请仔细核对后确认上架。</p>
                    {changePriceBefore && changePriceAfter && changePriceBefore.price !== undefined && changePriceAfter.price !== undefined && changePriceBefore.price !== changePriceAfter.price
                      ?
                      <div className="text">优惠修改：<span className="color-orange">{`原优惠价${changePriceBefore.price}元，修改为优惠价${changePriceAfter.price}元。`}</span></div>
                      :
                      null
                    }
                    {shopNumBefore !== undefined && shopNumAfter !== undefined && shopNumBefore !== shopNumAfter
                      ?
                      <div className="text">门店修改：<span className="color-orange">{`原${shopNumBefore}家适用门店，修改为${shopNumAfter}家适用门店。`}</span></div>
                      :
                      null
                    }
                  </div>
                  :
                  null
                }
                <div style={{ padding: '20px', background: '#f0f0f0' }}>
                  <h3 style={{ wordWrap: 'break-word', overflow: 'hidden' }}>
                    <span style={{ float: 'left', maxWidth: titleWidth, position: 'relative' }}>
                      {data.title}
                      {data.verifyFrequency === 'multi' ? (<span style={{ color: '#fff', background: '#2db7f5', padding: '4px', fontSize: '12px', marginLeft: '8px', borderRadius: '4px', float: 'left', marginTop: '5px', position: 'absolute', bottom: '4px', width: '92px' }}>可多次核销商品</span>) : null}
                    </span>
                    {data.detailUrl && <Button type="ghost" icon="qrcode" size="large" onClick={this.showQrcode} style={{ float: 'right', backgroundColor: '#fff', borderColor: '#0af', color: '#0af' }}>预览商品</Button>}
                  </h3>
                  {data.verifyFrequency === 'multi' ? (<p>原总价{data.originPrice}, 优惠总价{data.price}元</p>) : (<p>原价{data.originPrice}元，优惠价{data.price}元</p>)}
                  <p className="kb-repast-p">
                    {data.validTimeType === 'RELATIVE' && `购买后${data.rangeTo}天内有效`}
                    {data.validTimeType === 'FIXED' && data.validTimeFrom && `${data.validTimeFrom} ~ ${data.validTimeTo} 有效`}
                  </p>
                </div>
                <div style={{ padding: '20px', background: '#f0f0f0', display: 'none' }}>
                  <h4></h4>
                  <p>{data.shopIds ? `购买后${data.rangeTo}天内有效` : ''}</p>
                </div>
                <h3 className="kb-page-sub-title">基本信息</h3>
                <table className="kb-detail-table-6">
                  <tbody>
                    <tr>
                      <td className="kb-detail-table-label">商品类型</td>
                      <td>{TYPE_MAP[data.type]}</td>
                      <td className="kb-detail-table-label">商品名称</td>
                      <td>{data.title}</td>
                      <td className="kb-detail-table-label">商品价格</td>
                      <td>{data.verifyFrequency === 'multi' ? (<p>原总价{data.originPrice}, 优惠总价{data.price}元</p>) : (<p>原价{data.originPrice}元，优惠价{data.price}元</p>)}</td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">适用门店</td>
                      <td>
                        {data.shop && data.shop.length ? data.shop.length : '0'}家门店
                        <a onClick={this.showShopList}> 查看</a>
                      </td>
                      <td className="kb-detail-table-label">商品详情</td>
                      <td>
                        <a onClick={this.showShopDetails}>查看</a>
                      </td>
                      <td className="kb-detail-table-label">{data.verifyFrequency === 'multi' ? '包含商品数量' : ''}</td>
                      <td>{data.verifyFrequency === 'multi' ? <span>{data.verifyEnableTimes}份</span> : ''} </td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">所属类目</td>
                      <td>{data.categoryPathName || ''}</td>
                      <td className="kb-detail-table-label">商品首图</td>
                      <td>
                        {data.itemImage && data.itemImage[0] && <a onClick={this.handlePreview}><img src={getImageById(data.itemImage[0])} /></a>}
                      </td>
                      <td className="kb-detail-table-label">商品图片</td>
                      <td>
                        {(data.itemDetailImages || []).map((item, i) => <a key={i} onClick={this.previewImageShow(getImageById(item))}><img src={getImageById(item)} /></a>)}
                      </td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">商品 ID</td>
                      <td colSpan="5">{this.state.itemId || ''}</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="kb-page-sub-title">规则设置</h3>
                <table className="kb-detail-table-6">
                  <tbody>
                    <tr>
                      <td className="kb-detail-table-label">商品展示渠道</td>
                      <td>{data.displayChannels && CHANNELS_MAP[data.displayChannels]}</td>
                      <td className="kb-detail-table-label">核销方式</td>
                      <td>{data.ticketDisplayMode && CANCEL_MAP[data.ticketDisplayMode]}</td>
                      <td className="kb-detail-table-label">{data.ticketDisplayMode === 'EXTERNAL_TICKET_CODE' ? 'APPID' : '商品编码'}</td>
                      {data.ticketDisplayMode === 'EXTERNAL_TICKET_CODE' ? (
                        <td>{data.externalAppId || ''}</td>
                      ) : (
                        <td>{data.goodsIds && data.goodsIds.length > 0 &&
                          <div><span className="goodsIds-span">{data.goodsIds[0]}</span><a onClick={this.showGoodsId}>查看</a></div>}
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">发放总量</td>
                      <td>{data.totalAmount || '不限制'}</td>
                      <td className="kb-detail-table-label">有效期</td>
                      <td>
                        {data.validTimeType === 'RELATIVE' && `购买后${data.rangeTo}天内有效`}
                        {data.validTimeType === 'FIXED' && data.validTimeFrom && <div>{data.validTimeFrom} ~<br />{data.validTimeTo}</div>}
                      </td>
                      <td className="kb-detail-table-label">使用时段</td>
                      <td>{(data.availableTimes) ? formatAvailableVoucherTime(data.availableTimes) : '不限制'}</td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">不可用日期</td>
                      <td>{(data.forbiddenDates) ? formatForbiddenVoucherTime(data.forbiddenDates) : '不限制'}</td>
                      <td className="kb-detail-table-label">商品售卖时间</td>
                      <td colSpan={3}>
                        {data.salesPeriodStart && data.salesPeriodEnd ? `${data.salesPeriodStart} 至 ${data.salesPeriodEnd}` : '暂无'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="kb-page-sub-title">其他设置</h3>
                <table className="kb-detail-table-2">
                  <tbody>
                    <tr>
                      <td className="kb-detail-table-label">购买须知</td>
                      <td>{data && this.mapDetailInfoDom(data)}</td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">备注</td>
                      <td>{data.remark}</td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">最新通知</td>
                      <td>{data.latestNotices && data.latestNotices.map((d, i, arr) => <span key={i}>{d}{arr.length - 1 > i && <br />}</span>)}</td>
                    </tr>
                  </tbody>
                </table>
                <Modal
                  width="350"
                  title="二维码"
                  visible={!!this.state.visibleQrcode}
                  onCancel={this.cancelQrcode}
                  footer={false}
                  style={{ textAlign: 'center' }}
                >
                  <QRCode value={data.detailUrl} size={250} ref="qrCode" />
                  <p style={{ fontSize: 16, marginTop: 15 }}>请使用支付宝－扫一功能，<br />扫描二维码预览商品</p>
                </Modal>
                {this.state.allowApproval &&
                  <div style={{ marginTop: 30, textAlign: 'center' }}>
                    <div>
                      <Button
                        size={"large"}
                        type="primary"
                        style={{ marginRight: 12 }}
                        disabled={!this.state.protocalChecked || this.state.confirmed}
                        onClick={this.confirmOnline}
                        loading={this.state.isPostLoading}
                      >
                        同意上架
                      </Button>
                      <Button size={"large"} type="ghost" style={{ marginRight: 12, color: '#23C0FA' }} onClick={this.reject}>退回修改</Button>
                    </div>
                    <Checkbox checked={this.state.protocalChecked} onChange={this.onChange} >阅读并同意</Checkbox><a target="_blank" href="https://render.alipay.com/p/f/fd-j1g41yxx/index.html">《口碑商家协议》</a>
                  </div>
                }
                {this.state.allowOffline &&
                  <div style={{ marginTop: 30, textAlign: 'center' }}>
                    <Button
                      size="large"
                      type="primary"
                      style={{ marginRight: 12 }}
                      disabled={this.state.offlineSuccess || this.state.isPostLoading}
                      loading={this.state.isPostLoading}
                      onClick={this.offlineProd}
                    >
                      下架
                    </Button>
                  </div>
                }
              </div>
            </div>
          )
        }
        <RepastShopListModal
          visible={this.state.shopListModal}
          shops={data.shop}
          hide={this.cancelShopListModal}
        />
        <RejectedModal
          visible={this.state.returnModifyModal}
          onOk={this.confirmHandleOk}
          sequenceId={this.state.sequenceId}
          itemId={this.state.itemId}
          onCancel={this.confirmHandleCancel}
        />

        <ShopDetailsModal
          visible={shopDetailsModal}
          repastData={data}
          hide={this.cancelShopDetailsModal}
        />
        <Modal
          visible={this.state.previewImgShow}
          width={500}
          title="图片预览"
          footer={<Button type="ghost" onClick={this.hidePreviewImage}>关闭</Button>}
          maskClosable
          onCancel={this.hidePreviewImage}
          onOk={this.hidePreviewImage}
        ><img width="100%" src={this.state.previewImgUrl} /></Modal>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.previewCancel}
          width="750"
        >
          <div style={{ height: '345px', marginTop: '20px' }}>
            <div style={{ width: '56%', float: 'left' }}>
              <p style={{ fontSize: '16px' }}>4:3尺寸展示效果</p>
              <p>该图片将在<span style={{ color: '#f60' }}>商品详情页、商品列表页</span>进行展示</p>
              {data.itemImage && data.itemImage[0] && <div style={{ height: '301px', overflow: 'hidden' }}><img style={{ width: '100%' }} src={getImageById(data.itemImage[0])} /></div>}
            </div>
            <div style={{ width: '44%', float: 'left', paddingLeft: '15px' }}>
              <p style={{ fontSize: '16px' }}>1:1尺寸展示效果</p>
              <p>该图片将在<span style={{ color: '#f60' }}>淘抢购、聚划算、大牌抢购</span>等渠道展示</p>
              {data.taobaoCoverImage ? <div style={{ height: '301px', overflow: 'hidden' }}><img style={{ width: '100%' }} src={getImageById(data.taobaoCoverImage)} /></div> :
                <div style={{ textAlign: 'center', fontSize: '16px', color: '#999', paddingTop: '140px', backgroundColor: '#eee', height: '301px' }}>暂无图片</div>}
            </div>
          </div>
        </Modal>
        <Modal
          width="500"
          title="商品编码"
          visible={!!this.state.showGoodsModal}
          onCancel={this.cancelGoodsId}
          footer={false}
        >
          <div className="goods-ids-modal">
            {data.goodsIds && data.goodsIds.length > 0 && data.goodsIds.map((item, i) => <p key={i}>{item}</p>)}
          </div>
          {data.goodsIds && data.goodsIds.length > 0 && <div style={{ paddingTop: 10, fontSize: 13 }}>{`共${data.goodsIds.length}个商品编码`}</div>}
        </Modal>
        {
          this.state.showSignModal && (
            <ApplySignModal onlineTradePayRate={this.state.onlineTradePayRate}
              handleCancel={() => {
                this.setState({
                  showSignModal: false,
                });
              }}
              isCatering
              confirmOrderAgree={this.confirmOnlineSubmit}
            />
          )
        }
      </div>
    );
  }
}
export default RepastGoodsDetails;
