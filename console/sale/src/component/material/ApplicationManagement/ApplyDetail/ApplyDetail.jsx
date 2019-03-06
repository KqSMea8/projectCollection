import React, {PropTypes} from 'react';
import {Tabs, message, Tag, Table, Row, Col} from 'antd';
import OperationLog from './OperationLog';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import {format} from '../../../../common/dateUtils';
import {MaterialPropertiesMap, cutStr} from '../../common/MaterialLogMap';
import {hideFrameworkStyle} from '../../common/utils';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';
import PurchaseStorageDetailModalIndex from './PurchaseStorageDetailModalIndex';
import PageLayout from 'Library/PageLayout';

const TabPane = Tabs.TabPane;

const ApplyDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.any,
  },

  getInitialState() {
    const user = getLoginUser();
    const {userChannel} = user;
    this.user = user;
    this.isService = userChannel === 'BUC';// 是不是小二
    this.columns = [{
      title: '模板名称/ID',
      dataIndex: 'templateId',
      width: 210,
      render(text, record) {
        if (typeof text === 'undefined') {
          return '';
        }
        return (
          <div>
            <a target="_blank" href={'#/material/templatemanage/tempinfo/' + text}>{record.templateName}<br />{text}</a>
          </div>
          );
      },
    }, {
      title: '物料属性/类型',
      dataIndex: 'stuffAttrName',
      width: 150,
      render(text, record) {
        if (!text) {
          return '';
        }
        return [MaterialPropertiesMap[record.stuffType], <br />, text];
      },
    }, {
      title: '物料材质/规格尺寸',
      dataIndex: 'sizeName',
      width: 200,
      render(text, record) {
        if (!text) {
          return '';
        }
        return [record.materialName, <br />, text];
      },
    }, {
      title: '申请数量',
      dataIndex: 'applyQuantity',
      width: 150,
      render(t) {
        return [t, <span>&nbsp;</span>, '件'];
      },
    }, {
      title: '采购数量',
      dataIndex: 'assignQuantity',
      width: 150,
      render(t) {
        if (t === 0) {
          return <span>未采购</span>;
        } else if (t > 0) {
          return <span>{t}</span>;
        }
      },
    }, {
      title: '入库总量',
      dataIndex: 'inStockTotalQuantity',
      width: 150,
    }, {
      title: '入库明细',
      dataIndex: 'itemTotal',
      width: 150,
      render(text, record) {
        if (record.stuffInStockItemDtoList && record.stuffInStockItemDtoList.length > 0) {
          return (<span>
                      <PurchaseStorageDetailModalIndex itemTotal={record.stuffInStockItemDtoList.length} stuffInStockItemVOList={record.stuffInStockItemDtoList} stuffPurchaseItemVOList={record.stuffPurchaseItemDtoList}/>
                    </span>);
        }
        return '-';
      },
    }];
    return {
      data: {
        'data': {
          'stuffApplyItemDtoList': {
          },
        },
      },
// 获取当前 城市/KA/云纵 本月已审批金额(元)
      monthCheckedAmount: '',
      loading: true,
      visible: false,
      fetchCatlogData: [],
      datailDatas: {},
      operatorId: '',
    };
  },

  componentDidMount() {
    if (this.props.location.query.isframe) {
      hideFrameworkStyle();
    }
    this.fetch();
    this.fetchCatlog();
  },

// 获取当前 城市/KA/云纵 本月已审批金额(元)
  getMonthCheckedAmount(fetchResult) {
    const params = {
      storageCode: fetchResult.storageCode,
      storageType: fetchResult.storageType,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/cityMonthAmount.json'),
      data: params,
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            monthCheckedAmount: cutStr(result.data.amount.toString()),
          });
        }
      },
      error: () => {
        message.error('查询当前城市本月已审批金额异常', 3);
        this.setState({
          monthCheckedAmount: 0,
        });
      },
    });
  },
  fetch() {
    const params = {
      mappingValue: 'kbasset.queryApplyOrder',
      domain: 'KOUBEI',
      orderId: this.props.params.orderId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.getMonthCheckedAmount(result.data);
          this.setState({
            loading: false,
            data: result.data,
            datailDatas: result.data,
            operatorId: result.operatorId,
          });
        } else {
          this.setState({loading: false});
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (e) => {
        message.error('服务器繁忙' || e.resultMsg);
      },
    });
  },
  fetchCatlog() {
    const params = {
      bizId: this.props.params.orderId,
      bizType: 'STUFF_APPLY_ORDER',
      mappingValue: 'kbasset.queryBizLog',
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      type: 'json',
      data: params,
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            fetchCatlogData: result.data,
          });
        } else if (result.status === 'failed') {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
    });
  },

  endStock(orderId) {
    const params = {
      orderId: orderId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/stuffStockActionEndInStock.json'),
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          message.success('结束入库操作成功');
          this.fetch();
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
    });
  },
  renderHeader(data, datailDatas) {
    let statu;
    let color = 'green';
    if (datailDatas.status === 800 ) {
      statu = (<span>待审核</span>);
      color = 'blue';
    } else if (datailDatas.status === 801 ) {
      statu = (<span>审核不通过</span>);
      color = 'red';
    } else if (datailDatas.status === 802 ) {
      statu = (<span>审核通过</span>);
    } else if (datailDatas.status === 803 ) {
      statu = (<span>采购发货中</span>);
    } else if (datailDatas.status === 804 ) {
      statu = (<span>发货完成</span>);
    } else if (datailDatas.status === 805 ) {
      statu = (<span>收货完成</span>);
    }
    return (<div style={{backgroundColor: '#f9f9f9', padding: '20px'}}><Row className="kb-discount-header">
                  <Col span="10">
                    <div style={{color: '#666', fontSize: '14px', paddingBottom: '5px'}}>申请单号:{data.orderId}</div>
                    {
                      data.storageType === 'CT' ? <div style={{color: '#666', fontSize: '14px', paddingBottom: '5px'}}>申请人:{data.applicant}  | 申请城市:{data.storageName}</div> :
                      <div style={{color: '#666', fontSize: '14px', paddingBottom: '5px'}}>申请人:{data.applicant} | 申请单位:{data.storageName} </div>
                    }
                    {data.gmtCreate && [<div style={{color: '#999'}}>申请时间：{format(new Date(data.gmtCreate))}</div>]}
                    <Tag color={color}>申请状态：{ statu }</Tag>
                    {data.status === 801 && <div style={{color: 'red', fontSize: '14px', paddingBottom: '5px'}}>{data.remark}</div>}
                  </Col>
                </Row></div>);
  },
  renderInfo(data) {
    const addressInfoDto = data.addressInfoDto || {provinceName: null, cityName: null, districtName: null, address: null, receiver: null, contactPhone: null};
    const {receiver, contactPhone, address, districtName, cityName, provinceName} = addressInfoDto;
    const add = provinceName + cityName + districtName + address;
    return (<table className="kb-detail-table-6">
                  <tbody>
                    <tr>
                      <td className="kb-detail-table-label">收货人姓名</td>
                      <td>{receiver}</td>
                      <td className="kb-detail-table-label">联系电话</td>
                      <td>{contactPhone} </td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">收货地址</td>
                      <td colSpan="3">{add}</td>
                    </tr>
                  </tbody>
                </table>);
  },
  render() {
    const {data, loading, fetchCatlogData, datailDatas} = this.state;
    const {stuffApplyItemDtoList} = data;
    const breadcrumb = [
      {title: '申请单管理', link: '#/material/applicationManagement/applicationRecord'},
      {title: '详情'}
    ];
    return (
      <PageLayout breadcrumb={breadcrumb}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="申请单详情" key="1">
            <div>
              {
                loading || (
                  <div>
                    {
                      this.renderHeader(data, datailDatas)
                    }
                    <br/>
                    {
                      this.renderInfo(datailDatas)
                    }
                    <br/>
                    <Table columns={this.columns} dataSource={stuffApplyItemDtoList}/>
                  </div>
                )
              }
            </div>
          </TabPane>
          <TabPane tab="操作记录" key="2">
            <div>
              <OperationLog bizOrders={fetchCatlogData}/>
            </div>
          </TabPane>
        </Tabs>
      </PageLayout>
    );
  },
});
export default ApplyDetail;
