import React, { PropTypes } from 'react';
import { Breadcrumb, Tabs, Tag, Table, Row, Col, message } from 'antd';
import AlipayOperationLog from './AlipayOperationLog';
import AlipayApplyDetailModal from './AlipayApplyDetailModal';
import ajax from 'Utility/ajax';
import { appendOwnerUrlIfDev } from '../../../../common/utils';
import { format, formatTime } from '../../../../common/dateUtils';
import './alipayApplycationRecord.less';
// import permission from '@alipay/kb-framework/framework/permission';

const TabPane = Tabs.TabPane;
const STATUS = {
  // isv专用
  '502': '申请中',
  '503': '审核中',
  '504': '发货中',
  '501': '发货完毕',
  '500': '已驳回',
  // 转账码专用
  '600': '待制作',
  '601': '制作中',
  '602': '已寄送',
};

const AlipayApplyDetail = React.createClass({
  propTypes: {
    location: PropTypes.any,
    params: PropTypes.object,
    // form: PropTypes.object,
  },
  getInitialState() {
    const self = this;
    this.columns = [{
      title: '模板ID/名称',
      dataIndex: 'templateId',
      width: 210,
      render(text, record) {
        return (
          <a rel="noopener noreferrer" target="_blank" href={'#/material/templatemanage/alipaytempdetail/' + text}>{record.templateName}<br />{text}</a>
        );
      },
    }, {
      title: '物料属性/类型',
      dataIndex: 'stuffType',
      width: 250,
      render(text, record) {
        let stuffName;
        if (text === 'BASIC') {
          stuffName = (
            <div>{['基础物料', <br />, record.stuffAttrName]}</div>
          );
        }
        return stuffName;
      },
    }, {
      title: '物料材质/规格尺寸',
      dataIndex: 'materialName',
      width: 250,
      render(text, record) {
        return (
          <div>{[text, <br />, record.sizeName]}</div>
        );
      },
    }, {
      title: '申请数量',
      dataIndex: 'applyQuantity',
      width: 120,
    }, {
      title: '发货总量',
      dataIndex: 'alreadyPurchaseQuantity',
      width: 120,
    }, {
      title: '发货明细',
      dataIndex: 'stuffPurchaseItemDtoList',
      width: 150,
      render(text, record) {
        let stuffPurch;
        if (!text) {
          stuffPurch = (<span> - </span>);
        } else {
          stuffPurch = (
            <a onClick={self.showModal.bind(self, record.stuffPurchaseItemDtoList)}>{record.stuffPurchaseItemDtoList.length}条记录</a>
          );
        }
        return stuffPurch;
      },
    }];
    return {
      consignmentVisible: false,
      visible: false,
      // defaultActiveKey: '1',
      datailDatas: {},
      // modalType: '',
      fetchCatlogData: [],
      purchaseList: null,
    };
  },
  componentDidMount() {
    this.fetch();
    this.fetchCatlog();
  },
  // onchange(activeKey) {
  //   this.setState({
  //     defaultActiveKey: activeKey,
  //   });
  // },
  showModal(detail) {
    this.setState({visible: true});
    if (detail) {
      this.setState({
        purchaseList: detail,
      });
    }
  },
  cancel() {
    this.setState({
      visible: false,
    });
  },
  // 详情
  fetch() {
    const self = this;
    const params = {
      mappingValue: 'kbasset.queryApplyOrder',
      domain: 'ALIPAY',
      orderId: this.props.params.orderId, // this.props.params.orderId,
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
          self.setState({
            loading: false,
            data: result.data,
            datailDatas: result.data,
          });
        } else if (result.status === 'failed') {
          self.setState({loading: false});
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: () => {
        self.setState({
          loading: false,
          data: [],
        });
      },
    });
  },
  // 操作记录
  fetchCatlog() {
    const self = this;
    const params = {
      bizId: this.props.params.orderId, // this.props.params.orderId,
      bizType: 'STUFF_APPLY_ORDER ',
      mappingValue: 'kbasset.queryBizLog',
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      type: 'json',
      data: params,
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          self.setState({
            fetchCatlogData: result.data,
          });
        } else if (result.status === 'failed') {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: () => {
        self.setState({
          fetchCatlogData: [],
        });
      },
    });
  },
  refresh() {
    this.fetch();
    this.fetchCatlog();
    this.setState({
      visible: false,
    });
  },
  render() {
    const { datailDatas } = this.state;
    const bizSourceData = this.props.location.query.bizSource;
    return (
      <div className="kb-detail-main">
        <div className="kb-applyRecordManage">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="#/material/applicationManagement/applicationRecord/alipay">支付宝物料</Breadcrumb.Item>
            <Breadcrumb.Item>申请单详情</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Tabs
          defaultActiveKey="1"
          // tabBarExtraContent={(this.state.defaultActiveKey === '1') ? <Button onClick={this.showModal.bind(this, 'reject')} type="primary" disabled={(datailDatas.status !== 502)}>驳回</Button> : null}
          // onChange={this.onchange}
        >
          <TabPane tab="申请单详情" key="1">
            <div className="kb-applyRecordDetail">
              <Row className="kb-discount-header">
                <Col span="8">
                  <Tag color="green">申请状态：<span>{STATUS[datailDatas.status]}</span></Tag>
                  <div className="kb-applyPerson">申请人: <span style={{ paddingRight: '10px' }}>{datailDatas.storageName}</span>| 申请单号:<span className="kb-applyOrderId">{datailDatas.orderId}</span></div>
                  <div className="kb-applyTime">申请时间：{datailDatas.gmtCreate ? <span>{format(new Date(datailDatas.gmtCreate))} &nbsp; {formatTime(new Date(datailDatas.gmtCreate))}</span> : null}</div>
                </Col>
              </Row>
            </div>
            <br />
            <table className="kb-detail-table-6">
              <tbody>
                <tr>
                  <td className="kb-detail-table-label">{bizSourceData === 'TRANSFER_CODE' ? '商户名称/编号' : 'ISV名称/编号'}</td>
                  <td>{[datailDatas.storageName, <br />, datailDatas.storageCode]}</td>
                  <td className="kb-detail-table-label">收货地址</td>
                  <td>{datailDatas.receiverAddress ? datailDatas.receiverAddress : ''}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">收货人</td>
                  <td>{datailDatas.receiver ? datailDatas.receiver : ''}</td>
                  <td className="kb-detail-table-label">联系方式</td>
                  <td colSpan="3">{datailDatas.contactPhone ? datailDatas.contactPhone : ''}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">备注</td>
                  <td colSpan="5">{datailDatas.remark}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <Table columns={this.columns} rowKey={r => r.templateId} dataSource={this.state.datailDatas.stuffApplyItemDtoList} />
          </TabPane>
          <TabPane tab="操作记录" key="2">
            <AlipayOperationLog bizOrders={this.state.fetchCatlogData} />
          </TabPane>
        </Tabs>
        <AlipayApplyDetailModal bizSourceData={bizSourceData} visible={this.state.visible} onReturn={this.cancel} orderId={this.props.params.orderId} refresh={this.refresh} purchaseList={this.state.purchaseList} />
      </div>
    );
  },
});

export default AlipayApplyDetail;
