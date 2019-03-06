import React from 'react';
import { message, Checkbox, Spin, Row, Modal, Button } from 'antd';
import ajax from '../../../common/ajax';
import { getUriParam } from '../../../common/utils';
import { format } from '../../../common/dateUtils';
import ShopListModal from './ShopListModal';
import { noop } from 'lodash';

const GoodDetail = React.createClass({
  getInitialState() {
    return {
      data: [],
      loading: true,
      shopListModal: false,
      leadsId: this.props.leadsId || getUriParam('leadsId', this.props.history.search),
      previewImgUrl: undefined,   // 图片预览 url
      previewImgIsShow: false,    // 图片预览是否显示
    };
  },

  componentDidMount() {
    this.fetch();
    if (window.top !== window) {
      window.top.postMessage(JSON.stringify({ action: 'scrollTop', scrollTop: 0 }), '*');
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.state.leadsId !== nextProps.leadsId) {
      this.setState({
        leadsId: nextProps.leadsId,
      });
    }
  },
  componentDidUpdate() {
    if (window !== window.top) {
      window.top.postMessage(JSON.stringify({
        action: 'iframeHeight',
        height: document.body.clientHeight,
      }), '*');
    }
  },
  fetch() {
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leads/getItemLeadsById.json`,
      method: 'get',
      data: { leadsId: this.state.leadsId },
      useIframeProxy: true,
      contentType: 'application/x-www-form-urlencoded; charset=utf-8',
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            loading: false,
            data: result.data,
          });
        } else {
          this.setState({ loading: false });
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
      error: () => {
        this.setState({ loading: false });
      },
    });
  },
  showShopList() {
    this.setState({
      shopListModal: true,
    });
  },
  cancelShopListModal() {
    this.setState({
      shopListModal: false,
    });
  },
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
  },
  previewImg(url) {
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
  },
  hidePreview() {
    this.setState({
      previewImgIsShow: false,
    });
  },
  render() {
    const { data, loading } = this.state;
    let categoryDisplayName = data.categoryDisplayName || '';
    if (data.categoryNamePath && data.categoryNamePath.length > 1) {
      const newPath = [...data.categoryNamePath];
      newPath.pop();
      categoryDisplayName = `${newPath.join('-')}-${categoryDisplayName}`;
    }
    return (<div>
      {
        loading && <Row style={{ textAlign: 'center', marginTop: 80 }}><Spin /></Row>
      }
      {
        !loading && (
          <div>
            <div className="kb-detail-main">
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
                    <td>原价 {data.oriPrice} 元，优惠价 {data.price} 元</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">适用门店</td>
                    <td>
                      {data.saleShopCount} 家门店
                      <a onClick={this.showShopList}>查看</a>
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
                    <td>{categoryDisplayName}</td>
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
              {
                this.props.isShow && this.state.data.relatedVoucherItemId ? (<div style={{ marginTop: '128px' }}>
                  <Checkbox checked={this.props.delLeads.some(d => d === this.state.data.relatedVoucherItemId)} onChange={(e) => {
                    this.props.addDelLeadsId(e, this.state.data.relatedVoucherItemId);
                  }}>将名下同类券／商品进行下架</Checkbox>
                  <a target="_blank" href={`/goods/itempromo/detail.htm?itemId=${this.state.data.relatedVoucherItemId}`}>查看同类券</a>
                </div>) : null
              }
            </div>

          </div>
        )
      }
      <ShopListModal
        shopListModal={this.state.shopListModal}
        leadsId={this.state.leadsId}
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
  },

});

export default GoodDetail;
