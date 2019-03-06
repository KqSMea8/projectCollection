// import React from 'react';
export default [
  {
    key: 'CommodityType',
    component: 'CommodityType',
    field: 'verifyFrequency',
    label: '商品类型',
    placeholder: '请选择',
    required: true,
    // extra: (
    //   <div>点击查看<a href="https://render.alipay.com/p/f/fd-j33tadg3/index.html" target="_blank">券码核销教程</a></div>
    // ),
    extra: '',
  }, {
    key: '所属类目',
    component: 'CateringCategory',
    field: 'categoryPath',
    required: true,
  },
];
