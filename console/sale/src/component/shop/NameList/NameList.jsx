import React from 'react';
import Table from '../../../common/Table';
import permission from '@alipay/kb-framework/framework/permission';
/**
*黑白名单列表页；*
*/

const NameList = React.createClass({
  gotoEdit(item, e) {
    e.preventDefault();
    window.open('#/shop/NameList/to-edit/' + item.displayCode);
  },
  render() {
    const data = [{
      key: '1',
      type: '品类白名单',
      display: '门店ID',
      displayCode: 'category',
      AccessCode: 'WHITE_LIST_MODIFY_CATEGORY_SHOP_ID',
    }, {
      key: '2',
      type: '服务商抢单门店白名单',
      display: '门店ID',
      displayCode: 'serviceShop',
      AccessCode: 'WHITE_LIST_GRAB_SHOP_SHOP_ID',
    }, {
      key: '3',
      type: '判重白名单',
      display: '商户PID',
      displayCode: 'judgment',
      AccessCode: 'WHITE_LIST_SHOP_JUDGE',
    }, {
      key: '4',
      type: '支付宝当面付开口碑店白名单',
      display: '商户PID',
      displayCode: 'koubei',
      AccessCode: 'WHITE_LIST_SHOP_SIGN_PID',
    }, {
      key: '5',
      type: '服务商抢单商户黑名单',
      display: '商户PID',
      displayCode: 'serviceMerchants',
      AccessCode: 'BLACK_LIST_GRAB_SHOP_PID',
    }, {
      key: '6',
      type: '服务商抢单品牌黑名单',
      display: '品牌ID',
      displayCode: 'seviceBrand',
      AccessCode: 'BLACK_LIST_GRAB_BRAND_ID',
    }, {
      key: '7',
      type: 'leads免审城市白名单',
      display: '城市名称',
      displayCode: 'city',
      AccessCode: 'WHITE_LIST_LEADS_AUDIT_CITY_ID',
    }, {
      key: '8',
      type: '重点区域',
      display: '区域名称',
      displayCode: 'importantArea',
      AccessCode: 'BLACK_LIST_KEY_POINT_DISTRICT_ID',
    }, {
      key: '9',
      type: '门店自动释放白名单',
      displayCode: 'release',
      AccessCode: 'WHITE_LIST_AUTO_RELEASE_SHOP_ID',
    }, {
      key: '10',
      type: '测试门店创建者白名单',
      displayCode: 'testShopCreatorId',
      AccessCode: 'WHITE_LIST_TEST_SHOP_CREATOR_ID',
    }, {
      key: '11',
      type: '测试门店C端白名单',
      displayCode: 'testShopUserId',
      AccessCode: 'WHITE_LIST_TEST_SHOP_USER_ID',
    }, {
      key: '12',
      type: '主店名质量白名单',
      displayCode: 'shopNameQuality',
      AccessCode: 'WHITE_LIST_SHOP_NAME_QUALITY',
    }, {
      key: '13',
      type: 'ISV费率白名单',
      display: '商户PID',
      displayCode: 'isvRateWhiteList',
      AccessCode: 'SHOP_ISV_PID_WHITE_LIST',
    }];
// 没有权限的在列表页不展示该项；
    const dataSource = [];
    for (let i = 0; i < data.length; i++) {
      if (permission(data[i].AccessCode)) {
        dataSource.push(data[i]);
      }
    }
    const columns = [
      {
        title: '名单类型',
        dataIndex: 'type',
        key: 'type',
        width: 300,
      },
      {
        title: '操作',
        dataIndex: 'opertate',
        key: 'opertate',
        width: 200,
        render: (_, item) => {
          return (item.key && <div>
            <a href="#" target="_blank" onClick={this.gotoEdit.bind(this, item)}>查看或编辑</a>
          </div>);
        },
      },
    ];
    return (<div>
    <div className="app-detail-content-padding">
    <Table className="kb-shop-list-table"
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      />
    </div>
  </div>);
  },
});

export default NameList;
