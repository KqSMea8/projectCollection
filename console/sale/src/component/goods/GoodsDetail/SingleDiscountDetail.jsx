import '../goods.less';
import React, { PropTypes } from 'react';
import { Tabs, Row, Tag, message, Spin, Breadcrumb } from 'antd';
import OperationLog from '../common/OperationLog';
import ajax from 'Utility/ajax';
import { statusMap, statusColorMap } from '../common/GoodsConfig';
import { formatUsefulTime, formatLimit, formatCouponTime } from '../common/utils';
import permission from '@alipay/kb-framework/framework/permission';
import OfflineAction from './OfflineAction';
import OnlineAction from './OnlineAction';
import ShopListLabel from './ShopListLabel';
import GoodsCodeLabel from './GoodsCodeLabel';
import UserGroupLabel from '../common/UserGroupLabel';

const TabPane = Tabs.TabPane;
const PAY_CHANNEL = {
  '1': '不限制',
  '2': '限储值卡付款可享',
  '3': '储值卡付款不可享',
};
const SingleDiscountDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      data: {},
      kbData: {},
      loading: true,
    };
  },
  componentDidMount() {
    this.fetch();
  },
  fetch(pageParams = {}) {
    const params = {
      itemId: this.props.params.itemId,
      ...pageParams,
    };
    this.setState({
      loading: true,
    });
    const url = window.APP.crmhomeUrl + '/goods/koubei/itemDetail.json';
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
          this.setState({ loading: false });
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },
  render() {
    const {data, kbData, loading} = this.state;
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
                    <Breadcrumb.Item key="1" >单品优惠-折扣</Breadcrumb.Item>
                    <Breadcrumb.Item key="2" >详情</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <div className="kb-button-list">
                  {permission('ITEM_TEST_ONLINE') && kbData.allowModifyVisibility ? <OnlineAction params={this.props.params} /> : ''}
                  {permission('ITEM_OFFLINE') && kbData.allowOffLine ? <OfflineAction params={this.props.params} /> : ''}
                </div>
              </div>
              <Tabs defaultActiveKey="discount">
                <TabPane tab="详情" key="discount">
                  <div className="kb-discount-detail">
                    <Row className="kb-discount-header" >
                      <div style={{ float: 'left', position: 'relative', width: '128px', height: '122px', backgroundSize: 'cover', backgroundImage: 'url(' + (data.logoFileId && data.logoFileId.replace(/&amp;/g, '&')) + ')' }}>
                        <span style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#000', opacity: 0.6, color: '#fff', height: '37px', lineHeight: '37px', fontSize: '16px', position: 'absolute', left: '0px', bottom: '0px' }}>{data.rate}折</span>
                      </div>
                      <div className="kb-discount-count">
                        <p className="kb-bottom-line">已领：<span className="kb-discount-amount">{data.salesQuantity}</span></p>
                        <p>库存：<span className="kb-discount-amount">{kbData.totalInventory}</span></p>
                      </div>
                      <div className="kb-discount-baseinfo">
                        {data.subject}
                        {kbData.visibility === 'WHITELIST' ? <span style={{ marginLeft: '5px' }}><Tag color="yellow">测</Tag></span> : ''}
                        <span style={{ marginLeft: '5px' }}>
                          <Tag color={statusColorMap[kbData.statusDisplay]}>{statusMap[kbData.statusDisplay] || kbData.statusDisplay}</Tag>
                        </span>
                        <p>商品ID：{data.itemId}</p>
                      </div>
                    </Row>
                    <table className="kb-detail-table-6">
                      <tbody>
                        <tr>
                          <td className="kb-detail-table-label">商户名称</td>
                          <td>{kbData.partnerName}</td>
                          <td className="kb-detail-table-label">使用方式</td>
                          <td>{data.useMode === '1' ? '无需用户领取' : '需要用户领取'}</td>
                          <td className="kb-detail-table-label">使用时段</td>
                          <td>{formatUsefulTime(data.availableTimeType, data.availableTimeValue, data.availableTimeValues)}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">商户PID</td>
                          <td>{kbData.partnerId}</td>
                          <td className="kb-detail-table-label">券有效期</td>
                          <td>
                            {formatCouponTime(data)}
                          </td>
                          <td className="kb-detail-table-label">{data.useMode === '1' ? '参与限制' : '领取限制'}</td>
                          <td>
                            {formatLimit(data)}
                          </td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">上下架时间</td>
                          <td>{data.startTime} 至 <br />{data.endTime}</td>
                          <td className="kb-detail-table-label">商品编码</td>
                          <td>{data.goodsIds && data.goodsIds.length > 0 ? <GoodsCodeLabel goodsCodeList={data.goodsIds} /> : null}</td>
                          <td className="kb-detail-table-label">领用人群限制</td>
                          <td><UserGroupLabel type={data.allowUseUserGroup || '0'} /></td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">适合门店</td>
                          <td>
                            {(data.shopIds && data.cityShop && data.shopIds.length > 0) ? <ShopListLabel shopLen={data.shopIds.length} shopList={data.cityShop} /> : ''}
                          </td>
                          <td className="kb-detail-table-label">支付渠道限制</td>
                          <td colSpan="3">{PAY_CHANNEL[data.payChannel] || '不限制'}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">使用条件</td>
                          <td colSpan="5">同一件商品满{data.minItemNum}件可享受优惠，且该商品最高优惠{data.maxDiscountItemNum}件</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">商品详情</td>
                          <td colSpan="5">
                            {
                              (data.activityImgs || []).map((p) => {
                                return <a href={p.replace(/&amp;/g, '&')}><img src={p.replace(/&amp;/g, '&')} className="kb-detail-img" /></a>;
                              })
                            }
                            <div className="kb-detail-goods-info">
                              <p>{data.activityName}</p>
                              <a href={data.activityLink}>{data.activityLink}</a>
                            </div>
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
                      </tbody>
                    </table>
                  </div>
                </TabPane>
                <TabPane tab="操作日志" key="operationlog">
                  <OperationLog goodsId={this.props.params.itemId} />
                </TabPane>
              </Tabs>
            </div>
          )
        }
      </div>
    );
  },
});

export default SingleDiscountDetail;
