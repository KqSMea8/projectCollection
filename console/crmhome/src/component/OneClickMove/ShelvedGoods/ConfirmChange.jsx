import React from 'react';
import { message, Spin, Row, Col, Modal, Button, Icon } from 'antd';
import ajax from '../../../common/ajax';
import { saveJumpTo } from '../../../common/utils';
import { format } from '../../../common/dateUtils';
import ShopListModal from './ConfirmChangeShopListModal';
import { noop } from 'lodash';

class ConfirmChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      oldVersion: false,
      latestConfirmOrderId: '',
      changeInfo: {},
      loading: true,
      confirming: false,
      shopListModalVisible: false,
      // confirmOrderId: props.location.query.confirmOrderId,
      previewImgUrl: undefined,   // 图片预览 url
      previewImgIsShow: false,    // 图片预览是否显示
    };
  }

  componentDidMount() {
    this.requestItemInfo(this.props.location.query.confirmOrderId);
  }
  // componentWillReceiveProps(nextProps) {
  //   if (this.props.location.query.confirmOrderId !== nextProps.location.query.confirmOrderId) {
  //     this.setState({
  //       confirmOrderId: nextProps.location.query.confirmOrderId,
  //     });
  //     this.requestItemInfo(nextProps.location.query.confirmOrderId);
  //   }
  // }
  componentDidUpdate(prevProps) {
    if (window !== window.top) {
      window.top.postMessage(JSON.stringify({
        action: 'iframeHeight',
        height: document.body.clientHeight,
      }), '*');
    }
    if (prevProps.location.query.confirmOrderId !== this.props.location.query.confirmOrderId) {
      this.requestItemInfo(this.props.location.query.confirmOrderId);
    }
  }
  requestItemInfo(confirmOrderId) {
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leadschange/confirmorder/queryDetail.json`,
      method: 'get',
      data: { confirmOrderId },
      useIframeProxy: true,
      contentType: 'application/x-www-form-urlencoded; charset=utf-8',
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          const { data = {} } = result;
          const { itemDetail, oldVersion, latestConfirmOrderId, confirmOrderItemLeadsChange} = data;
          this.setState({
            loading: false,
            data: itemDetail,
            oldVersion,
            latestConfirmOrderId,
            changeInfo: confirmOrderItemLeadsChange,
          });
        } else {
          this.setState({ loading: false });
          message.error((result && result.resultMsg) || '请求商品信息失败', 3);
        }
      },
      error: () => {
        this.setState({ loading: false });
      },
    });
  }
  showShopList = () => {
    this.setState({
      shopListModalVisible: true,
    });
  }
  cancelShopListModal = () => {
    this.setState({
      shopListModalVisible: false,
    });
  }
  mapDetailInfoDom(data) {
    const Dom = [];
    data.map((value, index) => {
      Dom.push(<div key={index}>
        <p>{value.title}</p>
        <p>{value.details && value.details.map((c, i) => {
          return (<p>{value.details[i]}</p>);
        })}</p>
      </div>);
    });
    return Dom;
  }
  previewImg = (url) => {
    if (!url) return noop;
    return (e) => {
      if (e) {
        e.preventDefault();
      }
      this.setState({
        previewImgUrl: url,
        previewImgIsShow: true,
      });
    };
  }
  hidePreview = () => {
    this.setState({
      previewImgIsShow: false,
    });
  }
  showConfirmChangeModal = () => {
    Modal.confirm({
      title: '是否确认上架该商品？',
      content: '',
      onOk: (close) => {close(); this.confirmChange();},
    });
  }
  confirmChange = () => {
    this.setState({confirming: true});
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leadschange/confirmorder/pass.json`,
      // url: 'http://pickpost.alipay.net/mock/kb-crmhome/item/leadschange/confirmorder/pass.json',
      method: 'post',
      data: { confirmOrderId: this.props.location.query.confirmOrderId },
      useIframeProxy: true,
      contentType: 'application/x-www-form-urlencoded; charset=utf-8',
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            confirming: false,
          });
          saveJumpTo('#/oneclickmove-generic/confirmsuccess');
        } else {
          this.setState({
            confirming: false,
          });
          message.error((result && result.resultMsg) || '上架失败，请稍后重试', 3);
        }
      },
      error: (result) => {
        if (result && result.resultCode === 'ITEM_IN_LOCK') {
          Modal.warning({
            title: '该商品已参与平台活动，暂不支持修改。',
            content: '如需修改，请先将商品退出平台活动，再进行操作。',
            okText: '知道了',
          });
        } else {
          message.error((result && result.resultMsg) || '上架失败，请稍后重试', 3);
        }
        this.setState({
          confirming: false,
        });
      },
    });
  }
  /* eslint-disable complexity */
  render() {
    const { data = {}, changeInfo = {}, loading, shopListModalVisible, oldVersion, latestConfirmOrderId, confirming } = this.state;
    const { origDiscountPrice, changeDiscountPrice, origSaleShopsCount, changeSaleShopsCount } = changeInfo;
    const { itemId, viewStatus } = data;
    let price = data.price;
    if (viewStatus === 'COMPLETED' && changeDiscountPrice) {
      price = changeDiscountPrice;
    }
    let footerBtn = null;
    if (itemId && viewStatus === 'WAIT_TO_AUDIT') {
      footerBtn = oldVersion
        ?
        <Button key="submit" type="ghost" size="large" onClick={() => {saveJumpTo(`#/oneclickmove-generic/confirmchange?confirmOrderId=${latestConfirmOrderId}`);}}>
          该消息已更新，点此查看最新内容
        </Button>
        :
        <Button key="submit" type="primary" size="large" disabled={confirming} onClick={this.showConfirmChangeModal}>
          确认上架
        </Button>;
    }
    const isPriceChanged = changeDiscountPrice && Number(changeDiscountPrice) < Number(origDiscountPrice);
    const isShopChanged = changeSaleShopsCount > 0;
    let priceChange = null;
    let shopChange = null;
    if (viewStatus === 'COMPLETED') {
      priceChange = changeDiscountPrice ? <div className="text">优惠修改：<span className="color-orange">{`修改后优惠价${changeDiscountPrice}元。`}</span></div> : null;
      shopChange = changeSaleShopsCount > 0 ? <div className="text">门店修改：<span className="color-orange">{`修改后新增${changeSaleShopsCount}家适用门店。`}</span></div> : null;
    } else {
      priceChange = isPriceChanged ? <div className="text">优惠修改：<span className="color-orange">{`原优惠价${origDiscountPrice}元，修改后优惠价${changeDiscountPrice}元。`}</span></div> : null;
      shopChange = isShopChanged ? <div className="text">门店修改：<span className="color-orange">{`原${origSaleShopsCount}家适用门店，修改后新增${changeSaleShopsCount}家适用门店。`}</span></div> : null;
    }
    return (<div>
      {
        loading && <Row style={{ textAlign: 'center', marginTop: 80 }}><Spin /></Row>
      }
      {
        !loading && (
          <div>
            <div className="kb-detail-main">
              {priceChange || shopChange ? <div className="transaction-tips">
                <p><span className="icon-wrapper"><Icon className="icon-info" type="info-circle" /></span>{data.viewStatus === 'COMPLETED' ? '已确认商品修改内容并同意上架' : '上海口碑服务商有限公司提醒你，修改了优惠／门店信息，请仔细核对后确认上架。'}</p>
                {priceChange}
                {shopChange}
              </div> : null}

              <div style={{ padding: '20px', background: '#f0f0f0', display: data.subject ? 'block' : 'none' }}>
                <h4>{data.subject}</h4>
                <p>{data.validDays ? `购买后${data.validDays}天内有效` : ''}</p>
              </div>
              <h3 className="kb-page-sub-title">基本信息</h3>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">商品类型</td>
                    <td>在线购买商品</td>
                    <td className="kb-detail-table-label">商品名称</td>
                    <td>{data.subject}</td>
                    <td className="kb-detail-table-label">优惠方式</td>
                    <td>原价 {data.oriPrice} 元，优惠价 {price} 元</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">适用门店</td>
                    <td>
                      {data.saleShopCount || 0} 家门店
                      {oldVersion ? null : <a onClick={this.showShopList}>查看</a>}
                    </td>
                    <td className="kb-detail-table-label">发放总量</td>
                    <td>{data.inventory || '不限制'}</td>
                    <td className="kb-detail-table-label">上架时间</td>
                    <td>{data.gmtUpShelf ? format(new Date(data.gmtUpShelf)) : '商户确认后即时上架'}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">商品首图</td>
                    <td>
                      <a onClick={this.previewImg(data.coverImageUrl && data.coverImageUrl.replace('&amp;', '&'))}>
                        <img src={data.coverImageUrl && data.coverImageUrl.replace('&amp;', '&')} />
                      </a>
                    </td>
                    <td className="kb-detail-table-label">商品图片</td>
                    <td>
                      {data.detailImageUrls && data.detailImageUrls.length > 0 &&
                        (data.detailImageUrls || []).map((p) => {
                          return (
                            <a onClick={this.previewImg(p.replace(/&amp;/g, '&'))} key={p}>
                              <img src={p.replace(/&amp;/g, '&')} />
                            </a>
                          );
                        })
                      }</td>
                    <td className="kb-detail-table-label">有效期</td>
                    <td>购买后 {data.validDays} 日内有效</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">所属类目</td>
                    <td>{data.categoryNamePath && data.categoryNamePath.join('-')}</td>
                    <td className="kb-detail-table-label"></td>
                    <td></td>
                    <td className="kb-detail-table-label"></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <h3 className="kb-page-sub-title">其他设置</h3>
              <table className="kb-detail-table-2">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">详细内容</td>
                    <td>{data.detailInfo && this.mapDetailInfoDom(data.detailInfo)}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">购买须知</td>
                    <td>{data.buyerNotes && this.mapDetailInfoDom(data.buyerNotes)}</td>
                  </tr>
                </tbody>
              </table>
              <Row>
                <Col span="10" offset="7">
                  <div style={{textAlign: 'center', marginTop: '50px'}}>
                    {footerBtn}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )
      }
      <ShopListModal
        shopListModal={shopListModalVisible}
        itemId={itemId}
        confirmOrderId={this.props.location.query.confirmOrderId}
        viewStatus={viewStatus}
        cancelShopListModal={this.cancelShopListModal} />
      <Modal
        footer={<div><Button type="ghost" onClick={this.hidePreview}>关闭</Button></div>}
        visible={this.state.previewImgIsShow}
        title="图片预览"
        maskClosable
        onCancel={this.hidePreview}
        width={500}
      >
        <img src={this.state.previewImgUrl} width="100%" />
      </Modal>
    </div>
    );
  }
  /* eslint-disable complexity */
}

export default ConfirmChange;
