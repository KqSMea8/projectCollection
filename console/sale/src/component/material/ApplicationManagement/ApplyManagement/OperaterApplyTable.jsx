import React, {PropTypes} from 'react';
import {message, Button, Modal, Popover} from 'antd';
const confirm = Modal.confirm;
import Table from '../../../../common/Table';
import ajax from '@alipay/kb-framework/framework/ajax';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import {format} from '../../../../common/dateUtils';
import { ApplyRecordStatusMap } from '../../common/MaterialLogMap';
import OrderModal from './OrderModal';
import CntTable from './CntTable';
import DeliverModal from './DeliverModal';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';
import permission from '@alipay/kb-framework/framework/permission';
const MaterialPropertiesList = {
  BASIC: '基础物料',
  ACTIVITY: '活动物料',
  ACTUAL: '实物物料',
  OTHER: '其它物料',
};

function removeDataTree(data, key) {
  return data.filter((v)=>{
    return v.key !== key;
  });
}
function setDisabled(obj, detail) {
  const {status} = obj;
  const {applyQuantity, assignQuantity} = detail;
  if (status === 800 || status === 801) {
    // 待审核 审核中 禁用
    return true;
  }
  if (applyQuantity === assignQuantity && assignQuantity && applyQuantity) {
    // 申请数量等于发货数量 禁用
    return true;
  }
  return false;
}
/*
* 返回之前选中的checkbox
*
* @origin array
* @toDel array
*
*/
function setCheckbox(key, arr) {
  let checked = false;
  arr.forEach((val)=>{
    if (val.key === key) {
      checked = true;
    }
  });
  return checked;
}
/*
* 删除数组里要删除的东西
*
* @origin array
* @toDel array
*
*/
function deleteArrayElement(origin, toDel) {
  let arr = origin;
  toDel.forEach((val)=>{
    arr = arr.filter((v) => {
      return JSON.stringify(val) !== JSON.stringify(v);
    });
  });
  return arr;
}
const ApplicationRecordTable = React.createClass({
  propTypes: {
    params: PropTypes.any,
  },
  getInitialState() {
    const user = getLoginUser();
    const {userChannel} = user;
    this.user = user;
    this.enbaleInventory = userChannel === 'BUC' && permission('STUFF_APPLY_ORDER_PURCHASE');// 小二才有下单采购 和 权限
    this.columns = [
      {
        title: '申请单号',
        dataIndex: 'orderId',
      }, {
        title: '申请单状态',
        dataIndex: 'status',
        render(text) {
          if (!text) {
            return '';
          }
          return ApplyRecordStatusMap[text];
        },
      }, {
        title: '申请单位、城市/申请时间',
        dataIndex: 'storageName',
        render(text, record) {
          return (<div>{text}<br/>{format(new Date(record.gmtCreate))}</div>);
        },
      }, {
        title: '收货人/地址/电话',
        dataIndex: 'receiver',
        render(text, record) {
          const addressInfoDto = record.addressInfoDto || {provinceName: null, cityName: null, districtName: null, address: null};
          const {provinceName, cityName, districtName, address} = addressInfoDto;
          const add = provinceName + cityName + districtName + address;
          return (<div>{record.addressInfoDto.receiver}<br/>{add}<br/>{record.addressInfoDto.contactPhone}</div>);
        },
      }, {
        title: '操作',
        width: 100,
        render: (text, record) => {
          const apprv = record.status === 800 && userChannel === 'BUC' && permission('STUFF_APPLY_ORDER_APPROVE');
          return (<span>
            <a href={'#/material/applicationManagement/applyDetail/' + record.orderId} target="_blank">详情</a>
            {
             apprv && <span className="ant-divider"></span>
            }
           {
            apprv && <a href={'#/material/applicationManagement/approve/' + record.orderId} target="_blank">审核</a>
          }
          </span>);
        },
      },
    ];
    return {
      showModal: false,
      data: [],
      loading: true,
      selectedTreeData: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      operatorId: '',
    };
  },

  componentWillMount() {
    this.refresh();
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onTableChange(pagination) {
    const self = this;
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    const hasChecked = this.state.selectedTreeData.length > 0;
    if (hasChecked) {
      // 页面中有选择的checkbox
      confirm({
        title: '您是否确认要放弃之前选择的模板?',
        content: '放弃不保存之前已选择的模板',
        onOk() {
          self.setState({
            pagination: pager,
            selectedTreeData: [],
          });
          self.fetch(params);
        },
        onCancel() {},
      });
    } else {
      // 没有选择checkbox
      this.setState({
        pagination: pager,
      });
      this.fetch(params);
    }
  },
  onSubmitDone() {
    // 调度采购提交成功 清空
    this.setState({
      selectedTreeData: [],
      showModal: false,
    });
    this.refresh();
  },
  endStock(record) {
    const params = {
      orderId: record.orderId,
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
          this.refresh();
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      mappingValue: 'kbasset.pageQueryApplyOrder',
      domain: 'KOUBEI',
      bizSource: 'KOUBEI_ASSET',
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
            data: result.data.data || [],
            pagination,
          });
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg || '系统繁忙');
          }
        }
      },
      error: (err) => {
        message.error(err.resultMsg || '系统繁忙');
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
  expandedRowRender(record) {
    const self = this;
    const columns = [
      {
        title: '模板名称/模板ID',
        dataIndex: 'templateName',
        render(text, obj) {
          return (<div>{text}<br/>{obj.templateId}</div>);
        },
      }, {
        title: '物料属性',
        dataIndex: 'stuffType',
        render(text) {
          return MaterialPropertiesList[text];
        },
      }, {
        title: '物料类型',
        dataIndex: 'stuffAttrName',
        width: 95,
      }, {
        title: '规格尺寸',
        dataIndex: 'sizeName',
      }, {
        title: '材质',
        dataIndex: 'materialName',
      }, {
        title: '申请数量',
        dataIndex: 'applyQuantity',
      }, {
        title: '采购数量',
        dataIndex: 'assignQuantity',
      }, {
        title: '采购单号',
        dataIndex: 'purchaseOrderId',
        render: t => t || '-'
      }, {
        title: '本次发货数量/发货总量',
        dataIndex: 'purchaseQuantity',
        render(text, obj) {
          return (
            <div>
            {text}<br/><DeliverModal data={obj.deliveryDetailList} showData={obj.alreadyPurchaseQuantity}/></div>);
        },
      }, {
        title: '物流信息',
        dataIndex: 'expressCompany',
        render(text, obj) {
          return (
            <div>{text}<br/>{obj.expressNo}<br/>{obj.expressStatusDesc}</div>);
        },
      }, {
        title: '操作',
        width: 95,
        render(text, obj) {
          const {inStockEnalbe} = obj.displayPermission;
          if (inStockEnalbe === '0') {
            return '-';
          }
          const content = (<CntTable data={obj.stuffPurchaseItemDtoList}/>);
          return (
            <Popover arrowPointAtCenter placement="left" content={content} title="多单入库">
            <a>入库</a></Popover>);
        },
      },
    ];
    // 通过 rowSelection 对象表明需要行选择
    const rowSelection = {
      onSelect(records, selected) {
        // 单选checkbox 保存到 selectedTreeData
        const {templateId, itemId, orderId} = records;
        let database = self.state.selectedTreeData.slice(0);
        if (selected) {
          database.push({
            key: itemId,
            templateId, itemId, orderId});
        } else {
          // 取消之前选择的checkbox
          database = removeDataTree(database, itemId);
        }
        self.setState({selectedTreeData: database});
      },
      onSelectAll(selected, selectedRows, changeRows) {
         // 全选checkbox 保存到 selectedTreeData
        let database = self.state.selectedTreeData.slice(0);
        const arr = changeRows.map(({templateId, itemId, orderId})=>({
          key: itemId,
          templateId, itemId, orderId
        }));
        if (selected) {
          // 存数据
          database = database.concat(arr);
        } else {
          // 删数据
          database = deleteArrayElement(database, arr);
        }
        self.setState({selectedTreeData: database});
      },
      getCheckboxProps: v => ({
        defaultChecked: setCheckbox(v.itemId, self.state.selectedTreeData),    // 已经勾选的
        disabled: setDisabled(record, v),    // 配置无法勾选的列
      }),
    };
    const tableOption = {
      columns,
      pagination: false,
      dataSource: record.stuffApplyItemDtoList,
    };
    if (this.enbaleInventory) {
      tableOption.rowSelection = rowSelection;
    }
    return (
      <Table
        rowKey={r => r.itemId}
        {...tableOption}
        scroll={{x: false, y: false}}
      />
      );
  },
  showModal() {
    this.setState({
      showModal: true,
    });
  },
  hideCouponModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    const {loading, data, pagination, showModal, selectedTreeData} = this.state;
    const modalOptions = {
      onCancel: this.hideCouponModal,
      onSubmitDone: this.onSubmitDone,
      data: this.state.selectedTreeData,
    };
    const btnStatus = selectedTreeData.length > 0;
    return (
        <div style={{position: 'relative'}}>
          {this.enbaleInventory && <Button type="primary" onClick={this.showModal} style={{position: 'absolute', top: '-40px'}} disabled={!btnStatus}>下单采购</Button>}
          {showModal && <OrderModal {...modalOptions}/>}
          <Table columns={this.columns}
                 rowKey={r => r.orderId}
                 dataSource={data}
                 loading={loading}
                 expandedRowRender={this.expandedRowRender}
                 pagination={pagination}
                 firstShow={!this.props.params}
                 onChange={this.onTableChange} />
        </div>
    );
  },
});

export default ApplicationRecordTable;
