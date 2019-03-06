import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import MoreAction from './MoreAction';
import {message, Tag} from 'antd';
import {remoteLog, appendOwnerUrlIfDev} from '../../../common/utils';
import { LeadsTagToShow } from '../common/leadsTagEnums';

const PublicLeadsTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    seachCondition: PropTypes.string,
  },

  getInitialState() {
    const columns = [{
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
      title: '区域',
      width: 95,
      dataIndex: 'address',
      render(_, r) {
        return r.provinceName + '-' + r.cityName + (r.districtName ? ('-' + r.districtName) : '') + ' ' + r.address;
      },
    }, {
      title: '品类',
      width: 95,
      // filters: [],
      // filterMultiple: false,
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
      title: '操作',
      width: 80,
      dataIndex: '',
      render: (_, r) => {
        return (<div>
          {this.power.indexOf('LEADS_CLAIM') !== -1 ? <span><a onClick={this.claim.bind(this, r.leadsId)}>认领</a>
            &nbsp; <span className="ant-divider"></span> &nbsp;</span> : null}
          <MoreAction id={r.leadsId} power={this.power} refresh={this.refresh}/>
        </div>);
      },
    }];
    return {
      columns: columns,
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
      loadingCategory: true,
      loading: false,
    };
  },
  componentWillMount() {
    if (this.props.seachCondition === 'condition') {
      this.fetch(this.state.pagination);
    }
  },
  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
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
      current: pagination.current,
    };
    this.fetch(params);
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
    if (params.categoryId) {
      const categories = params.categoryId.split(',');
      do {
        params.categoryId = categories.pop();
      } while (!params.categoryId);
    }
    this.setState({loading: true});
    if (this.props.seachCondition === 'map') {
      ajax({
        url: '/sale/leads/queryPublic.json',
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
    } else if (this.props.seachCondition === 'condition') {
      ajax({
        url: appendOwnerUrlIfDev('/sale/leads/queryPublicCondition.json'),
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
    }
  },
  claim(leadsId, e) {
    e.preventDefault();
    remoteLog('LEADS_CLAIM');
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
  showTotal(total) {
    return `共 ${total} 条`;
  },
  render() {
    const {data, pagination, loading} = this.state;
    return (
      <div>
        {pagination.total ? <div style={{margin: '-18px 0 10px', fontSize: '14px'}}>
          <span style={{width: '10px', height: '10px', background: '#ff6600', borderRadius: '100%', display: 'inline-block', marginRight: '5px'}}></span>
          当前筛选条件下未领leads有 <span style={{color: '#ff6600'}}>{pagination.total} </span>个
        </div> : null }
        <div>
          <Table columns={this.state.columns}
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

export default PublicLeadsTable;
