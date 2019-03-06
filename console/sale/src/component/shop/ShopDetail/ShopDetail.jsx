import React, {PropTypes} from 'react';
import {Tabs, Button, message, Breadcrumb} from 'antd';
import { PageNoAuth } from '@alipay/kb-framework-components';
import { selectProd } from '@alipay/kb-sign-deals';
import { hasSignPermisson } from '../../../common/utils';
import ShopDetailBase from './ShopDetailBase';
import ShopDetailGoods from './ShopDetailGoods';
import ShopDetailMaterial from './ShopDetailMaterial';
import ShopDetailOrder from './ShopDetailOrder';
import ShopDetailHistory from './ShopDetailHistory';
import ShopDetailPunishment from './ShopDetailPunishment';
import ShopDetailCatering from './ShopDetailCatering';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import {cancelShop} from '../common/CancelShop';

const TabPane = Tabs.TabPane;

const ShopDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
    children: PropTypes.any,
  },

  getInitialState() {
    return {
      data: {},
      isPosSale: this.props.location.query.isPosSale === '1',
    };
  },

  componentDidMount() {
    if (!this.state.isPosSale) this.fetch();
  },

  onChange(key) {
    const shopId = this.props.params.shopId;
    const isPosSaleQuery = this.state.isPosSale ? '?isPosSale=1' : '';
    window.location.hash = '/shop/detail/' + shopId + '/' + key + isPosSaleQuery;
  },

  onClick() {
    const shopId = this.props.params.shopId;
    window.open('?mode=modify#/shop/edit/' + shopId);
  },
  fetch() {
    const params = {
      shopId: this.props.params.shopId,
    };

    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/shopDetailConfig.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result && result.status === 'succeed') {
          this.setState({
            data: result.data,
          });
        } else {
          message.error(result.errorMsg, 3);
        }
      },
    });
  },

  selectSignProd() {
    const { pid } = this.state.data;
    selectProd({
      pid,
      biz: 'shop-detail',
    }, '#sign-prod-modal').then(res => {
      if (!res) return;
      const { logonId, pname, kbSignCode } = res;
      window.open(`/p/contract-center/index.htm#/add?merchantPid=${pid}&merchantName=${pname}&kbSignCode=${kbSignCode}&contractAccount=${logonId}`);
    });
  },

  render() {
    if (this.state.isPosSale && !permission('POS_SALE_SHOP_DETAIL')) {
      return <PageNoAuth authCodes={['POS_SALE_SHOP_DETAIL']} />;
    } else if (!permission('SHOP_DETAIL')) {
      return <PageNoAuth authCodes={['SHOP_DETAIL']} />;
    }
    let activeKey = 'base';
    if (this.props.children) {
      const type = this.props.children.type;
      switch (type) {
      case ShopDetailBase:
        activeKey = 'base';
        break;
      case ShopDetailGoods:
        activeKey = 'goods';
        break;
      case ShopDetailMaterial:
        activeKey = 'material';
        break;
      case ShopDetailOrder:
        activeKey = 'order';
        break;
      case ShopDetailHistory:
        activeKey = 'history';
        break;
      case ShopDetailPunishment:
        activeKey = 'punishment';
        break;
      case ShopDetailCatering:
        activeKey = 'catering';
        break;
      default:
        activeKey = 'base';
        break;
      }
    }

    const shopId = this.props.params.shopId;
    const {data, isPosSale} = this.state;
    const modifyPermission = permission('SHOP_MODIFY') && data.showEdit;
    const cancelPermission = permission('SHOP_MODIFY') && data.showCancel;
    const signPermisson = hasSignPermisson() && data.pid;

    // 有排序的全量 TAB
    let tabs = [{
      type: 'base',
      render: <TabPane tab="基础信息" key="base"><ShopDetailBase id={shopId} isPosSale={isPosSale}/></TabPane>,
    }, {
      type: 'catering',
      render: <TabPane tab="新餐饮服务信息" key="catering"><ShopDetailCatering id={shopId} /></TabPane>,
    }, {
      type: 'goods',
      render: <TabPane tab="商品信息" key="goods"><ShopDetailGoods id={shopId}/></TabPane>,
    }, {
      type: 'material',
      render: <TabPane tab="物料信息" key="material"><ShopDetailMaterial id={shopId}/></TabPane>,
    }, {
      type: 'order',
      render: <TabPane tab="订单列表" key="order"><ShopDetailOrder id={shopId}/></TabPane>,
    }, {
      type: 'punishment',
      render: <TabPane tab="处罚日志" key="punishment"><ShopDetailPunishment id={shopId}/></TabPane>,
    }, {
      type: 'history',
      render: <TabPane tab="操作日志" key="history"><ShopDetailHistory id={shopId}/></TabPane>,
    }];

    if (!data.gridShopEnable) {
      tabs = tabs.filter(item => item.type !== 'catering');
    }
    if (isPosSale) {
      // 对POS销售人员过滤 TAB
      tabs = tabs.filter(item => item.type === 'base' || item.type === 'material');
    }

    return (
      <div className="kb-detail-main">
        <div className="app-detail-header" style= {{borderBottom: '0px'}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="1" href="#/shop">{isPosSale ? 'POS销售门店' : '代运营门店'}</Breadcrumb.Item>
            <Breadcrumb.Item key="2">门店详情(普通门店)</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {!isPosSale && <div style={{float: 'right', marginTop: -40}}>
          {modifyPermission && <Button type="primary" onClick={this.onClick}>修改</Button>}
          {!modifyPermission && cancelPermission && <span style={{marginRight: '5px'}}>当前门店正在审核中，需撤回后才发起修改</span>}
          {cancelPermission && <Button type="primary" onClick={() => cancelShop(data.orderId, 'shop', this.fetch)}>撤销审核</Button>}
          {!modifyPermission && !cancelPermission && <span>非您本人，如需继续修改当前的门店，请联系操作人</span>}
          {signPermisson && <Button type="primary" onClick={this.selectSignProd} style={{ marginLeft: '5px' }}>签约</Button>}
        </div>}
        <Tabs activeKey={activeKey} onChange={this.onChange}>
          { tabs.map(item => item.render) }
        </Tabs>
        <div id="sign-prod-modal" />
      </div>
    );
  },
});

export default ShopDetail;
