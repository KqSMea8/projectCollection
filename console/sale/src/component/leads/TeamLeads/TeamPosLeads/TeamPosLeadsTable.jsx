import {message, Tag} from 'antd';
import ajax from 'Utility/ajax';
import Table from '../../../../common/Table';
import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';
// import MoreAction from '../MoreAction';
// import {remoteLog, appendOwnerUrlIfDev} from '../../../../common/utils';
import fetch from '@alipay/kb-fetch';
import LeadsAllocModal from '../../common/LeadsAllocModal';
import { PosLeadsTagObj } from '../../common/PosLeadsTagEnums';

const TeamPosLeadsTable = React.createClass({
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
          <div>{name}</div>
          <div>{r.shopId || ''}</div>
          {labelDom}
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
      title: '归属人',
      width: 100,
      dataIndex: 'operatorName',
    }, {
      title: '操作',
      width: 50,
      dataIndex: '',
      render: (_, r) => {
        return (<div>
          {
            permission('POS_LEADS_ALLOCATE') &&
            <span>
              <a onClick={this.clickAlloc.bind(this, r.leadsId)}>分配</a>
              <span className="ant-divider"></span>
            </span>
          }
          <a target="_blank" onClick={this.onClick.bind(this, r.leadsId)}>详情</a>
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
        showTotal: (total) => `共 ${total} 个记录`,
        // current: 1,
        pageNum: 1,
      },
      showAllocModal: false,
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
    window.open(`#/posLeads/detail/${leadsId}?type=team`);
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

  onAllocOk(values) {
    const { leadsId } = this.state;
    let targetOpId = '';
    let isProvider = false;
    if (values.bucUser) {
      targetOpId = values.bucUser.id;
    } else if (values.alipayUser) {
      targetOpId = values.alipayUser.partnerId;
      isProvider = true;
    }
    const param = {
      leadsId,
      targetOpIdType: values.userType || window.APP.userType,
      targetOpId,
      isProvider,
    };
    fetch({
      url: 'kbsales.leadsManageService.allocatePosLeads',
      param,
    }).then(() => {
      message.success('leads 分配成功');
      this.setState({
        showAllocModal: false,
      });
      this.refresh(true);
    }).catch(() => {
    });
    // ajax({
    //   url: '/sale/leads/allocate.json',
    //   method: 'post',
    //   data: {
    //     leadsId,
    //     targetOpIdType: values.userType || window.APP.userType,
    //     targetOpId,
    //     isProvider,
    //   },
    //   success: () => {
    //     message.success('leads 分配成功');
    //     this.setState({
    //       showAllocModal: false,
    //     });
    //     this.refresh(true);
    //   },
    // });
  },

  onCancel() {
    this.setState({
      showAllocModal: false,
    });
  },

  clickAlloc(leadsId, e) {
    e.preventDefault();
    this.setState({
      leadsId,
      showAllocModal: true,
    });
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
      url: window.APP.kbsalesUrl + '/leads/posleads/queryTeam.json',
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

  render() {
    const {columns, data, pagination, loading, showAllocModal} = this.state;
    return (<div>
      {showAllocModal ? <LeadsAllocModal onOk={this.onAllocOk} onCancel={this.onCancel}/> : null}
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

export default TeamPosLeadsTable;
