import React, { Component } from 'react';
import { Table } from 'antd';
import Divider from 'Library/PageLayout/Divider';
import { StuffTypeText } from '../../../common/enum';
import { OrderStatusText, OrderStatus } from '../../common/enums';
import moment from 'moment';

export default class ListTable extends Component {
  constructor(props) {
    super(props);
  }
  columns = [
    {title: '采购单号', dataIndex: 'produceOrderId', fixed: 'left', width: 70},
    {title: '模板ID/名称', dataIndex: 'templateId', width: 180, render: (t, r) => (
      <a href={`#/material/templatemanage/tempinfo/${t}`} target="_black">
        <span>{t}</span><br/><span>{r.templateName}</span>
      </a>
    )},
    {title: '物料属性', dataIndex: 'stuffType', width: 100, render: t => StuffTypeText[t]},
    {title: '物料类型', dataIndex: 'stuffAttrName', width: 100},
    {title: '规格尺寸', dataIndex: 'sizeName', width: 150},
    {title: '材质', dataIndex: 'materialName', width: 250},
    {title: '采购数量', dataIndex: 'purchaseQuantity', width: 80},
    {title: '拟库存数量', dataIndex: 'stockQuantity', width: 100},
    {title: '已分配数量', dataIndex: 'assignedQuantity', width: 100},
    {title: '分配申请单数量', dataIndex: 'assignedApplyOrderCount', width: 120},
    {title: '采购分配状态', dataIndex: 'status', width: 120, render: t => OrderStatusText[t]},
    {title: '供应商名称/ID', dataIndex: 'supplierName', width: 120, render: (t, r) => `${r.supplierName}/${r.supplierId}`},
    {title: '采购员/时间', dataIndex: 'purchaserName', width: 200, render: (t, r) => {
      return <div><span>{r.purchaserName}</span><br/><span>{moment(r.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</span></div>;
    }},
    {
      title: '操作', dataIndex: '', fixed: 'right', width: 120, render: (t, r) => {
        const {onViewDetail, onAllocate} = this.props;
        return (
          <div>
            <a onClick={() => onViewDetail(r.produceOrderId)}>详情</a>
            {r.status === OrderStatus.ASSIGNABLE && <Divider/>}
            {r.status === OrderStatus.ASSIGNABLE && <a onClick={() => onAllocate(r.produceOrderId)}>分配</a>}
          </div>
        );
      }
    }
  ];
  render() {
    const { data, pagination, loading } = this.props;
    return (
      <Table
        loading={loading}
        dataSource={data}
        columns={this.columns}
        pagination={pagination}
        rowKey="produceOrderId"
        scroll={{x: 1800}}
      />
    );
  }
}
