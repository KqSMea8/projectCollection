import React from 'react';
import PropTypes from 'prop-types';
import {Table, Tag} from 'antd';
import uniqueId from 'lodash/uniqueId';
import isEqual from 'lodash/isEqual';
import fetch from '@alipay/kb-fetch';
import permission from '@alipay/kb-framework/framework/permission';
import {Divider} from '@alipay/kb-framework-components/lib/layout';
import AssignBDModal from './AssignBDModal';

class ListTable extends React.Component {
  static propTypes = {
    /* eslint react/forbid-prop-types:0 */
    search: PropTypes.object,
  };
  static defaultProps = {
    search: {},
  };

  constructor() {
    super();
    this.state.pagination = {...this.initialPagination};
  }

  state = {
    pagination: {},
    list: [],
    loading: false
  };

  componentDidMount() {
    this.loadList();
  }

  componentWillReceiveProps(next) {
    if (isEqual(next.search, this.props.search)) {
      return;
    }
    this.loadList({search: next.search, next: 1});
  }
  initialPagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: 1,
    total: 0,
    pageSize: 10
  };
  columns = [
    {title: '商户名称', dataIndex: 'name', key: 'name', width: 100 },
    {title: '商户PID', dataIndex: 'pid', key: 'pid', width: 100 },
    {
      title: '商户标签',
      dataIndex: 'labels',
      key: 'labels',
      render: (v) => v.map((item, ix) => (<Tag key={uniqueId(ix)}>{item}</Tag>)),
      width: 100,
    },
    {
      title: '归属人',
      dataIndex: 'bds',
      key: 'bds',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: '-',
      key: '-',
      width: 50,
      render: (t, r) => this.renderActions(r)
    }
  ];
  loadList = ({next, search, pageSize} = {}) => {
    const {pagination} = this.state;
    let requestParams;
    if (search) {
      requestParams = {...search};
    } else {
      requestParams = {...this.props.search};
    }
    if (requestParams.bd) {
      requestParams.bdName = search.bd.realName;
    }
    requestParams.isPc = '0';
    delete requestParams.bd;
    fetch({
      url: 'kbsales.merchantSpiService.queryMerchantInfoList',
      param: {
        pageSize: pageSize || pagination.pageSize,
        pageNo: next || pagination.current,
        ...requestParams,
      }
    })
      .then((resp) => {
        this.setState({
          list: resp.data.data,
          pagination: {
            ...pagination,
            pageSize: pageSize || pagination.pageSize,
            current: next || pagination.current,
            total: resp.data.totalItems,
          },
          loading: false
        });
      });
  };
  handleViewMerchant = (pid) => {
    this.props.history.push(`/tka/merchant/detail/${pid}`);
  };
  handleAddBaoDan = (r) => {
    window.open(`/sale/bohIndex.htm#/managereport/addreport?merchantName=${encodeURIComponent(r.name)}&merchantId=${r.pid}`);
  };
  handleAssignBD = (pid) => {
    this.assignBdModal.open(pid);
  };
  handleAssignBDOk = () => {
    this.assignBdModal.close();
    this.loadList();
  };
  assignBdModal = null;
  MERCHANT_QUERY_DETAIL = permission('MERCHANT_QUERY_DETAIL');
  MERCHANT_BD_CHANGE = permission('MERCHANT_BD_CHANGE');
  POS_REPORT_ORDER_MERCHANT = permission('POS_REPORT_ORDER_MERCHANT');
  renderActions = (r) => {
    return (
      <div>
        {[
          this.MERCHANT_QUERY_DETAIL && <span className="kb-action-link" onClick={() => this.handleViewMerchant(r.pid)}>查看</span>,
          this.MERCHANT_QUERY_DETAIL && <Divider/>,
          this.POS_REPORT_ORDER_MERCHANT && <span className="kb-action-link" onClick={() => this.handleAddBaoDan(r)}>报单</span>,
          this.POS_REPORT_ORDER_MERCHANT && <Divider/>,
          this.MERCHANT_BD_CHANGE && <span className="kb-action-link" onClick={() => this.handleAssignBD(r.pid)}>分配</span>,
          this.MERCHANT_BD_CHANGE && <Divider/>,
        ].slice(0, -1)}
      </div>
    );
  };
  render() {
    const {pagination, list, loading} = this.state;
    return (
      <div>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={list}
          rowKey={r => r.pid}
          pagination={{
            ...pagination,
            onChange: next => this.loadList({next}),
            onShowSizeChange: (current, pageSize) => this.loadList({next: current, pageSize})
          }}
        />
        <AssignBDModal ref={c => this.assignBdModal = c} onSubmitOk={this.handleAssignBDOk}/>
      </div>
    );
  }
}

export default ListTable;
