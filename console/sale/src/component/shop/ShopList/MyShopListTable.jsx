/* eslint-disable no-script-url */
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import { selectProd } from '@alipay/kb-sign-deals';
import { appendOwnerUrlIfDev, hasSignPermisson } from '../../../common/utils';
import {statusMap} from '../../../common/ShopStatusSelect';
import {checkIsCancelShop} from '../common/CancelShop';
import Table from '../../../common/Table';
import Qrcode from '../common/Qrcode';
import QrcodeDownload from '../common/QrcodeDownload';
import {remoteLog} from '../../../common/utils';
import {logGoodsShopTypeMap, logGoodsShopTypeList} from '../../../common/OperationLogMap';
import {Dropdown, Icon, Menu, message, Popconfirm} from 'antd';
import ControlModal from '../common/ControlModal';
import RateModal from '../common/RateModal';
import ShowTag from '../common/ShowTag';
import MallAction from './MallAction';

const MyShopListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    isPosSale: PropTypes.bool,
  },

  getInitialState() {
    return {
      data: [],
      canSetShopRate: false, // 设置费率按钮展示情况
      loading: true,
      selectedIds: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      isBd: false,
      isKaBd: false,
      options: [],
    };
  },

  componentWillMount() {
    // 查询访客角色
    this.queryLoginRole();
    this.getOptions();
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onTableChange(pagination, filters = {}) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      shopType: filters.shopType,
    };
    this.fetch(params);
  },

  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedIds: selectedRowKeys,
    });
  },

  getOptions() {
    ajax({
      url: '/support/control/queryReasonList.json',
      method: 'get',
      data: {'scene': 'SHOP_SM_CREATE'},
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const categoryLevel1s = result.categoryLevel1s;
          const categoryLevel2s = result.categoryLevel2s;
          const options = [];
          categoryLevel1s.map(item1 => {
            const children = [];
            categoryLevel2s.map(item2 => {
              if (item1.id === item2.parentCategoryId) {
                const child = {value: item2.id, label: item2.name, principalType: item2.principalType, toolCode: item2.toolCode};
                if (item2.toolCode === 'SHOP_CONTROL_CLOSE') {
                  child.control = '关店';
                  child.remind = '关店后不可恢复!如果需要恢复，只能重新开店，且交易、评价记录不可恢复。请慎重选择。';
                } else if (item2.toolCode === 'SHOP_REST_N_CLOSE') {
                  child.control = '休业60天后关店';
                  child.remind = '休业后,APP内不展示店铺、不可收款、不允许重复开店,可以恢复。休业60天后关店,一旦关店不可恢复。';
                } else if (item2.toolCode === 'SHOP_REST') {
                  child.control = '休业';
                  child.remind = '休业后,APP内不展示店铺、不可收款、不允许重复开店,可以恢复。';
                } else if (item2.toolCode === 'SHOP_FROZEN_N_CLOSE') {
                  child.control = '冻结60天后关店';
                  child.remind = '冻结后,APP内不展示店铺、不可收款、不允许重复开店,可以恢复。冻结60天后关店,一旦关店不可恢复';
                } else {
                  child.control = '取消休业';
                  child.remind = '恢复为正常营业状态';
                }
                children.push(child);
              }
            });
            options.push({value: item1.id, label: item1.name, children: children});
          });
          this.setState({
            options: options,
          });
        }
      },
    });
  },

  queryLoginRole() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/visitrecord/queryLoginRole.json'),
      success: (result) => {
        if (result.status === 'succeed') {
          const items = result.data;
          for (let i = 0; i < items.length; i++) {
            if (items[i] === 'bd') {
              this.setState({
                isBd: true,
              });
            } else if (items[i] === 'kaBd') {
              this.setState({
                isKaBd: true,
              });
            }
          }
        }
      },
      error: () => {},
    });
  },

  gotoDetail(shopId, shopType, e) {
    e.preventDefault();
    if (shopType === 'MALL') {
      remoteLog('SHOP_MY_DETAIL');
      window.open('#/mall/detail/' + shopId);
    } else {
      remoteLog('SHOP_MY_DETAIL');
      const isPosSaleQuery = this.props.isPosSale ? '?isPosSale=1' : '';
      window.open('#/shop/detail/' + shopId + isPosSaleQuery);
    }
  },

  gotoEdit(shopId) {
    setTimeout(() => {
      location.href = '?mode=modify#/shop/edit/' + shopId;
    });
  },

  gotoMall(shopId, e) {
    e.preventDefault();
    window.open('#/mall/list/' + shopId);
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },

  clearSelectedIDs() {
    this.setState({selectedIds: []});
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.kbsalesUrl + (this.props.isPosSale ? '/shop/koubei/myPosSaleShops.json' : '/shop/koubei/myShops.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        // result.data = result.data || {};
        const pagination = {...this.state.pagination};
        pagination.total = result.total;
        this.setState({
          loading: false,
          canSetShopRate: result.canSetShopRate,
          data: result.data || [],
          pagination,
        });
      },
      error: (error) => {
        if (error) {
          message.warn(error.resultMsg);
        }
        this.setState({
          loading: false,
        });
      },
    });
  },

  hasControlRight(shopId) {
    ajax({
      url: '/support/control/queryAgentOperationShop.json',
      method: 'get',
      data: {shopId},
      type: 'json',
      success: (result) => {
        if (result.status) {
          this.setState({
            hasControlRight: result.status,
          });
        }
      },
    });
  },

  confirm(shopId, status) {
    const url = status === '2' ? 'showMall.json' : 'hideMall.json';
    const self = this;
    ajax({
      url: '/support/control/' + url,
      method: 'get',
      data: {mallId: shopId},
      type: 'json',
      success: (result) => {
        if (result.status) {
          message.success('操作成功！');
          self.refresh();
        }
      },
      error: (error) => {
        if (error) {
          message.error(error.resultMsg);
        }
      },
    });
  },

  selectSignProd(record) {
    const { merchantPid } = record;
    selectProd({
      pid: merchantPid,
      biz: 'shop',
    }, '#sign-prod-modal').then(res => {
      if (!res) return;
      const { logonId, pname, kbSignCode } = res;
      window.open(`/p/contract-center/index.htm#/add?merchantPid=${merchantPid}&merchantName=${pname}&kbSignCode=${kbSignCode}&contractAccount=${logonId}`);
    });
  },

  render() {
    const {loading, data, pagination, selectedIds, isBd, canSetShopRate} = this.state;
    this.rowSelection = this.props.isPosSale ? undefined : {
      selectedRowKeys: selectedIds,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '门店ID',
        dataIndex: 'shopId',
        width: 240,
        render: (text, record) => {
          const tmpArr = record.shopSaleLabels || [];
          if (record.ifRka === '1' && tmpArr.indexOf('RKA') === -1) { tmpArr.push('RKA');}
          if (record.ifTka === '1' && tmpArr.indexOf('TKA') === -1) { tmpArr.push('TKA');}
          return (<div>
            <ShowTag shopSaleLabels= {tmpArr} />
            <span className="shopIdWrapper">
              {text}<br/>
              <span style={{color: '#FF6600'}}>{record.mallName ? <span>[{record.mallName}]</span> : null}</span>
            </span>
          </div>);
        },
        options: [],
      },
      // {
      //   title: '竞对信息',
      //   dataIndex: 'competitorsInfo',
      //   width: 120,
      //   render(text, record) {
      //     const _cnText = {
      //       weixin: '微信',
      //       xinmeida: '美团/大众',
      //       juhezhifu: '聚合支付'
      //     };
      //     const _data = record.competitorsInfo && record.competitorsInfo.split(',');
      //     const _txt = (_data || []).map((items) => {
      //       return _cnText[items];
      //     }).join('/');
      //     return (<span>
      //       {_txt && `来自${_txt}` || ''}
      //     </span>);
      //   },
      // },
      {
        title: ['门店名称', <br key="1"/>, '二维码'],
        dataIndex: 'shopName',
        width: 120,
        render(text, record) {
          const { shopId, shopType, merchantPid } = record;
          return (<span>
            {text}<br/>
            <Qrcode id={shopId} shopName={text} shopType={shopType} partnerId={merchantPid}/>
          </span>);
        },
      },
      {
        title: '类型',
        dataIndex: 'shopType',
        width: 80,
        render(text) {
          return logGoodsShopTypeMap[text] || text;
        },
        filters: logGoodsShopTypeList,
      },
      {
        title: '商户PID',
        dataIndex: 'merchantPid',
        width: 120,
      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        width: 180,
      },
      {
        title: '网格名称',
        dataIndex: 'territoryName',
        width: 120,
      },
      {
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 160,
        render(text, record) {
          const address = [record.provinceName, record.cityName, record.districtName].filter(r => r).join('-') + ' ' + text;
          const list = [address];
          list.push('Tel：' + record.mobile);
          return list;
        },
      },
      {
        title: '门店状态',
        dataIndex: 'status',
        width: 100,
        render: (text, record) => {
          const status = statusMap[text] || text;
          const displayStatus = record.displayStatus === '1' ? '显示' : '隐藏';
          return (status ? status + '-' : '') + displayStatus;
        },
      },
      {
        title: ['门店', <br key="1"/>, '质量分'],
        dataIndex: 'qualityScore',
        width: 120,
      },
      {
        title: '操作',
        dataIndex: '',
        width: 150,
        render: (text, record) => {
          const items = [];
          if (this.props.isPosSale) {
            // 针对 POS 销售门店的展示
            if (isBd && permission('VISITRECORD_QUERY_PC')) {
              items.push(<Menu.Item key="record">
                <a target="_blank" href={'#/record/shop?shopId=' + record.shopId}>拜访小记</a>
              </Menu.Item>);
            }
            if (record.status !== 'CLOSED') {
              items.push(<Menu.Item key="report">
                <a target="_blank" href={`/sale/bohIndex.htm#/managereport/addreport?shopId=${record.shopId}&shopName=${record.shopName}`}>报单</a>
              </Menu.Item>);
            }
            return (<span>
              {permission('POS_SALE_SHOP_DETAIL') && <a href="#" onClick={this.gotoDetail.bind(this, record.shopId, record.shopType)}>查看</a>}
              {permission('POS_SALE_SHOP_DETAIL') && items.length > 0 && <span className="ant-divider" />}
              {items.length > 0 && <Dropdown overlay={<Menu>{items}</Menu>} trigger={['click']}>
                <a className="ant-dropdown-link">更多 <Icon type="down" /></a>
              </Dropdown>}
            </span>);
          }

          // 针对综合体的展示
          if (record.shopType === 'MALL') {
            items.push(<Menu.Item key="0">
                <a href="#" onClick={this.gotoMall.bind(this, record.shopId)}>管理</a>
              </Menu.Item>);
          }
          if (isBd && permission('VISITRECORD_QUERY_PC')) {
            items.push(<Menu.Item key="1">
                <a target="_blank" href={'#/record/shop?shopId=' + record.shopId}>拜访小记</a>
              </Menu.Item>);
          }
          let menus = null;
          if (items.length > 0) {
            menus = <Menu>{items}</Menu>;
          }
          let displayStatus;
          if (record.displayStatus) {
            displayStatus = record.displayStatus === '2' ? '显示' : '隐藏';
          }
          if (record.shopType === 'MALL') {
            return (<span>
              {permission('SHOP_DETAIL') && <a href="#" onClick={this.gotoDetail.bind(this, record.shopId, record.shopType)}>查看</a>}
              {permission('SHOP_DETAIL') && menus.length > 0 && <span className="ant-divider"></span>}
              {(record.shopType === 'MALL' && record.status !== 'CLOSED') && <MallAction refresh={this.refresh} shopId={record.shopId} status={record.displayStatus}/>}
              {(record.shopType === 'MALL' && record.status !== 'CLOSED') && <span className="ant-divider"></span>}
              {(record.shopType === 'MALL' && record.status !== 'CLOSED') && <Popconfirm title={'是否确认执行' + displayStatus + '操作?'} onConfirm={() => {this.confirm(record.shopId, record.displayStatus);}}>
                <a href="#">{displayStatus}</a>
              </Popconfirm>}
              {menus.length > 0 && (
                <Dropdown overlay={menus} trigger={['click']}>
                  <a className="ant-dropdown-link" href="#">
                    更多 <Icon type="down" />
                  </a>
                </Dropdown>
              )}
            </span>);
          }
          // 针对非综合体的展示
          const modifyPermission = permission('SHOP_MODIFY');
          const controlPermission = permission('CREATE_CONTROL_EVENT');
          const status = record.status === 'OPEN' || record.status === 'FREEZE' || record.status === 'PAUSED';
          const itemsCommon = [];
          if (controlPermission && modifyPermission && status && this.state.hasControlRight) {
            itemsCommon.push(
              <Menu.Item key="2">
                <ControlModal id={record.shopId} options={this.state.options}/>
              </Menu.Item>,
              <Menu.Item key="3">
                <a onClick={checkIsCancelShop.bind(this, record.shopId, 'shop', this.gotoEdit, this.refresh)}>修改</a>
              </Menu.Item>
              );
          }
          if (modifyPermission && !controlPermission) {
            itemsCommon.push(<Menu.Item key="4">
              <a onClick={checkIsCancelShop.bind(this, record.shopId, 'shop', this.gotoEdit, this.refresh)}>修改</a>
            </Menu.Item>);
          }
          if (!modifyPermission && controlPermission && status && this.state.hasControlRight) {
            itemsCommon.push(<Menu.Item key="5">
              <ControlModal id={record.shopId} options={this.state.options}/>
            </Menu.Item>);
          }
          if (isBd && permission('VISITRECORD_QUERY_PC')) {
            itemsCommon.push(
              <Menu.Item key="6">
                <a target="_blank" href={'#/record/shop?shopId=' + record.shopId}>拜访小记</a>
              </Menu.Item>
              );
          }
          // 修改费率
          if (canSetShopRate && permission('MODIFY_SHOP_RATE') && record.status === 'OPEN' && record.shopType === 'COMMON') {
            itemsCommon.push(
              <Menu.Item key="7">
                <RateModal id={record.shopId} pId={record.merchantPid} categoryId= {record.detailcategoryId} type="MODIFY_SHOP_RATE"/>
              </Menu.Item>
              );
          }
          if (hasSignPermisson()) {
            itemsCommon.push(
              <Menu.Item key="sign">
                <a href="javascript: void(0)" onClick={this.selectSignProd.bind(this, record)}>签约</a>
              </Menu.Item>
            );
          }
          // let menu = null;
          // if (itemsCommon.length > 0) {
          //   this.menu = (
          //     <Menu>{itemsCommon}</Menu>
          //   );
          // }
          this.menu = (
              <Menu>{itemsCommon}</Menu>
            );
          return (<span>
            {permission('SHOP_DETAIL') && <a href="#" onClick={this.gotoDetail.bind(this, record.shopId, record.shopType)}>查看</a>}
            {permission('SHOP_DETAIL') && <span className="ant-divider"></span>}
              <Dropdown overlay={this.menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#" onClick={this.hasControlRight.bind(this, record.shopId)}>
                  更多 <Icon type="down" />
                </a>
              </Dropdown>
          </span>);
        },
      },
    ];
    const buttonArea = (
      !loading && !this.props.isPosSale && data && data.length > 0 && (<div>
          <span style={{marginRight: 12}}>已选({selectedIds.length})</span>
          <span><QrcodeDownload selectedIds={selectedIds} afterDownload={this.clearSelectedIDs} /></span>
        </div>
      )
    );
    return (
      <div style={{position: 'relative'}}>
        {buttonArea && <div style={{position: 'absolute', top: '-45px'}}>{buttonArea}</div>}
        <Table className="kb-shop-list-table"
          columns={columns}
          rowKey={r => r.shopId}
          rowSelection={this.rowSelection}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
        {buttonArea && <div style={{marginTop: -44}}>{buttonArea}</div>}
        <div id="sign-prod-modal" />
      </div>
    );
  },
});

export default MyShopListTable;
