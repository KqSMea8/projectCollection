import {Tag} from 'antd';
import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import React, {PropTypes} from 'react';
import MoreAction from './MoreAction';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import { LeadsTagToShow } from '../common/leadsTagEnums';
// import LeadsAlloc from '../common/LeadsAlloc';

const TeamLeadsTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '门店名称／leadsID',
      width: 115,
      dataIndex: 'name',
      render(_, r) {
        const labelDom = (r.labelInfos || []).map(i => LeadsTagToShow[i] && <Tag color="red" key={i}>{LeadsTagToShow[i]}</Tag>);
        const name = r.name + (r.branchName ? '(' + r.branchName + ')' : '');
        return (<div>
          {labelDom}
          <div>{name}</div>
          {r.leadsId || ''}
        </div>);
      },
    }, {
      title: '公司名称',
      width: 95,
      dataIndex: 'companyName',
    }, {
      title: '区域',
      width: 95,
      dataIndex: 'address',
      render(_, r) {
        return r.provinceName + '-' + r.cityName + (r.districtName ? ('-' + r.districtName) : '') + ' ' + r.address;
      },
    }, {
      title: '品类',
      width: 95,
      dataIndex: 'categoryName',
    }, {
      title: '品牌',
      width: 95,
      dataIndex: 'brandName',
    }, {
      title: '联系人',
      width: 95,
      dataIndex: 'contactsName',
      render(_, r) {
        return (<div>
          <div> {r.contactsName} </div>
          <div> {r.contactsPhone} </div>
        </div>);
      },
    }, {
      title: '状态',
      width: 55,
      dataIndex: 'statusDesc',
    }, {
      title: '归属人',
      width: 95,
      dataIndex: 'bdName',
    }, {
      title: '操作',
      width: 95,
      dataIndex: '',
      render: (_, r) => {
        return (<div>
          <a href={'#/leads/detail/' + r.leadsId + '/public'}>查看</a>
          {(r.statusDesc !== '已认领' && this.state.isBd && permission('VISITRECORD_QUERY_PC')) ? <span>
            &nbsp;<span className="ant-divider"></span>&nbsp;<a target="_blank" href={'#/record/leads?leadsId=' + r.leadsId}>拜访小记</a></span> : null}

          {r.statusDesc === '已认领' ?
          <span>&nbsp;<span className="ant-divider"></span>&nbsp;
          <MoreAction id={r.leadsId} isBd={this.state.isBd} power={this.power} refresh={this.refresh}/></span> : null }
        </div>);
      },
    }];
    // this.rowSelection = {
    //  onSelect: this.onSelect,
    //  onSelectAll: this.onSelectAll,
    // };
    return {
      data: [],
      selectedIds: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: this.showTotal,
        pageSize: 10,
        current: 1,
      },
      loading: false,
    };
  },
  componentDidMount() {
    this.queryLoginRole();
  },
  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
    }
  },
  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    if (pager.current !== pagination.current || pager.pageSize !== pagination.pageSize) {
      this.setState({
        selectedIds: [],
      });
    }
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      current: pagination.current,
    };
    this.fetch(params);
  },
  onSelect(record, selected) {
    let {selectedIds} = this.state;
    if (selected) {
      if (selectedIds.indexOf(record.id) === -1) {
        selectedIds = selectedIds.concat(record.id);
      }
    } else {
      selectedIds = selectedIds.filter((r)=> {
        return r.id !== record.id;
      });
    }
    this.setState({selectedIds});
  },
  onSelectAll(selected, selectedRows) {
    if (selected) {
      this.setState({
        selectedIds: selectedRows.map(r=>r.id),
      });
    } else {
      this.setState({
        selectedIds: [],
      });
    }
  },
  refresh(update) {
    const {pageSize, current} = this.state.pagination;
    this.onTableChange({
      current: update ? current : 1,
      pageSize,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    if (params.current) {
      params.pageNum = params.current;
    }
    this.setState({loading: true});
    ajax({
      url: '/sale/leads/queryTeam.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalCount;
        this.power = result.power;
        this.setState({
          loading: false,
          data: result.data.queryResult.shopLeadses,
          pagination,
        });
      },
    });
  },
  showTotal(total) {
    return `共 ${total} 条`;
  },

  queryLoginRole() {
    // 查询访客角色
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
  render() {
    const {data, pagination, loading} = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
                 rowSelection={this.rowSelection}
                 rowKey={r => r.leadsId}
                 dataSource={data}
                 firstShow={!this.props.params}
                 pagination={pagination}
                 loading={loading}
                 onChange={this.onTableChange}/>
        </div>
      </div>
    );
  },
});

export default TeamLeadsTable;
