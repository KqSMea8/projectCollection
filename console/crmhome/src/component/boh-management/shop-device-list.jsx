import React from 'react';
import {Table} from 'antd';

import './shop-device-list.less';

export default class ShopDeviceList extends React.Component {
  columns = [
    {
      title: 'pos机设备号',
      dataIndex: 'posSn',
      key: 'posSn',
      width: '220px',
      render: (posSn, record) => {
        const {mainDvFlag} = record;
        return (
          <div>
            {posSn}
            {
              mainDvFlag ? <span className="main-pos">[主pos]</span> : null
            }
          </div>
        );
      },
    },
    {
      title: '型号',
      dataIndex: 'posModel',
      key: 'posModel',
    },
    {
      title: '类型',
      dataIndex: 'posType',
      key: 'posType',
    },
    {
      title: '激活时间',
      dataIndex: 'activationTime',
      key: 'activationTime',
    },
    {
      title: '最后一次联网',
      dataIndex: 'lastConnectTime',
      key: 'lastConnectTime',
    },
    {
      title: '操作',
      dataIndex: 'mainDvFlag',
      key: 'operation',
      width: '100px',
      render: (mainDvFlag, record) => {
        const {shopId, posSn} = record;
        return mainDvFlag ? null :
          <span className="action" onClick={this.requestSetMainPOS({shopId, deviceSn: posSn})}>设为主POS</span>;
      },
    },
  ]

  requestSetMainPOS = (opts) => {
    const {triggerRequestSetMainPOS} = this.props;
    return () => {
      triggerRequestSetMainPOS(opts);
    };
  }

  render() {
    const {dataSource} = this.props;

    return (
      <Table
        rowKey={device => device.posSn}
        dataSource={dataSource}
        columns={this.columns}
        className="shop-device-list"
        pagination={false}
      />
    );
  }
}
