import '../goods.less';
import React, {PropTypes} from 'react';
import {Tabs, Row, Tag, message, Spin, Breadcrumb } from 'antd';
import OperationLog from '../common/OperationLog';
import ajax from 'Utility/ajax';
import {formatCouponTime, formatUsefulTime} from '../common/utils';
import ShopListLabel from './ShopListLabel';
import {autoWipingZeroMap} from '../common/GoodsConfig';


const TabPane = Tabs.TabPane;

const NormalVouchersDetail = React.createClass({
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
          this.setState({loading: false});
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
          loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
        }

        {
          !loading && (
            <div className="kb-detail-main">
              <div className="clearfix">
              <div className="detail-float-left">
                <Breadcrumb separator=">">
                  <Breadcrumb.Item key="1" >全场代金券</Breadcrumb.Item>
                  <Breadcrumb.Item key="2" >详情</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              </div>
              <Tabs defaultActiveKey="discount">
                <TabPane tab="详情" key="discount">
                  <div className="kb-discount-detail">
                    <Row className = "kb-discount-header" >
                      <div style={{float: 'left', position: 'relative', width: '128px', height: '122px', backgroundSize: 'cover', backgroundImage: 'url(' + (data.logoFileId && data.logoFileId.replace(/&amp;/g, '&')) + ')'}}></div>
                      <div className = "kb-discount-baseinfo">
                          {data.subject}
                          {kbData.visibility === 'WHITELIST' ? <span style={{marginLeft: '5px'}}><Tag color="yellow">测</Tag></span> : ''}
                          <p>商品ID：{data.itemId}</p>
                      </div>
                    </Row>
                    <table className="kb-detail-table-6">
                      <tbody>
                        <tr>
                          <td className = "kb-detail-table-label">商户名称</td>
                          <td>{kbData.partnerName}</td>
                          <td className = "kb-detail-table-label">券SLOGAN</td>
                          <td>{data.sloganFixValue}</td>
                          <td className = "kb-detail-table-label">最低消费限制</td>
                          <td>{data.minimumAmount ? data.minimumAmount + '元' : '不限制'}</td>
                        </tr>
                        <tr>
                          <td className = "kb-detail-table-label">商户PID</td>
                          <td>{kbData.partnerId}</td>
                          <td className = "kb-detail-table-label">券面额</td>
                          <td>
                            {data.displayAmount}
                          </td>
                          <td className = "kb-detail-table-label">有效期</td>
                          <td>{formatCouponTime(data)}</td>
                        </tr>
                        <tr>
                          <td className = "kb-detail-table-label">券的总数量</td>
                          <td>{data.budgetAmount}</td>
                          <td className = "kb-detail-table-label">{data.useMode === '1' ? '每日使用上限' : '每日发放上限'}</td>
                          <td>{data.dayAvailableNum === '--' ? '不限制' : data.dayAvailableNum}</td>
                          <td className = "kb-detail-table-label">活动ID</td>
                          <td>{data.activityId}</td>
                        </tr>
                        <tr>
                          <td className = "kb-detail-table-label">出资方式</td>
                          <td>{data.investType === '0' ? '口碑补贴' : '商户出资'}</td>
                          <td className = "kb-detail-table-label">自动抹零</td>
                          <td>{autoWipingZeroMap[data.roundingMode]}</td>
                          <td className = "kb-detail-table-label"></td>
                          <td></td>
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
                          <td className = "kb-detail-table-label">使用时段</td>
                          <td colSpan = "5">
                            {
                              (data.availableTimeValues || []).map((availableTimeValue) => {
                                return <p>{formatUsefulTime(data.availableTimeType, availableTimeValue)}</p>;
                              })
                            }
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

export default NormalVouchersDetail;
