import '../goods.less';
import React, { PropTypes } from 'react';
import { Tabs, Row, Tag, message, Spin, Breadcrumb } from 'antd';
import OperationLog from '../common/OperationLog';
import ajax from 'Utility/ajax';
import { statusMap, statusColorMap } from '../common/GoodsConfig';
import permission from '@alipay/kb-framework/framework/permission';
import OfflineAction from './OfflineAction';
import OnlineAction from './OnlineAction';
import ShopListLabel from './ShopListLabel';
import { formatCouponTime } from '../common/utils';
import ExternalSingleProductListLabel from './ExternalSingleProductListLabel';
import UserGroupLabel from '../common/UserGroupLabel';
import { formatUsefulTime } from '../common/utils';

const TabPane = Tabs.TabPane;
const reducetoStyle = { display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#000', opacity: 0.6, color: '#fff', fontSize: '16px', position: 'absolute', left: '0px', bottom: '0px' };
const moneyStyle = Object.assign({ lineHeight: '37px', height: '37px' }, reducetoStyle);
const PAY_CHANNEL = {
  '1': '不限制',
  '2': '限储值卡付款可享',
  '3': '储值卡付款不可享',
};
const SingleVouchersDetail = React.createClass({
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
  /*eslint-disable */
  render() {
    /*eslint-enable */
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
                    <Breadcrumb.Item key="1" >
                      {data.cashType === 'CASH_MONEY' ? <span>单品优惠 - 代金券</span> : <span>单品优惠 - 换购券</span>}
                    </Breadcrumb.Item>
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
                        {data.cashType !== 'CASH_MONEY' ? (
                          <span style={reducetoStyle}>
                            <p style={{ fontSize: '16px' }}>优惠价：{(data.cashInfo && data.cashInfo.reduceToAmount) && data.cashInfo.reduceToAmount.amount} 元</p>
                            <p style={{ fontSize: '12px' }}>原价：{(data.cashInfo && data.cashInfo.originalAmount) && data.cashInfo.originalAmount.amount} 元</p>
                          </span>
                        ) : (<span style={moneyStyle}>立减{data.valueAmount}元</span>)}
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
                          <td className="kb-detail-table-label">外部单品列表</td>
                          <td>{(data.goodsIds && data.goodsIds.length > 0) ? <ExternalSingleProductListLabel singleProductList={data.goodsIds} /> : ''}</td>
                          <td className="kb-detail-table-label">客户端展现顺序</td>
                          <td>{data.cashInfo && data.cashInfo.weight}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">商户名称</td>
                          <td>{kbData.partnerName}</td>
                          <td className="kb-detail-table-label">单日领取限制(份)</td>
                          <td>{data.dayAvailableNum === '--' ? '不限制' : data.dayAvailableNum}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">商户PID</td>
                          <td>{kbData.partnerId}</td>
                          <td className="kb-detail-table-label">领取人群限制</td>
                          <td><UserGroupLabel type={data.allowUseUserGroup || '0'} /></td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">上下架时间</td>
                          <td>{data.startTime} 至 <br />{data.endTime}</td>
                          <td className="kb-detail-table-label">使用方式</td>
                          <td>{data.useMode === '1' ? '无需用户领取' : '需要用户领取'}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">券有效期</td>
                          <td>{formatCouponTime(data)}</td>
                          <td className="kb-detail-table-label">自动续期</td>
                          <td>{data.renewMode === '1' ? '是' : '否'}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">适合门店</td>
                          <td>
                            {(data.shopIds && data.cityShop && data.shopIds.length > 0) ? <ShopListLabel shopLen={data.shopIds.length} shopList={data.cityShop} /> : ''}
                          </td>
                          <td className="kb-detail-table-label">使用时段</td>
                          <td>{formatUsefulTime(data.availableTimeType, data.availableTimeValue, data.availableTimeValues)}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">商品详情</td>
                          <td>
                            {
                              (data.activityImgs || []).map((p) => {
                                return <a href={p.replace(/&amp;/g, '&')}><img src={p.replace(/&amp;/g, '&')} className="kb-detail-img" /></a>;
                              })
                            }
                            <div className="kb-detail-goods-info">
                              <p>{data.activityName}</p>
                              {data.activityLink && <a href={data.activityLink}>{data.activityLink}</a>}
                            </div>
                          </td>
                          <td className="kb-detail-table-label">支付渠道限制</td>
                          <td>{PAY_CHANNEL[data.payChannel] || '不限制'}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">使用须知</td>
                          <td colSpan="3">
                            {
                              (data.descList || []).map((p, index) => {
                                return <p>{(index + 1) + '. ' + p}</p>;
                              })
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">备注</td>
                          <td colSpan="3">{data.name === '--' ? '' : data.name}</td>
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

export default SingleVouchersDetail;
