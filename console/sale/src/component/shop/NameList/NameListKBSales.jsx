import React from 'react';
import { Table } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import NameListKBSalesEditLink from './NameListKBSalesEditLink';

const data = [
  {
    display: '人均价格白名单',
    scene: 'SHOP_PERPAY_WHITE_LIST_OPERATION',
    permission: 'SHOP_PERPAY_WHITE_LIST_MANAGE',
  }, {
    display: '无证入驻城市-类目白名单',
    scene: 'NO_LICENSE_SHOP_CITY_CATEGORY',
    permission: 'NO_LICENSE_SHOP_CITY_CATEGORY_WHITE_LIST',
  }, {
    display: '无证入驻商户PID白名单',
    scene: 'NO_LICENSE_SHOP_MERCHANT_PID',
    permission: 'NO_LICENSE_SHOP_MERCHANT_PID_WHITE_LIST',
  }, {
    display: '操作员添加收款账号白名单',
    scene: 'OPERATOR_ADD_PAYEE_ACCOUNT',
    permission: 'OPERATOR_ADD_PAYEE_ACCOUNT_WHITE_LIST',
  }, {
    display: '一证多开商户白名单',
    scene: 'ONE_LICENSE_OPEN_MORE_SHOP_ACCOUNT',
    permission: 'ONE_LICENSE_OPEN_MORE_SHOP_IMPORT',
  }, {
    display: '门店账户数量限制白名单',
    scene: 'ADD_SHOP_ACCOUNT_LIMIT',
    permission: 'SHOP_ACCOUNT_LIMIT_WHITELIST',
  },
];

const columns = [
  {
    title: '名单类型',
    dataIndex: 'display',
    key: 'type',
    width: 300,
  },
  {
    title: '操作',
    dataIndex: '_',
    key: 'opertate',
    width: 200,
    render: (_, item) => {
      return <NameListKBSalesEditLink scene={item.scene} />;
    },
  },
];

export default class extends React.Component {

  constructor(props) {
    super(props);
    const dataSource = [];
    for (let i = 0; i < data.length; i++) {
      if ((!data[i].permission || permission(data[i].permission)) && permission('BATCH_FILE_MANAGE')) { // 没有权限的在列表页不展示该项；
        dataSource.push(data[i]);
      }
    }
    this.dataSource = dataSource;
  }

  render() {
    return (<div className="app-detail-content-padding">
      <Table
        locale={{ emptyText: '暂无可以配置的名单' }}
        columns={columns}
        dataSource={this.dataSource}
        pagination={false}
      />
    </div>);
  }
}
