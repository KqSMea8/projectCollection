import {message, Tag} from 'antd';
import ajax from 'Utility/ajax';
import Table from '../../../../common/Table';
import React, {PropTypes} from 'react';
// import MoreAction from '../MoreAction';
// import {remoteLog, appendOwnerUrlIfDev} from '../../../../common/utils';
import { PosLeadsTagObj } from '../../common/PosLeadsTagEnums';

const PublicPosLeadsTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const columns = [{
      title: '门店名称/ID/标签',
      width: 150,
      dataIndex: 'name',
      render(_, r) {
        const labelDom = r.labelInfos.map(key => PosLeadsTagObj[key] && <Tag color="red" key={key}>{PosLeadsTagObj[key]}</Tag>);
        const name = r.name + (r.branchName ? '(' + r.branchName + ')' : '');
        return (<div>
          {labelDom}
          <div>{name}</div>
          <div>{r.shopId || ''}</div>
        </div>);
      },
    }, {
      title: '地址',
      width: 200,
      dataIndex: 'address',
      render(_, r) {
        return r.provinceName + '-' + r.cityName + (r.districtName ? ('-' + r.districtName) : '') + ' ' + r.address;
      },
    }, {
      title: '操作',
      width: 50,
      dataIndex: '',
      render: (_, r) => {
        return (<div>
          <a onClick={this.claim.bind(this, r.leadsId)}>认领</a>
          <span className="ant-divider"></span>
          <a target="_blank" onClick={this.onClick.bind(this, r.leadsId)}>详情</a>
        </div>);
        // return (<div>
        //   {this.power.indexOf('LEADS_CLAIM') !== -1 ? <span><a onClick={this.claim.bind(this, r.leadsId)}>认领</a>
        //     &nbsp; <span className="ant-divider"></span> &nbsp;</span> : null}
        //   <MoreAction id={r.leadsId} power={this.power} refresh={this.refresh}/>
        // </div>);
      },
    }];
    return {
      columns: columns,
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 个记录`,
        // current: 1,
        pageNum: 1,
      },
      loadingCategory: true,
      loading: false,
    };
  },
  componentDidMount() {
    const { pagination } = this.state;
    const page = {};
    page.pageNum = pagination.pageNum;
    page.pageSize = pagination.pageSize;
    this.fetch(page);
  },
  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
    }
  },

  onClick(leadsId, e) {
    e.preventDefault();
    window.open(`#/posLeads/detail/${leadsId}?type=public`);
    // window.location.hash = `#/posLeads/detail/${leadsId}`;
  },
  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.pageNum = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pager.pageSize,
      pageNum: pager.pageNum,
    };
    this.fetch(params);
  },
  refresh(update) {
    const {pageSize, pageNum} = this.state.pagination;
    this.onTableChange({
      current: update ? pageNum : 1,
      pageSize,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    if (params.pageNum) {
      params.pageNum = params.pageNum;
    }
    // if (params.categoryId) {
    //   const categories = params.categoryId.split(',');
    //   do {
    //     params.categoryId = categories.pop();
    //   } while (!params.categoryId);
    // }
    this.setState({loading: true});
    ajax({
      url: window.APP.kbsalesUrl + '/leads/posleads/queryPublic.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.total;
        // this.power = result.power;
        this.setState({
          loading: false,
          data: result.data,
          pagination,
        });
      },
      error: () => {
        this.setState({
          loading: false,
        });
      }
    });
  },
  claim(leadsId, e) {
    e.preventDefault();
    // remoteLog('LEADS_CLAIM');
    ajax({
      url: '/sale/leads/claim.json',
      method: 'post',
      data: {
        leadsId,
      },
      success: () => {
        this.refresh(true);
        message.success('认领成功');
      },
    });
  },

  render() {
    const {columns, data, pagination, loading} = this.state;
    return (<div>
      <Table columns={columns}
        bordered
        rowKey={r => r.leadsId}
        dataSource={data}
        firstShow={!this.props.params}
        pagination={pagination}
        loading={loading}
        onChange={this.onTableChange} />
      </div>);
  },
});

export default PublicPosLeadsTable;
