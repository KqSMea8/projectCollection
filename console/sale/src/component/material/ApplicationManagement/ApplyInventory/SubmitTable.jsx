import React, {PropTypes} from 'react';
import {Table, message, Row, Col, Button} from 'antd';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import ajax from '@alipay/kb-framework/framework/ajax';
import TableActions from '../../common/TableAction';
import {MaterialPropertiesMap} from '../../common/MaterialLogMap';
import {format} from '../../../../common/dateUtils';
// import {cutStr} from '../../common/MaterialLogMap';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';
function abstractData(data) {
  return data.map(({orderId, itemId})=>({
    orderId,
    itemId,
  }));
}
function getNumber(arr) {
  let num = 0;
  arr.map((val)=>{
    num = val.applyQuantity + num;
  });
  return num;
}
const KASelect = React.createClass({
  propTypes: {
    chosenData: PropTypes.object,
  },
  mixins: [TableActions],
  getInitialState() {
    const user = getLoginUser();
    const {userChannel} = user;
    this.user = user;
    this.isService = userChannel === 'BUC';// 是不是小二
    let colTitle = '申请单位／时间';
    if (this.isService) {
      colTitle = '申请城市／时间';
    }
    this.columns = [
      {
        title: '申请单号',
        dataIndex: 'orderId',
      }, {
        title: colTitle,
        dataIndex: 'storageName',
        render(text, record) {
          return (<div>
          {text}<br/>
          {format(new Date(record.gmtCreate))}
          </div>);
        },
      }, {
        title: '收货人／地址／电话',
        dataIndex: 'receiver',
        render(text, record) {
          const {provinceName, cityName, districtName, receiverAddress} = record;
          const add = provinceName + cityName + districtName + receiverAddress;
          return (<div>
          {record.receiver}<br/>
          {add}<br/>
          {record.contactPhone}
          </div>);
        },
      }, {
        title: '申请数量',
        dataIndex: 'applyQuantity',
      },
    ];
    return {
      submitting: false,
      showModal: false,
      loading: true,
      tableData: [],
      detailData: {},
      selectedCheckbox: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
    };
  },
  componentWillMount() {
    const {produceOrderId} = this.props.chosenData;
    const params = {
      mappingValue: 'kbasset.queryProduceOrderDetail',
      domain: 'KOUBEI',
      produceOrderId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            assignedQuantity: result.data.assignedQuantity,
            detailData: {
              produceOrderId,
              ...result.data,
            },
          });
          this.refresh();
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (e) => {
        message.error(e.resultMsg || '系统繁忙请稍后');
      },
    });
  },
  onSelectChange(selectedRowKeys, selectedRows) {
    const num = getNumber(selectedRows);
    if (num > this.state.detailData.stockQuantity) {
      message.error('库存不足');
    }
    this.setState({
      selectedCheckbox: selectedRows,
    });
  },
  fetch(pageParams = {}) {
    const {produceOrderId} = this.props.chosenData;
    const {templateId, materialCode} = this.state.detailData;
    const params = {
      mappingValue: 'kbasset.pageQueryApplyItem',
      domain: 'KOUBEI',
      produceOrderId,
      templateId,
      materialCode,
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = result.data.totalSize;
          this.setState({
            loading: false,
            operatorId: result.operatorId,
            tableData: result.data.data || [],
            pagination,
          });
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (e) => {
        message.error(e.resultMsg || '系统繁忙请稍后');
        const pagination = {...this.state.pagination};
        pagination.total = 0;
        this.setState({
          loading: false,
          data: [],
          pagination,
        });
      },
    });
  },
  handleSubmit() {
    const itemIds = abstractData(this.state.selectedCheckbox);
    const {produceOrderId} = this.props.chosenData;
    const params = {
      mappingValue: 'kbasset.updateProduceAndItem',
      domain: 'KOUBEI',
      produceOrderId,
      itemIds: JSON.stringify(itemIds),
    };
    this.setState({
      submitting: true
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('提交成功');
          window.location.hash = '#/material/applicationManagement/applicationRecord';
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (e) => {
        this.setState({submitting: false});
        message.error(e.resultMsg || '提交失败');
      },
    });
  },
  renderBanner(data) {
    return ( <div style={{backgroundColor: '#f9f9f9', padding: '20px', marginBottom: '20px'}}>
    <Row className="kb-discount-header">
                  <Col span="14">
                    <div style={{color: '#666', fontSize: '14px', paddingBottom: '5px'}}>采购单号:{data.produceOrderId}</div>
                    <div style={{color: '#666', fontSize: '14px', paddingBottom: '5px'}}>采购员:{data.purchaserName}</div>
                    <div style={{color: '#666', fontSize: '14px', paddingBottom: '5px'}}>采购时间:{format(new Date(data.gmtCreate))}</div>
                  </Col>
                  <Col span="6">
                    <div style={{display: 'inline-block', padding: '0px 20px', textAlign: 'center', float: 'right', fontSize: 14}}>
                      <div style={{fontSize: 45}}>{data.stockQuantity ? data.stockQuantity : 0}</div>
                      <div>拟库存数量</div>
                    </div>
                  </Col>
                  <Col span="4">
                    <div style={{display: 'inline-block', padding: '0px 20px', textAlign: 'center', float: 'right', fontSize: 14}}>
                      <div style={{fontSize: 45}}>{data.assignedQuantity}</div>
                      <div>已分配数量</div>
                    </div>
                  </Col>
                </Row></div>);
  },
  renderTable(data) {
    return (<table className="kb-detail-table-6">
      <tbody>
      <tr>
        <td className="kb-detail-table-label">物料属性</td>
        <td>{MaterialPropertiesMap[data.stuffType]}</td>
        <td className="kb-detail-table-label">物料类型</td>
        <td>{data.stuffAttrName}</td>
      </tr>
      <tr>
        <td className="kb-detail-table-label">规格尺寸</td>
        <td>{data.sizeName}</td>
        <td className="kb-detail-table-label">材质</td>
        <td colSpan="3">{data.materialName}</td>
      </tr>
     </tbody>
     </table>);
  },

  render() {
    const tableOptions = {
      rowSelection: { onChange: this.onSelectChange},
      loading: this.state.loading,
      dataSource: this.state.tableData,
      columns: this.columns,
      pagination: this.state.pagination,
      onChange: this.onTableChange,
    };
    const canSubmit = !this.state.selectedCheckbox.length > 0;
    const {submitting} = this.state;
    return (<div>
        <div className="kb-detail-content">
        {
          // 本来可以从上个页面中拿到数据，后端一定要重写弄个接口返给我数据
        }
        {this.renderBanner(this.state.detailData)}
        {this.renderTable(this.state.detailData)}
        <Table style={{marginTop: 15}} rowKey={r => r.orderId} {...tableOptions}/>
        </div>
        <div className="content-footer">
          <Button loading={submitting} onClick={this.handleSubmit} size="large" type="primary" disabled={canSubmit}>提交</Button>
        </div>
     </div>);
  },
});

export default KASelect;
