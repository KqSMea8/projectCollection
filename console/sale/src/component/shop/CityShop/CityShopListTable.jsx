import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import Table from '../../../common/Table';
import {remoteLog} from '../../../common/utils';
import {message} from 'antd';
import {logGoodsShopTypeMap, logGoodsShopTypeList} from '../../../common/OperationLogMap';
import ShowTag from '../common/ShowTag';
import {statusMap} from '../../../common/ShopStatusSelect';

const CityShopListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    isBd: PropTypes.bool,
  },

  getInitialState() {
    return {
      data: [],
      loading: false,
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

  componentDidMount() {
    //  this.refresh();
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
      window.open('#/shop/detail/' + shopId);
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
    if (permission('SHOP_QUERY_ALL_OF_THE_CITY')) {
      ajax({
        url: window.APP.kbsalesUrl + '/shop/koubei/queryAllShopsOfTheCity.json',
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
        error: (result) => {
          message.warn(result.resultMsg);
          this.setState({
            loading: false,
          });
        },
      });
    } else {
      message.warn('你没有权限操作');
      this.setState({
        loading: false,
      });
    }
  },

  render() {
    const {loading, data, pagination} = this.state;
    const columns = [
      {
        title: '门店ID/门店名称',
        dataIndex: 'shopId',
        width: 360,
        render(text, record) {
          const tmpArr = record.shopSaleLabels || [];
          if (record.ifRka === '1' && tmpArr.indexOf('RKA') === -1) { tmpArr.push('RKA');}
          if (record.ifTka === '1' && tmpArr.indexOf('TKA') === -1) { tmpArr.push('TKA');}
          return (<div className="shopIdWrapper">
            <ShowTag shopSaleLabels= {tmpArr} />
            <p>{text}</p>
            <p>{record.shopName}</p>
            <p style={{color: '#FF6600'}}>{record.mallName ? <span>[{record.mallName}]</span> : null}</p>
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
        title: '归属BD',
        dataIndex: 'bdRealName',
        width: 90,
        render(text, record) {
          return record.bdNickName ? [text, <br key="1"/>, '(' + record.bdNickName + ')'] : text;
        },
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
        width: 100,
        render(text, record) {
          const address = [record.provinceName, record.cityName, record.districtName].filter(r => r).join('-') + ' ' + text;
          const list = [address];
          list.push(<br key="1"/>);
          list.push('Tel：' + record.mobile);
          return list;
        },
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
        title: '品牌名称',
        dataIndex: 'brandName',
        width: 80,
      },
      {
        title: '门店状态',
        dataIndex: 'status',
        width: 80,
        render(text, record) {
          // const statusList = {
          //   'OPEN': '营业',
          //   'FREEZE': '冻结',
          //   'PAUSED': '签约失效',
          //   'CLOSED': '已下架',
          // };
          const status = statusMap[text] || text;
          // const displayStatus = {1: '显示', 0: '不显示', };
          const displayStatus = record.displayStatus === '1' ? '显示' : '隐藏';
          return (status ? status + '-' : '') + displayStatus;
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 100,
        render: (text, record) => {
          return (<span>
            {permission('SHOP_DETAIL') && <a href="#" onClick={this.gotoDetail.bind(this, record.shopId, record.shopType)}>查看</a>}
          </span>);
        },
      },
    ];
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
      </div>
    );
  },
});

export default CityShopListTable;
