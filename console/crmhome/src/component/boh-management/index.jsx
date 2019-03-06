import React from 'react';
import { connect } from '@alipay/page-store';
import {Row, Col, Button, Pagination, Tooltip} from 'antd';
import {Link} from 'react-router';
import classnames from 'classnames';

import PageLayout from '../../common/layout';
import ShopList from './shop-list';
import { urlCreateSimpleShop } from './util';
import store from './store';

import './index.less';

@connect(store)
export default class BOHManagement extends React.Component {
  componentWillMount() {
    const {triggerFetchShopList, shopList} = this.props;
    triggerFetchShopList({
      current: shopList.current,
      pageSize: shopList.pageSize,
    });
  }

  onPaginantionChange = (current, pageSize) => {
    const {triggerFetchShopList, shopList} = this.props;
    const pagination = {
      current: current || shopList.current,
      pageSize: pageSize || shopList.pageSize,
    };
    // 获取数据
    triggerFetchShopList(pagination);

    window.scrollTo(0, 0);
  }

  onRefreshActivation = () => {
    const {triggerRequestActivation} = this.props;
    triggerRequestActivation();
  }

  renderHeader() {
    return (
      <Row type="flex" className="header">
        <Col span={16}>
          <h3 className="page-title">设备管理</h3>
        </Col>
        <Col span={8} className="sub-action">
          <a className="ant-btn ant-btn-ghost" target="_blank" href={urlCreateSimpleShop}>创建餐饮店体验一体机</a>
        </Col>
      </Row>
    );
  }

  renderActionBar(noData) {
    return !noData ? (
      <Row type="flex" className="action-bar">
        <Col span={12}>
          <Tooltip popupClassName="activation-tooltip"
            placement="topLeft" title="批量生成所有门店的激活码 （门店已有的激活码不会被刷新）">
            <Button type="primary" onClick={this.onRefreshActivation}>获取所有激活码</Button>
          </Tooltip>
            &nbsp;&nbsp;
          <Tooltip popupClassName="activation-tooltip"
            placement="topLeft" title="当前只下载已获取展示的激活码，其余激活码，请先获取展示后再下载">
            <a className="ant-btn ant-btn-primary" href="/goods/deviceMng/downloadActivationCode.json">下载所有激活码</a>
          </Tooltip>
        </Col>
        <Col span={12}>
          <div className="help">如何激活一体机？<Link to="/help">查看说明</Link></div>
        </Col>
      </Row>
    ) : null;
  }

  renderFooter(noData) {
    const {total, current, pageSize} = this.props.shopList;

    return !noData ? (
      <Row gutter={48} type="flex" className="footer">
        <Col span={12} />
        <Col span={12}>
          <div className="pagination">
            <Pagination
              showSizeChanger
              onChange={this.onPaginantionChange}
              onShowSizeChange={this.onPaginantionChange}
              total={total}
              current={current}
              pageSize={pageSize}
            />
          </div>
        </Col>
      </Row>
    ) : null;
  }

  render() {
    const {
      triggerRequestActivation, triggerRequestSetMainPOS,
      shopList, shopDeviceList, loading,
    } = this.props;

    const noData = shopList.data.length === 0;

    const className = classnames({
      'boh-management': true,
      'boh-management-empty': noData,
    });

    return (
      <PageLayout className={className} header={this.renderHeader()}>
        {this.renderActionBar(noData)}
        <ShopList
          triggerRequestActivation={triggerRequestActivation}
          triggerRequestSetMainPOS={triggerRequestSetMainPOS}
          loading={loading}
          shopList={shopList}
          shopDeviceList={shopDeviceList}
        />
        {this.renderFooter(noData)}
      </PageLayout>
    );
  }
}
