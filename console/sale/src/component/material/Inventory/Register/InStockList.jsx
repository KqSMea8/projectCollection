import React from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { StuffTypeText } from '../../common/enum';

const InStockList = props => {
  const columns = [
    {title: '模板名称/ID', fixed: 'left', width: 120, dataIndex: 'templateId', render: (t, r) => (
      <a href={`#/material/templatemanage/tempinfo/${t}`} target="_black">
        <span>{r.tempalteName}</span><br/><span>{r.templateId}</span>
      </a>)
    },
    {title: '申请单号', dataIndex: 'orderId', width: 80},
    {title: '物料属性', dataIndex: 'stuffAttrName', width: 120},
    {title: '物料类型', dataIndex: 'stuffType', width: 80, render: t => StuffTypeText[t]},
    {title: '物料材质', dataIndex: 'materialName', width: 80},
    {title: '规格尺寸', dataIndex: 'sizeName', width: 80},
    {title: '采购PO单号', dataIndex: 'poNo', width: 120},
    {title: '供应商名称', dataIndex: 'supplier', width: 120},
    {title: '采购员&下单时间', dataIndex: 'purchaserName', width: 160, render: (t, r) => (
      <div><span>{r.purchaserName}</span><br/><span>{r.gmtOrder && moment(r.gmtOrder).format('YYYY-MM-DD HH:mm:ss')}</span></div>
    )},
    {title: '申请数量(件)', dataIndex: 'applyQuantity', width: 120},
    {title: '采购数量(件)', dataIndex: 'purchaseQuantity', width: 120},
    {title: '本批已入库数量(件)', dataIndex: 'instockSum', width: 160},
    {title: '本次入库数量(件)', fixed: 'right', dataIndex: 'curBatchQuantity', width: 150}
  ];
  const { list } = props;
  const pagination = {
    pageSize: 10
  };
  return (
    <Table
      columns={columns}
      dataSource={list}
      pagination={pagination}
      scroll={{x: 1480}}
    />
  );
};

export default InStockList;
