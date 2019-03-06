import React from 'react';
import { Tabs, Row, Tag, message, Breadcrumb } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from 'Utility/ajax';
import { statusMap, statusColorMap, statusMapV2, statusColorMapV2, ticketDisplayModeMap } from '../common/GoodsConfig';
import OperationLog from '../common/OperationLog';
import OfflineShelfGoods from './OfflineShelfGoods';
import '../goods.less';
import ShopListLabel from './ShopListLabel';
import { getQueryFromURL, getImageById } from '../../../common/utils';
import { formatUsefulTime, formatForbiddenTime, formatBuyVoucherCouponTime, formatActivityLinks } from '../common/utils';
import PackageDeatailModal from './Modals/PackageDeatailModal';

const TabPane = Tabs.TabPane;
const verifyFrequencyMap = {
  single: '单次核销商品',
  multi: '多次核销商品',
};

function openImageInNewWindow(e) {
  if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.url) {
    window.top.open(e.currentTarget.dataset.url, '_blank');
  }
}

const ShelfGoodsDetail = React.createClass({
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

  // 商品详情和使用须知公用
  getNotesChildren(children) {
    if (!children || !children.length) {
      return '-';
    }
    const items = [];
    if (children) {
      for (let i = 0; i < children.length; i++) {
        items.push(<p>.{children[i]}</p>);
      }
    }
    return items;
  },

  // 商品详情和使用须知公用
  getNotes(notes) {
    const items = [];
    if (notes) {
      for (let i = 0; i < notes.length; i++) {
        items.push(<div><p style={{ color: '#878787' }}>{notes[i].title}</p>{this.getNotesChildren(notes[i].details)}</div>);
      }
    }
    return items;
  },

  getRecentNotes(notes) {
    if (!notes || !notes.length) {
      return '-';
    }
    let content = '';
    content = (notes || []).map((item) => (
      item.type === 'SYS_LATEST_NOTICE' &&
      <div>
        <p>{item.title}</p>
        {item.details &&
          (item.details || []).map(subItem => {
            return <p>{subItem}</p>;
          })
        }
      </div>
    ));
    return content;
  },
  // 如果图片的数量大于9张则显示前9张
  getPictures(data) {
    const items = [];
    if (data.pictureDetails && (data.pictureDetails || []).length > 0) {
      const chcheItems = data.pictureDetails.lenght > 9 ? data.pictureDetails.slice(0, 9) : data.pictureDetails;
      for (let i = 0; i < chcheItems.length; i++) {
        items.push(<a href={chcheItems[i].replace(/&amp;/g, '&')} target="_blank">
          <img src={chcheItems[i].replace(/&amp;/g, '&')} className="kb-detail-img" />
        </a>);
      }
    }
    if (typeof data.taobaoCoverImage === 'string') {
      items.push(
        <a href={getImageById(data.taobaoCoverImage)} target="_blank">
          <img src={getImageById(data.taobaoCoverImage)} className="kb-detail-img" />
        </a>
      );
    }
    return items;
  },

  // 价格的显示方式
  getMoneyStyle(data, reducetoStyle, moneyStyle) {
    if (data.priceMode === 'FLOAT') {
      return <span style={moneyStyle}>最低价:{data.price ? data.price : ''}元</span>;
    } else if (data.priceMode === 'FIX' && data.price) {
      return (<div style={reducetoStyle}>
        <p style={{ fontSize: '13px', lineHeight: '20px', height: '20px' }}>优惠价:{data.price} 元</p>
        <p style={{ fontSize: '12px', lineHeight: '12px' }}>原价:{data.originalPrice ? data.originalPrice : ''} 元</p>
      </div>);
    } else if (data.priceMode === 'FIX') {
      return <span style={moneyStyle}>原价:{data.originalPrice ? data.originalPrice : ''}元</span>;
    }
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
          // 把obj对象合并到this.props.params上
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

  /*eslint-disable */
  render() {
    /*eslint-disable */
    const { data, kbData, shopDetailsModal, isV2 = false } = this.state;
    const reducetoStyle = { display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#000', opacity: 0.6, color: '#fff', fontSize: '16px', position: 'absolute', left: '0px', bottom: '0px' };
    const moneyStyle = Object.assign(reducetoStyle, { lineHeight: '37px', height: '37px', fontSize: '12px' });
    const boughtStyle = { textAlign: 'right', width: '120px', display: 'inline-block' };
    const panels = [(
      <TabPane tab="详情" key="1">
        <div className="kb-discount-detail">
          <Row className="kb-discount-header" >
            <div
              style={{
                float: 'left', position: 'relative', width: '128px', height: '122px',
                backgroundSize: 'cover', backgroundImage: 'url(' + (data.cover && data.cover.replace(/&amp;/g, '&')) + ')',
                cursor: 'pointer',
              }}
              data-url={data.cover && data.cover.replace(/&amp;/g, '&') || ''}
              onClick={openImageInNewWindow}
            >
              {this.getMoneyStyle(data, reducetoStyle, moneyStyle)}
            </div>
            <div className="kb-discount-count">
              <p className="kb-bottom-line">已购买：<span style={boughtStyle}>{data.salesQuantity}</span></p>
              <p>剩余库存：<span className="kb-discount-amount">{data.inventory}</span></p>
            </div>
            <div className="kb-discount-baseinfo">
              {kbData.subject}{data.priceMode === 'FIX' ? '【固定价商品】' : '【浮动价商品】'}
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
                <td>{data.weight && data.weight || '-'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">商户名称</td>
                <td>{kbData.partnerName}</td>
                <td className="kb-detail-table-label">ISV名称</td>
                <td>{data.isvName || '-'}</td>
                <td className="kb-detail-table-label">是否支持随时退</td>
                <td>{data.anytimeRefund === true ? '是' : '否'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">商户PID</td>
                <td>{data.partnerId}</td>
                <td className="kb-detail-table-label">ISVPID</td>
                <td>{data.isvPid || '-'}</td>
                <td className="kb-detail-table-label">是否支持过期退</td>
                <td>{data.expiredRefund === true ? '是' : '否'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">券有效期</td>
                <td>{formatBuyVoucherCouponTime(data)}</td>
                <td className="kb-detail-table-label">使用时段</td>
                <td>{formatUsefulTime(data.availableTimeType, data.availableTimeValue, data.availableTimeValues)}</td>
                <td className="kb-detail-table-label">不可用时间段</td>
                <td>{formatForbiddenTime(data.unavailableTimeType, data.unavailableTimeValues)}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">商品图片</td>
                <td>
                  {this.getPictures(data)}
                </td>
                <td className="kb-detail-table-label">商品详情</td>
                <td>
                  <a onClick={this.showShopDetails}>查看详情</a>
                </td>
                <td className="kb-detail-table-label">上下架时间</td>
                <td>{data.gmtStart} 至 <br /> {data.gmtEnd}</td>
              </tr>
              {data.verifyFrequency && data.verifyEnableTimes && (
                <tr>
                  <td className="kb-detail-table-label">商品可核销频度</td>
                  <td>{verifyFrequencyMap[data.verifyFrequency] || ''}</td>
                  <td className="kb-detail-table-label">商品可核销次数</td>
                  <td colSpan={3}>{data.verifyEnableTimes} 次</td>
                </tr>
              )}
              <tr>
                <td className="kb-detail-table-label">适合门店</td>
                <td colSpan="5">
                  {(data.cityShop && (data.cityShop || []).length > 0) ? <ShopListLabel shopLen={data.cityShop.length} shopList={data.cityShop} /> : ''}
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">使用须知</td>
                <td colSpan="5">{this.getNotes(data.buyerNotes)}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">备注</td>
                <td colSpan="5">{data.memo || '-'}</td>
              </tr>
              {isV2 && (
                <tr>
                  <td className="kb-detail-table-label">核销方式</td>
                  <td colSpan="5">{ticketDisplayModeMap[data.settleMode] || '-'}</td>
                </tr>
              )}
              {isV2 && (
                <tr>
                  <td className="kb-detail-table-label">商品编码</td>
                  <td colSpan="5">{(data.skuIds || []).join('、') || '-'}</td>
                </tr>
              )}
              <tr>
                <td className="kb-detail-table-label">最新通知</td>
                <td colSpan="5">{this.getRecentNotes(data.detailInfos)}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">当前参与活动</td>
                <td colSpan="5">{data.activities && data.activities.length === 0 ? '-' : formatActivityLinks(data, 'current')}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">历史参与活动</td>
                <td colSpan="5">{data.historyActivities && data.historyActivities.length === 0 ? '-' : formatActivityLinks(data, 'history')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabPane>
    )];
    if (!isV2) {
      panels.push(
        <TabPane tab="操作记录" key="2">
          <OperationLog goodsId={this.props.params.itemId} />
        </TabPane>
      );
    }
    return (
      <div className="kb-detail-main">
        <div className="clearfix">
          {isV2 ? (
            <Breadcrumb separator=">">
              <Breadcrumb.Item>查询商品</Breadcrumb.Item>
              <Breadcrumb.Item>详情</Breadcrumb.Item>
            </Breadcrumb>
          ) : '货架商品'}
          <div className="kb-button-list">
            {this.hasOfflinePermission() && (data.itemStatus === 'PAUSE' || data.itemStatus === 'EFFECTIVE')
              ? <OfflineShelfGoods isV2={!!isV2} params={this.props.params} text={isV2 ? '删除商品' : undefined} /> : ''}
          </div>
        </div>
        <Tabs defaultActiveKey="1">
          {panels}
        </Tabs>

        <PackageDeatailModal
          visible={shopDetailsModal}
          resData={data}
          hide={this.cancelShopDetailsModal}
        />
      </div>
    );
  },
});

export default ShelfGoodsDetail;
