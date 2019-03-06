/* **
* 购买型代金券详情页 *
*/
import '../goods.less';
import React, { PropTypes } from 'react';
import { Tabs, Row, Tag, message, Spin, Breadcrumb } from 'antd';
import OperationLog from '../common/OperationLog';
import ajax from '@alipay/kb-ajax';
import { statusMap, statusColorMap, ticketDisplayModeMap, statusMapV2, statusColorMapV2 } from '../common/GoodsConfig';
import permission from '@alipay/kb-framework/framework/permission';
import ShopListLabel from './ShopListLabel';
import OfflineShelfGoods from './OfflineShelfGoods';
import { formatBuyVoucherCouponTime, formatUsefulTime } from '../common/utils';
import { getQueryFromURL } from '../../../common/utils';

const TabPane = Tabs.TabPane;
const reducetoStyle = { display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#000', opacity: 0.6, color: '#fff', fontSize: '16px', position: 'absolute', left: '0px', bottom: '0px' };

function openImageInNewWindow(e) {
  if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.url) {
    window.top.open(e.currentTarget.dataset.url, '_blank');
  }
}

const Buyvouchersdetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      isV2: getQueryFromURL(this.props.location.search).v2 === 'true',
      data: {},
      kbData: {},
      loading: true,
      shopDetailsModal: false,
    };
  },
  componentDidMount() {
    this.fetch();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.setState({
        isV2: getQueryFromURL(this.props.location.search).v2 === 'true',
      });
    }
  },
  // 如果图片的数量大于9张则显示前9张
  getPictures(data) {
    const items = [];
    if (data.pictureDetails && (data.pictureDetails || []).length > 0) {
      const chcheItems = data.pictureDetails.lenght > 9 ? data.pictureDetails.slice(0, 9) : data.pictureDetails;
      for (let i = 0; i < chcheItems.length; i++) {
        items.push(<a href={chcheItems[i]} target="_blank">
          <img src={chcheItems[i]} className="kb-detail-img" />
        </a>);
      }
    }
    return items;
  },
  showShopDetails() {
    this.setState({
      shopDetailsModal: true,
    });
  },
  cancelShopDetailsModal() {
    this.setState({
      shopDetailsModal: false,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      itemId: this.props.params.itemId,
      ...pageParams,
    };
    this.setState({
      loading: true,
    });
    const url = window.APP.crmhomeUrl + (this.state.isV2 ? '/goods/koubei/itemDetailV2.json' : '/goods/koubei/itemDetail.json');
    ajax({
      url: url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          const obj = {};
          obj.opMerchantId = result.kbItemVO.partnerId;
          obj.type = result.kbItemVO.typeDisplay;
          obj.callback = this.fetch;
          Object.assign(this.props.params, obj);
          this.setState({
            loading: false,
            data: result.data,
            kbData: result.kbItemVO,
          });
        } else {
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
          this.setState({
            loading: false,
          });
        }
      },
    });
  },

  hasOfflinePermission() {
    return this.state.isV2 && permission('ONLINE_TRADE_PAY_ITEM_INVALID')
    || !this.state.isV2 && permission('TRADE_VOUCHER_ITEM_OFFLINE');
  },

  /* eslint-disable complexity */
  render() {
    /* eslint-enable complexity */
    const { data, kbData, loading, isV2 } = this.state;
    let inventory = isV2 ? (+kbData.totalInventory - (+data.salesQuantity)) : kbData.totalInventory;
    if (isNaN(inventory) || inventory < 0) {
      inventory = '';
    }

    const panels = [(
      <TabPane tab="详情" key="discount">
        <div className="kb-discount-detail">
          <Row className="kb-discount-header" >
            <div
              style={{
                float: 'left', position: 'relative', width: '128px', height: '122px',
                backgroundSize: 'cover', backgroundImage: 'url(' + (data.logoFileId && data.logoFileId) + ')',
                cursor: 'pointer',
              }}
              onClick={openImageInNewWindow}
              data-url={data.logoFileId && data.logoFileId || ''}
            >
              <span style={reducetoStyle}>
                <p style={{ lineHeight: '18px', height: '18px', fontSize: '12px' }}>购买价：{data.price ? data.price.amount : '-'} 元</p>
                <p style={{ lineHeight: '18px', height: '18px', fontSize: '12px' }}>券面额：{data.originalPrice ? data.originalPrice.amount : '-'} 元</p>
              </span>
            </div>
            <div className="kb-discount-count">
              <p className="kb-bottom-line">已领：<span className="kb-discount-amount">{data.salesQuantity}</span></p>
              <p>{isV2 && '剩余'}库存：<span className="kb-discount-amount">{inventory}</span></p>
            </div>
            <div className="kb-discount-baseinfo">
              {data.subject}
              {kbData.visibility === 'WHITELIST' ? <span style={{ marginLeft: '5px' }}><Tag color="yellow">测</Tag></span> : ''}
              <span style={{ marginLeft: '5px' }}>
                <Tag color={(isV2 ? statusColorMapV2 : statusColorMap)[kbData.statusDisplay]}>
                  {(isV2 ? statusMapV2 : statusMap)[kbData.statusDisplay] || kbData.statusDisplay}
                </Tag>
              </span>
              <p>商品ID：{data.itemId}</p>
            </div>
          </Row>
          <table className="kb-detail-table-6">
            <tbody>
              <tr>
                <td className="kb-detail-table-label">商品标题</td>
                <td>{data.subject || '-'}</td>
                <td className="kb-detail-table-label">商品类目</td>
                <td>{data.categoryId || '-'}</td>
                <td className="kb-detail-table-label">权重</td>
                <td>{data.cashInfo && data.cashInfo.weight || '-'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">商户名称</td>
                <td>{kbData.partnerName || '-'}</td>
                <td className="kb-detail-table-label">ISV名称</td>
                <td>{data.isvName || '-'}</td>
                <td className="kb-detail-table-label">是否支持随时退</td>
                <td>{data.anytimeRefund === true ? '是' : '否'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">商户PID</td>
                <td>{kbData.partnerId || '-'}</td>
                <td className="kb-detail-table-label">ISVPID</td>
                <td>{data.isvPid || '-'}</td>
                <td className="kb-detail-table-label">是否支持过期退</td>
                <td>{data.expiredRefund === true ? '是' : '否'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">上下架时间</td>
                <td>{data.startTime} 至 <br />{data.endTime}</td>
                <td className="kb-detail-table-label">券有效期</td>
                <td>{formatBuyVoucherCouponTime(data)}</td>
                <td className="kb-detail-table-label">使用时段</td>
                <td>{formatUsefulTime(data.availableTimeType, data.availableTimeValue, data.availableTimeValues)}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">列表图片</td>
                <td>
                  {data.listShowImg &&
                    <a href={data.listShowImg && data.listShowImg} target="_blank"><img src={data.listShowImg && data.listShowImg} className="kb-detail-img" /></a>
                  }
                </td>
                <td className="kb-detail-table-label">券logo</td>
                <td>{data.voucherLogo && <a href={data.voucherLogo && data.voucherLogo} target="_blank"><img src={data.voucherLogo && data.voucherLogo} className="kb-detail-img" /></a>}</td>
                <td className="kb-detail-table-label">详情图片</td>
                <td>
                  {
                    (data.activityImgs || []).map((p) => {
                      return <a href={p} target="_blank"><img src={p} className="kb-detail-img" /></a>;
                    })
                  }
                </td>
              </tr>
              {isV2 && (
                <tr>
                  <td className="kb-detail-table-label">核销方式</td>
                  <td colSpan="5">
                    {ticketDisplayModeMap[data.settleMode] || '-'}
                  </td>
                </tr>
              )}
              <tr>
                <td className="kb-detail-table-label">适合门店</td>
                <td colSpan="5">
                  {(data.shopIds && data.cityShop && data.shopIds.length > 0) ? <ShopListLabel shopLen={data.shopIds.length} shopList={data.cityShop} /> : ''}
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">使用须知</td>
                <td colSpan="5">
                  {
                    (data.descList || []).map((p, index) => {
                      return <p>{(index + 1) + '. ' + p}</p>;
                    })
                  }
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">备注</td>
                <td colSpan="5">{data.name === '--' ? '-' : (data.name || '-')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabPane>
    )];
    if (!isV2) {
      panels.push(
        <TabPane tab="操作日志" key="operationlog">
          <OperationLog goodsId={this.props.params.itemId} />
        </TabPane>
      );
    }
    return (
      <div>
        {
          loading && <Row style={{ textAlign: 'center', marginTop: 80 }}><Spin /></Row>
        }
        {
          !loading && (
            <div className="kb-detail-main">
              <div className="clearfix">
                <div className="detail-float-left">
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item key="1">{isV2 ? '查询商品' : '购买型代金券'}</Breadcrumb.Item>
                    <Breadcrumb.Item key="2">详情</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <div className="kb-button-list">
                  {this.hasOfflinePermission() && (['PAUSE', 'READY_TO_ONLINE', 'ONLINE'].indexOf(data.itemStatus) !== -1)
                  ? <OfflineShelfGoods isV2={!!isV2} text={isV2 ? '删除商品' : undefined} params={this.props.params} /> : ''}
                </div>
              </div>
              <Tabs defaultActiveKey="discount">
                {panels}
              </Tabs>
            </div>
          )
        }
      </div>
    );
  },
});

export default Buyvouchersdetail;
