import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import React, {PropTypes} from 'react';
import {Tag} from 'antd';
import {History} from 'react-router';
import MoreAction from './MoreAction';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import {isEqual} from 'lodash';
import { LeadsTagToShow } from '../common/leadsTagEnums';

const PrivateLeadsTable = React.createClass({
  propTypes: {
    location: PropTypes.object,
  },
  mixins: [History],
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
      render: (_, r) => {
        let status = r.statusDesc;
        if (r.statusDesc === '已认领') {
          if (r.isCompleted === 'true') {
            status = '已认领（已补全信息）';
          } else {
            status = '已认领（待补全信息）';
          }
        }
        return status;
      },
    }, {
      title: '操作',
      width: 95,
      dataIndex: '',
      render: (_, r) => {
        return (<div>
          <a href={'#/leads/detail/' + r.leadsId + '/detail'}>查看</a>
          {(r.statusDesc !== '已认领' && this.state.isBd && permission('VISITRECORD_QUERY_PC')) ? <span>
            &nbsp;<span className="ant-divider"></span>&nbsp;<a target="_blank" href={'#/record/leads?leadsId=' + r.leadsId}>拜访小记</a></span> : null}
          {r.statusDesc === '已认领' ? <span>
            &nbsp;<span className="ant-divider"></span>&nbsp;
            <MoreAction categoryId= {r.categoryId} isBd={this.state.isBd} id={r.leadsId} power={this.power} refresh={this.refresh} isCompleted={r.isCompleted === 'true'}/>
          </span> : null}
        </div>);
      },
    }];
    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: this.showTotal,
      },
      loading: false,
    };
  },
  componentDidMount() {
    this.queryLoginRole();
    this.refresh();
  },

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.location.query, this.props.location.query)) {
      this.refresh();
    }
  },

  onTableChange(pagination) {
    const query = {
      ...this.props.location.query,
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    this.history.replaceState(null, '/private-leads/valid', query);
  },
  showTotal(total) {
    return `共 ${total} 条`;
  },

  refresh() {
    this.fetch();
  },
  fetch() {
    const params = {
      pageSize: 10,
      pageNum: 1,
      searchType: 'PRIVATE',
      privateType: 'EFFECTIVE',
      ...this.props.location.query,
    };
    if (params.categoryId) {
      const categories = params.categoryId.split(',');
      do {
        params.categoryId = categories.pop();
      } while (!params.categoryId);
    }
    this.setState({loading: true});
    ajax({
      url: '/sale/leads/queryPrivate.json',
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
    const query = this.props.location.query;
    return (
      <div>
        <div>
          <Table columns={this.columns}
                 rowKey={r=>r.leadsId}
                 dataSource={data}
                 pagination={{
                   ...pagination,
                   pageSize: parseInt(query.pageSize, 10) || 10,
                   current: parseInt(query.pageNum, 10) || 1,
                 }}
                 loading={loading}
                 onChange={this.onTableChange}/>
        </div>
      </div>
    );
  },
});

export default PrivateLeadsTable;
