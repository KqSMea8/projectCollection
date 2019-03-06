import React from 'react';
import { DetailTable } from 'hermes-react';

const SupplierInfo = props => {
  const { supplierName, supplierId, supplierType, produceType } = props.data;
  const dataSource = [
    {label: '供应商名称/ID', value: `${supplierName}/${supplierId}`},
    {label: '类型', value: supplierType},
    {label: '生产类型', value: produceType},
  ];
  return (
    <DetailTable
      dataSource={dataSource}
      columnCount={4}
    />
  );
};

export default SupplierInfo;
