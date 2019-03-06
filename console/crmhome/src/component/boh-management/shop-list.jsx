import React from 'react';
import {Table, Tag, Popover, Tooltip, Button, message} from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';

import ShopDeviceList from './shop-device-list';
import { urlCreateSimpleShop, getUrlUpgradeShop } from './util';

import './shop-list.less';

const POPOVER_CONTENT = <div>门店将无法参与口碑营销活动、<br/>用户端店铺页中不展示门店信息，<br/>也无法签约商品在线购买，请升级门店。</div>;

export default class ShopList extends React.Component {
  state = {
    expandedRowKeys: [],
  }

  onCopyActivation = (text, result) => {
    if (result) {
      message.success('复制成功');
    } else {
      message.error('复制失败，请重试');
    }
  }

  onRefreshActivation = (opts) => {
    const {triggerRequestActivation} = this.props;

    return () => {
      triggerRequestActivation(opts);
    };
  }

  columns = [
    {
      title: '门店名称 /ID',
      dataIndex: 'shopName',
      key: 'shopName',
      width: '260px',
      render: (text, record) => {
        const {shopId, simpleShop} = record;
        return (
          <div>
            {text}<br/>
            {shopId}<br/>
            {
              simpleShop ?
                <Popover placement="topLeft" content={POPOVER_CONTENT} title="待升级">
                  <Tag color="yellow">待升级</Tag>
                </Popover> : null
            }
          </div>
        );
      },
    },
    {
      title: '激活码',
      dataIndex: 'activationCode',
      key: 'activationCode',
      render: (activationCode, record) => {
        const {shopId} = record;
        if (activationCode) {
          const overlay = (
            <div className="activation-tooltip">
              <Button onClick={this.onRefreshActivation({shopId})}>刷新</Button>&nbsp;&nbsp;
              <CopyToClipboard text={activationCode} onCopy={this.onCopyActivation}>
                <Button type="primary">复制</Button>
              </CopyToClipboard>
            </div>
          );

          return (
            <Tooltip
              prefixCls="ant-popover"
              popupClassName="activation-tooltip-box"
              overlay={overlay}
              placement="topLeft"
            >
              <span className="action">{activationCode}</span>
            </Tooltip>
          );
        }
        return (
          <span className="action" onClick={this.onRefreshActivation({shopId})}>获取激活码</span>
        );
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: '220px',
    },
    {
      title: '设备数量',
      dataIndex: 'posNum',
      key: 'posNum',
      width: '75px',
    },
    {
      title: '门店状态',
      dataIndex: 'shopState',
      key: 'shopState',
      width: '75px',
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'operation',
      width: '120px',
      render: (text, record) => {
        const {simpleShop, shopId} = record;
        if (simpleShop) {
          return (
            <div>
              <a target="_blank" href={getUrlUpgradeShop(shopId)}>立即升级</a>
            </div>
          );
        }
        return '';
      },
    },
  ]

  render() {
    const {shopList, shopDeviceList, triggerRequestSetMainPOS, loading} = this.props;
    const {data: dataSource} = shopList;
    const {expandedRowKeys} = this.state;

    return (
      <div className="shop-list-container">
        <Table
          rowKey={shop => shop.shopId}
          className="shop-list"
          dataSource={dataSource}
          columns={this.columns}
          pagination={false}
          loading={loading}
          expandedRowRender={
            (record) => {
              const {shopId} = record;
              const data = shopDeviceList[shopId] || [];
              return data.length ? (
                <ShopDeviceList
                  dataSource={data}
                  triggerRequestSetMainPOS={triggerRequestSetMainPOS}
                />
              ) : null;
            }
          }
          onExpandedRowsChange={
            rows => {
              this.setState({
                expandedRowKeys: rows,
              });
            }
          }
          expandedRowKeys={expandedRowKeys}
          rowClassName={
            record => {
              const {shopId} = record;
              const data = shopDeviceList[shopId];
              return data.length ? '' : 'shop-device-list-empty';
            }
          }
        />
        {
          !loading && (dataSource.length === 0) ?
            <div className="no-result">
              <img src="https://gw.alipayobjects.com/zos/rmsportal/rkuQzzPBgbWVaUCbcgVl.png" width="210" />
              <h4 className="guide-title">请先创建门店</h4>
              <p className="guide-info">一体机仅支持餐饮门店使用，你的商户账号名下没有餐饮门店</p>
              <div className="guide-action">
                <a className="ant-btn ant-btn-primary ant-btn-lg" target="_blank" href={urlCreateSimpleShop}>创建餐饮门店</a>
              </div>
            </div> : null
        }
      </div>
    );
  }
}
