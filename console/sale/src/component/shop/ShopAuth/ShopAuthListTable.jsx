import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import Table from '../../../common/Table';
import {padding} from '../../../common/dateUtils';
import {authTypesMap} from '../../../common/authTypesMap';
import CancelAuth from '../common/CancelAuth';

export function format(d) {
  return d ? d.getFullYear() + '-' + padding(d.getMonth() + 1) + '-' + padding(d.getDate() + ' ' + padding(d.getHours()) + ':' + padding(d.getMinutes()) + ':' + padding(d.getSeconds())) : '';
}

const ShopAuthListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const self = this;
    const columns = [
      {
        title: '门店名称',
        dataIndex: 'shopName',
        width: 190,
      },
      {
        title: '授权时间',
        dataIndex: 'authTime',
        width: 190,
        render(text) {
          return text ? format(new Date(parseInt(text, 10))) : '';
        },
      },
      {
        title: '权限类型',
        dataIndex: 'authTypes',
        width: 190,
        render(text) {
          return (text || []).map(r => authTypesMap[r] || r).join('、');
        },
      },
      {
        title: '员工名称',
        dataIndex: 'staffRealName',
        width: 190,
        render(text, record) {
          return record.staffNickName ? text + '(' + record.staffNickName + ')' : text;
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 100,
        render(text, record) {
          const authPermission = ['OPEN', 'FREEZE', 'PAUSED'].indexOf(record.shopStatusCode) >= 0;
          return (<span>
            {permission('SHOP_AUTH') && authPermission && <CancelAuth type="text" selectedRows={[{...record}]} onEnd={self.refresh} buttonText="停止授权" />}
          </span>);
        },
      },
    ];
    this.rowSelection = {
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    };
    return {
      columns,
      data: [],
      loading: false,
      selectedRows: [],
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

  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    this.fetch(params);
  },

  onSelect(record, selected) {
    let {selectedRows} = this.state;
    if (selected) {
      if (selectedRows.map(r => r.shopId).indexOf(record.shopId) === -1) {
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
        if (selectedRows.map(r => r.shopId).indexOf(record.shopId) === -1) {
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

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },

  transformData(data) {
    return data.map((row) => {
      row.key = row.shopId;
      if (row.authInfo) {
        row.children = [];
        const subData = JSON.parse(row.authInfo);
        const subList = [];
        Object.keys(subData).forEach((staffId) => {
          const subRowList = subData[staffId];
          const firstRow = subRowList[0];
          subList.push({
            staffId,
            authTypes: subRowList.map(r => r.staffRelationType),
            ...firstRow,
          });
        });
        subList.sort((a, b) => {
          return b.staffCreateTime - a.staffCreateTime;
        });
        subList.forEach((subRow, i) => {
          if (i === 0) {
            row.authTime = subRow.staffCreateTime * 1000;
            row.staffRealName = subRow.real_nm;
            row.staffNickName = subRow.real_nm !== subRow.nick ? subRow.nick : '';
            row.authTypes = subRow.authTypes;
            row.staffId = subRow.staffId;
          } else {
            row.children.push({
              key: row.shopId + i,
              shopId: row.shopId,
              shopName: '',
              shopStatusCode: row.shopStatusCode,
              authTime: subRow.staffCreateTime * 1000,
              authTypes: subRow.authTypes,
              staffId: subRow.staffId,
              staffRealName: subRow.real_nm,
              staffNickName: subRow.real_nm !== subRow.nick ? subRow.nick : '',
            });
          }
        });
        if (row.children.length === 0) {
          delete row.children;
        }
        delete row.authInfo;
      }
      return row;
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
      url: window.APP.crmhomeUrl + '/shop/koubei/authList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        const data = this.transformData(result.data.data || []);
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalItems;
        this.setState({
          loading: false,
          data,
          pagination,
        });
      },
    });
  },

  render() {
    const {columns, loading, data, pagination, selectedRows} = this.state;

    const buttonArea = (
      permission('SHOP_AUTH') && !loading && data.length > 0 && (<div>
          <span style={{marginRight: 12}}>已选({selectedRows.length})</span>
          <CancelAuth onEnd={this.refresh} selectedRows={selectedRows} buttonText="停止授权" multiple/>
        </div>
      )
    );

    return (
      <div>
        {buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
        <Table columns={columns}
          rowSelection={this.rowSelection}
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

export default ShopAuthListTable;
