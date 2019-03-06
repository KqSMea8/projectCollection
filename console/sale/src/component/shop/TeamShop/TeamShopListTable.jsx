/* eslint-disable no-script-url */
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import { selectProd } from '@alipay/kb-sign-deals';
import Table from '../../../common/Table';
import ShopAuth from '../common/ShopAuth';
import { remoteLog, hasSignPermisson } from '../../../common/utils';
import {logGoodsShopTypeMap, logGoodsShopTypeList} from '../../../common/OperationLogMap';
import { Menu, Dropdown, Icon, message} from 'antd';
import ShowTag from '../common/ShowTag';
import RateModal from '../common/RateModal';
import {statusMap} from '../../../common/ShopStatusSelect';

const TeamShopListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    isBd: PropTypes.bool,
    isPosSale: PropTypes.bool,
  },

  getInitialState() {
    const columns = [
      {
        title: '门店ID',
        dataIndex: 'shopId',
        width: 360,
        render(text, record) {
          const tmpArr = record.shopSaleLabels || [];
          if (record.ifRka === '1' && tmpArr.indexOf('RKA') === -1) { tmpArr.push('RKA');}
          if (record.ifTka === '1' && tmpArr.indexOf('TKA') === -1) { tmpArr.push('TKA');}
          return (<div>
              <ShowTag shopSaleLabels= {tmpArr} />
              <span className="shopIdWrapper">
                {text}
              </span>
            </div>);
        },
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
        title: '类型',
        dataIndex: 'shopType',
        width: 80,
        render(text) {
          return logGoodsShopTypeMap[text] || text;
        },
        filters: logGoodsShopTypeList,
      },
      {
        title: '门店名称',
        dataIndex: 'shopName',
        width: 120,
      },
      {
        title: '商户PID',
        dataIndex: 'merchantPid',
        width: 90,
      },
      {
        title: '网格名称',
        dataIndex: 'territoryName',
        width: 100,
      },
      {
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 120,
        render(text, record) {
          const address = [record.provinceName, record.cityName, record.districtName].filter(r => r).join('-') + ' ' + text;
          const list = [address];
          list.push('Tel：' + record.mobile);
          return list;
        },
      },
      {
        title: this.props.isPosSale ? 'POS销售归属人' : '归属BD',
        dataIndex: '_',
        width: 90,
        render: (text, record) => {
          if (this.props.isPosSale) {
            return record.posSaleNickName ? [record.posSaleRealName, <br key="1"/>, '(' + record.posSaleNickName + ')'] : record.posSaleRealName;
          }
          return record.bdNickName ? [record.bdRealName, <br key="1"/>, '(' + record.bdNickName + ')'] : record.bdRealName;
        },
      },
      this.props.isPosSale ? {width: 1} : {
        title: '服务商',
        dataIndex: 'brokerName',
        width: 90,
      },
      {
        title: '品类',
        dataIndex: 'categoryName',
        width: 90,
        render(text, record) {
          return [text, record.subcategoryName, record.detailcategoryName].filter(r => r).join('-');
        },
      },
      {
        title: '门店质量分',
        dataIndex: 'qualityScore',
        width: 180,
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
        title: '操作',
        dataIndex: '',
        width: 100,
        render: (text, record) => {
          if (this.props.isPosSale) {
            // POS 销售只有 查看，报单，拜访小记
            const items = [];
            if (record.status !== 'CLOSED') {
              items.push(<Menu.Item key="report">
                <a target="_blank" href={`/sale/bohIndex.htm#/managereport/addreport?shopId=${record.shopId}&shopName=${record.shopName}`}>报单</a>
              </Menu.Item>);
            }
            if (permission('VISITRECORD_QUERY_PC')) {
              items.push(<Menu.Item key="xiaoji">
                <a target="_blank" href={'#/record/shop?shopId=' + record.shopId}>拜访小记</a>
              </Menu.Item>);
            }
            return (<span>
              {permission('POS_SALE_SHOP_DETAIL') && <a href="#" onClick={this.gotoDetail.bind(this, record.shopId, record.shopType)}>查看</a>}
              {permission('POS_SALE_SHOP_DETAIL') && items.length > 0 && <span className="ant-divider"/>}
              {items.length > 0 && <Dropdown overlay={<Menu>{items}</Menu>} trigger={['click']}>
                <a className="ant-dropdown-link">更多 <Icon type="down" /></a>
              </Dropdown>}
            </span>);
          }
          const authPermission = permission('SHOP_AUTH') && ['OPEN', 'PAUSED', 'CLOSED'].indexOf(record.status) >= 0;
          const items = [];
          if (authPermission) {
            items.push(<Menu.Item key="shouquan">
                <ShopAuth id={record.shopId} shopName={record.shopName} onEnd={this.refresh} shopStatus={record.status}/>
              </Menu.Item>);
          }
          if (this.props.isBd && permission('VISITRECORD_QUERY_PC')) {
            items.push(<Menu.Item key="xiaoji">
                  <a target="_blank" href={'#/record/shop?shopId=' + record.shopId}>拜访小记</a>
                </Menu.Item>);
          }
          // 修改费率
          if (permission('MODIFY_SHOP_RATE') && record.status === 'OPEN' && record.shopType === 'COMMON') {
            items.push(
              <Menu.Item key="7">
                <RateModal showTxt={this.state.showTxt} id={record.shopId} pId={record.merchantPid} categoryId= {record.categoryId}/>
              </Menu.Item>
              );
          }
          if (hasSignPermisson()) {
            items.push(
              <Menu.Item key="sign">
                <a href="javascript: void(0)" onClick={this.selectSignProd.bind(this, record)}>签约</a>
              </Menu.Item>
            );
          }

          this.menu = (<Menu onClick={this.onClick}>{items}</Menu>);
          return (<span>
            {permission('SHOP_DETAIL') && <a href="#" onClick={this.gotoDetail.bind(this, record.shopId, record.shopType)}>查看</a>}
            {permission('SHOP_DETAIL') && <span className="ant-divider"></span>}
            <Dropdown overlay={this.menu} trigger={['click']}>
              <a className="ant-dropdown-link">
                更多 <Icon type="down"/>
              </a>
            </Dropdown>
          </span>);
        },
      },
    ];
    return {
      columns,
      data: [],
      loading: false,
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
    };
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

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
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
      url: window.APP.kbsalesUrl + (this.props.isPosSale ? '/shop/koubei/teamPosSaleShops.json' : '/shop/koubei/teamShops.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        // result.data = result.data || {};
        const pagination = {...this.state.pagination};
        pagination.total = result.total;
        this.setState({
          loading: false,
          data: result.data || [],
          pagination,
        });
      },
      error: (err) => {
        if (err) {
          message.warn(err.resultMsg);
        }
        this.setState({
          loading: false,
        });
      }
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
    const {columns, loading, data, pagination} = this.state;
    return (
      <div>
        <Table className="kb-shop-list-table"
          columns={columns}
          rowKey={r => r.shopId}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
        <div id="sign-prod-modal" />
      </div>
    );
  },
});

export default TeamShopListTable;
