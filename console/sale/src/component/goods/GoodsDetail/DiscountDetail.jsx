import '../goods.less';
import React, { PropTypes } from 'react';
import { Button, Tabs, Row, Tag, message, Spin, Breadcrumb } from 'antd';
import OperationLog from '../common/OperationLog';
import ajax from 'Utility/ajax';
import { statusMap, autoWipingZeroMap, activedMap, statusColorMap } from '../common/GoodsConfig';
import { formatUsefulTime } from '../common/utils';
import permission from '@alipay/kb-framework/framework/permission';
import OfflineAction from './OfflineAction';
import OnlineAction from './OnlineAction';
import ShopListLabel from './ShopListLabel';
import UserGroupLabel from '../common/UserGroupLabel';

const TabPane = Tabs.TabPane;
const PAY_CHANNEL = {
  '1': '不限制',
  '2': '限储值卡付款可享',
  '3': '储值卡付款不可享',
};

const DiscountDetail = React.createClass({
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
  getLimited(isDay) {
    const {data} = this.state;
    let rtn = '不限制';
    if (data.useMode === '1') {
      rtn = data[isDay ? 'dayParticipateLimited' : 'participateLimited'] || '不限制';
    } else {
      rtn = data[isDay ? 'dayReceiveLimited' : 'receiveLimited'] || '不限制';
    }
    return rtn;
  },
  forwardToModifyPage() {
    const {itemId, opMerchantId, type} = this.props.params;
    window.open('index.htm#goods/modify/' + itemId + '/' + opMerchantId + '/' + type);
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
                    <Breadcrumb.Item key="1" >全场折扣</Breadcrumb.Item>
                    <Breadcrumb.Item key="2" >详情</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <div className="kb-button-list">
                  {permission('ITEM_MODIFY') && kbData.allowModify ? <Button type="primary" onClick={this.forwardToModifyPage}>修改商品</Button> : ''}
                  {permission('ITEM_TEST_ONLINE') && kbData.allowModifyVisibility ? <OnlineAction params={this.props.params} /> : ''}
                  {permission('ITEM_OFFLINE') && kbData.allowOffLine ? <OfflineAction params={this.props.params} /> : ''}
                </div>
              </div>
              <Tabs defaultActiveKey="discount">
                <TabPane tab="详情" key="discount">
                  <div className="kb-discount-detail">
                    <Row className="kb-discount-header" >
                      <div className="kb-discount-num">
                        {data.rate}<span className="kb-discount-sub">折</span>
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
                          <td className="kb-detail-table-label">自动续期</td>
                          <td>{data.renewMode === '1' ? '是' : '否'}</td>
                          <td className="kb-detail-table-label">最低消费限制</td>
                          <td>{data.minimumAmount ? data.minimumAmount + '元' : '不限制'}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">商户PID</td>
                          <td>{kbData.partnerId}</td>
                          <td className="kb-detail-table-label">领取生效</td>
                          <td>{activedMap[data.actived]}</td>
                          <td className="kb-detail-table-label">最高优惠限制</td>
                          <td>{data.displayAmount ? data.displayAmount + '元' : '不限制'}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">上下架时间</td>
                          <td>{data.startTime} 至 <br />{data.endTime}</td>
                          <td className="kb-detail-table-label">领用人群限制</td>
                          <td><UserGroupLabel type={data.allowUseUserGroup || '0'} /></td>
                          <td className="kb-detail-table-label">{data.allowUseUserGroup === '2' ? '指定生日日期' : ''}</td>
                          <td>{data.allowUseUserGroup === '2' && `${data.birthDateFrom} - ${data.birthDateTo}`}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">{data.useMode === '1' ? '参与' : '领取'}限制</td>
                          <td>{this.getLimited(false)}</td>
                          <td className="kb-detail-table-label">每日{data.useMode === '1' ? '参与' : '领取'}限制</td>
                          <td>{this.getLimited(true)}</td>
                          <td className="kb-detail-table-label">支付渠道限制</td>
                          <td>{PAY_CHANNEL[data.payChannel] || '不限制'}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">
                            {data.useMode === '1' ? '每日使用上限' : '每日发放上限'}
                          </td>
                          <td>{data.dayAvailableNum === '--' ? '不限制' : data.dayAvailableNum}</td>
                          <td className="kb-detail-table-label">自动抹零</td>
                          <td>{autoWipingZeroMap[data.roundingMode]}</td>
                          <td className="kb-detail-table-label">使用方式</td>
                          <td>{data.useMode === '1' ? '无需用户领取' : '需要用户领取'}</td>
                        </tr>
                        <tr>
                          <td className="kb-detail-table-label">使用时段</td>
                          <td>{formatUsefulTime(data.availableTimeType, data.availableTimeValue, data.availableTimeValues)}</td>
                          <td className="kb-detail-table-label">适用范围</td>
                          <td>{data.applicableScope}</td>
                          <td className="kb-detail-table-label">适合门店</td>
                          <td>{(data.shopIds && data.cityShop && data.shopIds.length > 0) ? <ShopListLabel shopLen={data.shopIds.length} shopList={data.cityShop} /> : ''}</td>
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
                          <td colSpan="5">{data.name === '--' ? '' : data.name}</td>
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

export default DiscountDetail;
