import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import Table from '../../../common/Table';
import {tagMap} from '../../../common/ShopTagSelect';
import {format} from '../../../common/dateUtils';
import ShopAlloc from '../common/ShopAlloc';
import ShowTag from '../common/ShowTag';
import {logGoodsShopTypeMap, logGoodsShopTypeList} from '../../../common/OperationLogMap';

const ManualAllocListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    isPosSale: PropTypes.bool,
  },

  getInitialState() {
    const columns = [
      {
        title: ['门店名称', <br key="1"/>, '门店ID'],
        dataIndex: 'shopName',
        width: 200,
        render(text, record) {
          return (<span>
            {text}<br/>
            {record.shopId}<br/>
            <span style={{color: '#FF6600'}}>{record.mallName ? <span>[{record.mallName}]</span> : null}</span>
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
        title: '地址',
        dataIndex: 'address',
        width: 90,
        render(text, record) {
          return [record.provinceName, record.cityName, record.districtName].filter(r => r).join('-') + ' ' + text;
        },
      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        width: 150,
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        width: 60,
      },
      {
        title: this.props.isPosSale ? 'POS销售归属人' : '归属BD',
        dataIndex: '_',
        width: 120,
        render: (text, record) => {
          if (this.props.isPosSale) {
            return record.posSaleNickName ? [record.posSaleRealName, <br key="1"/>, '(' + record.posSaleNickName + ')'] : record.posSaleRealName;
          }
          return record.bdNickName ? [record.bdRealName, <br key="1"/>, '(' + record.bdNickName + ')'] : record.bdRealName;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'assignTime',
        width: 80,
        render(text) {
          return text ? format(new Date(text)) : '';
        },
      },
      this.props.isPosSale ? {width: 1} : {
        title: '服务商',
        dataIndex: 'brokerName',
        width: 90,
      },
      {
        title: ['门店', <br key="1"/>, '标签'],
        dataIndex: 'shopTagCodes',
        width: 80,
        render: (text) => {
          if (this.props.isPosSale) {
            return <ShowTag shopSaleLabels={text} pureTextMode />;
          }
          return text ? text.map(v => tagMap[v]).filter(v => v).join('、') : '';
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 100,
        render: (text, record) => {
          let isMall = '';
          if (record.shopType === 'MALL') {
            isMall = record.shopType;
          }
          const isPosSale = this.props.isPosSale;
          const hasAllowPermission = (!isPosSale && permission('SHOP_MANUAL_ASSIGN')) || (isPosSale && permission('SHOP_POS_SALE_MANUAL_ASSIGN'));
          const showDetail = (!isPosSale && permission('SHOP_DETAIL')) || (isPosSale && permission('POS_SALE_SHOP_DETAIL'));
          const showAllow = hasAllowPermission && ['OPEN', 'FREEZE', 'PAUSED'].indexOf(record.shopStatusCode || record.status) >= 0;
          const isPosSaleQuery = this.props.isPosSale ? '?isPosSale=1' : '';
          return (<span>
            {(showDetail && (isMall !== 'MALL')) && <a href={'#/shop/detail/' + record.shopId + isPosSaleQuery} target="_blank">查看</a>}
            {(showDetail && (isMall === 'MALL')) && <a href={'#/mall/detail/' + record.shopId} target="_blank">查看</a>}
            {showDetail && showAllow && <span className="ant-divider" />}
            {showAllow && <ShopAlloc type="text" selectedRows={[{...record}]} onEnd={this.refresh} isManual isPosSale={isPosSale} />}
          </span>);
        },
      },
    ];
    this.rowSelection = {
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      getCheckboxProps: (record) => {
        const canAllow = ['OPEN', 'FREEZE', 'PAUSED'].indexOf(record.shopStatusCode || record.status) >= 0;
        return canAllow ? {} : { disabled: true };
      }
    };
    return {
      columns,
      data: [],
      loading: true,
      selectedRows: [],
      assignedPrincipalIds: [],
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
    this.refresh();
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

  onSelect(record, selected) {
    let {selectedRows} = this.state;
    if (selected) {
      const selectedIds = selectedRows.map(r => r.shopId);
      if (selectedIds.indexOf(record.shopId) === -1) {
        selectedRows = selectedRows.concat({...record});
      }
    } else {
      selectedRows = selectedRows.filter((row)=> {
        return row.shopId !== record.shopId;
      });
    }
    this.setState({selectedRows});
  },

  onSelectAll(selected, _, changeRows) {
    let {selectedRows} = this.state;
    changeRows.forEach((record) => {
      if (selected) {
        const selectedIds = selectedRows.map(r => r.shopId);
        if (selectedIds.indexOf(record.shopId) === -1) {
          selectedRows = selectedRows.concat({...record});
        }
      } else {
        selectedRows = selectedRows.filter((row)=> {
          return row.shopId !== record.shopId;
        });
      }
    });
    this.setState({selectedRows});
  },

  refresh(needClear) {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
      needClear,
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
    if (this.props.isPosSale) {
      ajax({
        url: `${window.APP.kbsalesUrl}/shop/koubei/shopAssignPosSaleShops.json`,
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          const pagination = {...this.state.pagination};
          pagination.total = result.total;
          const newState = {
            loading: false,
            data: result.data || [],
            pagination,
          };
          if (pageParams.needClear) {
            newState.selectedRows = [];
          }
          this.setState(newState);
        },
      });
    } else {
      ajax({
        url: window.APP.crmhomeUrl + '/shop/koubei/manualAssignList.json',
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          result.data = result.data || {};
          const pagination = {...this.state.pagination};
          pagination.total = result.data.totalItems;
          const newState = {
            loading: false,
            data: result.data.data || [],
            pagination,
          };
          if (pageParams.needClear) {
            newState.selectedRows = [];
          }
          this.setState(newState);
        },
      });
    }
  },

  rowKey(record) {
    return record.shopId;
  },

  render() {
    const {columns, loading, data, pagination, selectedRows} = this.state;
    const isPosSale = this.props.isPosSale;
    const hasAllocPermission = (!isPosSale && permission('SHOP_MANUAL_ASSIGN')) || (isPosSale && permission('SHOP_POS_SALE_MANUAL_ASSIGN'));
    const buttonArea = (
      hasAllocPermission && !loading && data.length > 0 && (<div>
          <span style={{marginRight: 12}}>已选({selectedRows.length})</span>
          <ShopAlloc selectedRows={selectedRows} onEnd={this.refresh.bind(this, true)} isManual isPosSale={isPosSale}/>
        </div>
      )
    );
    this.rowSelection.selectedRowKeys = selectedRows.map((d) => d.shopId);
    return (
      <div>
        {buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
        <Table columns={columns}
          rowKey={this.rowKey}
          rowSelection={hasAllocPermission ? this.rowSelection : undefined}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
        {buttonArea && <div style={{marginTop: -44}}>{buttonArea}</div>}
      </div>
    );
  },
});

export default ManualAllocListTable;
