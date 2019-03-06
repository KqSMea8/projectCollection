import '../goods.less';
import React, {PropTypes} from 'react';
import {Tabs, Row, Tag, message, Spin, Breadcrumb } from 'antd';
import OperationLog from '../common/OperationLog';
import ajax from 'Utility/ajax';
import {statusMap, activedMap, statusColorMap} from '../common/GoodsConfig';
import {formatUsefulTime, formatEachUserReceivedLimitNum} from '../common/utils';
import permission from '@alipay/kb-framework/framework/permission';
import OfflineAction from './OfflineAction';
import OnlineAction from './OnlineAction';
import ShopListLabel from './ShopListLabel';
import {formatCouponTime} from '../common/utils';


const TabPane = Tabs.TabPane;
const ExclusiveSalesCouponDetail = React.createClass({
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
        if (!result ) {
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
          this.setState({loading: false});
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
          loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
        }
        {
          !loading && (
          <div className="kb-detail-main">
            <div className="clearfix">
              <div className="detail-float-left">
                <Breadcrumb separator=">">
                  <Breadcrumb.Item key="1" >包销劵</Breadcrumb.Item>
                  <Breadcrumb.Item key="2" >详情</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="kb-button-list">
                {permission('ITEM_TEST_ONLINE') && kbData.allowModifyVisibility ? <OnlineAction params={this.props.params}/> : ''}
                {permission('ITEM_OFFLINE') && kbData.allowOffLine ? <OfflineAction params={this.props.params}/> : ''}
              </div>
            </div>
            <Tabs defaultActiveKey="discount">
              <TabPane tab="详情" key="discount">
                <div className="kb-discount-detail">
                  <Row className = "kb-discount-header" >
                    <div className = "kb-discount-num">
                      <span className="kb-discount-sale" style={{fontSize: '32px'}}>{data.rate}折</span>
                    </div>
                    <div className = "kb-discount-count">
                      <p className = "kb-bottom-line">已领：<span className="kb-discount-amount">{data.salesQuantity}</span></p>
                      <p>库存：<span className="kb-discount-amount">{kbData.totalInventory}</span></p>
                    </div>
                    <div className = "kb-discount-baseinfo">
                      {data.subject}
                        {kbData.visibility === 'WHITELIST' ? <span style={{marginLeft: '5px'}}><Tag color="yellow">测</Tag></span> : ''}
                        <span style={{marginLeft: '5px'}}>
                          <Tag color={statusColorMap[kbData.statusDisplay]}>{statusMap[kbData.statusDisplay] || kbData.statusDisplay}</Tag>
                        </span>
                      <p>商品ID：{data.itemId}</p>
                    </div>
                  </Row>
                  <table className="kb-detail-table-6">
                    <tbody>
                      <tr>
                        <td className = "kb-detail-table-label">商户名称</td>
                        <td>{kbData.partnerName}</td>
                        <td className = "kb-detail-table-label">领取生效</td>
                        <td>{activedMap[data.actived]}</td>
                        <td className = "kb-detail-table-label">最低消费限制</td>
                        <td>{data.minimumAmount ? data.minimumAmount + '元' : '不限制'}</td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">商户PID</td>
                        <td>{kbData.partnerId}</td>
                        <td className = "kb-detail-table-label">领用人群限制</td>
                        <td>{data.allowUseUserGroup === '1' ? <Tag color="yellow">学生</Tag> : '全部用户'}</td>
                        <td className = "kb-detail-table-label">最高优惠限制</td>
                        <td>{data.displayAmount ? data.displayAmount + '元' : '不限制'}</td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">上下架时间</td>
                        <td>{data.startTime} 至 <br/>{data.endTime}</td>
                        <td className = "kb-detail-table-label">使用时段</td>
                        <td>{formatUsefulTime(data.availableTimeType, data.availableTimeValue, data.availableTimeValues)}</td>
                        <td className = "kb-detail-table-label">{data.useMode === '1' ? '每日使用上限' : '每日发放上限'}</td>
                        <td>{data.dayAvailableNum === '--' ? '不限制' : data.dayAvailableNum}</td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">每个用户<br/>领取数量限制</td>
                        <td>{formatEachUserReceivedLimitNum(data.contractedInfo)}</td>
                        <td className = "kb-detail-table-label">券有效期</td>
                        <td>{formatCouponTime(data)}</td>
                        <td className = "kb-detail-table-label">最低消费限制</td>
                        <td>{data.minimumAmount ? data.minimumAmount + '元' : '不限制'}</td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">券是否允许转让</td>
                        <td colSpan = "5">{data.donateFlag === '1' ? '是' : '否'}</td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">使用方式</td>
                        <td colSpan = "5">{data.useMode === '1' ? '无需用户领取' : '需要用户领取'}</td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">适用范围</td>
                        <td colSpan = "5">{data.applicableScope}</td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">适合门店</td>
                        <td colSpan = "5">
                          {(data.shopIds && data.cityShop && data.shopIds.length > 0) ? <ShopListLabel shopLen={data.shopIds.length} shopList={data.cityShop}/> : ''}
                        </td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">使用须知</td>
                        <td colSpan = "5">
                          {
                            (data.descList || []).map((p, index) => {
                              return <p>{(index + 1) + '. ' + p}</p>;
                            })
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className = "kb-detail-table-label">备注</td>
                        <td colSpan = "5">{data.name === '--' ? '' : data.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabPane>
              <TabPane tab="操作日志" key="operationlog">
                <OperationLog goodsId={this.props.params.itemId}/>
              </TabPane>
            </Tabs>
          </div>
          )
        }
      </div>
    );
  },
});

export default ExclusiveSalesCouponDetail;
