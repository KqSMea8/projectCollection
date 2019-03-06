import {Menu, Tag, message, Dropdown, Icon} from 'antd';
import ajax from 'Utility/ajax';
import Table from '../../../../common/Table';
import React, {PropTypes} from 'react';
import permission from '@alipay/kb-framework/framework/permission';
// import MoreAction from '../MoreAction';
// import {remoteLog, appendOwnerUrlIfDev} from '../../../../common/utils';
import { PosLeadsTagObj } from '../../common/PosLeadsTagEnums';
import ReleaseModal from '../ReleaseModal';

const PrivatePosLeadsTable = React.createClass({
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
      title: '归属人',
      width: 95,
      dataIndex: 'operatorName',
    }, {
      title: '认领时间',
      width: 95,
      dataIndex: 'claimDate',
    }, {
      title: '操作',
      width: 50,
      dataIndex: '',
      render: (_, r) => {
        const items = [];
        // permission('VISITRECORD_QUERY_PC')) this.state.isBd r.statusDesc !== '已认领'
        if (permission('VISITRECORD_QUERY_PC')) {
          items.push(
            <Menu.Item key="xiaoji">
              <a target="_blank" href={'#/record/pos_leads?leadsId=' + r.leadsId}>拜访小记</a>
            </Menu.Item>
          );
        }
        if (permission('POS_REPORT_ORDER_LEADS')) {
          items.push(
            <Menu.Item key="baodan">
              <a onClick={this.onClickBill.bind(this, r.leadsId, r.name)}>报单</a>
            </Menu.Item>
          );
        }
        if (permission('LEADS_RELEASE')) {
          items.push(
            <Menu.Item key="shifang">
              <a onClick={this.clickRelease.bind(this, r.leadsId)}>释放</a>
            </Menu.Item>
          );
        }
        const menu = (<Menu>{items}</Menu>);
        return (<div>
          <a target="_blank" onClick={this.onClick.bind(this, r.leadsId)}>详情</a>
          {
            items.length &&
            <span>
              <span className="ant-divider"></span>
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link">
                  更多 <Icon type="down"/>
                </a>
              </Dropdown>
            </span>
          }
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
      showReleaseModal: false,
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
  onClickBill(posLeadsId, posLeadsName, e) {
    e.preventDefault();
    window.open(`/sale/bohIndex.htm#/managereport/addreport?posLeadsId=${posLeadsId}&posLeadsName=${posLeadsName}`);
  },
  onClick(leadsId, e) {
    e.preventDefault();
    window.open(`#/posLeads/detail/${leadsId}?type=private`);
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

  onReleaseOk(values) {
    const { leadsId } = this.state;
    ajax({
      url: '/sale/leads/release.json',
      method: 'post',
      data: {
        ...values,
        leadsId,
      },
      success: () => {
        message.success('leads 释放成功');
        this.setState({
          showReleaseModal: false,
        });
        this.refresh(true);
      },
    });
  },

  onCancel() {
    this.setState({
      showReleaseModal: false,
    });
  },

  // queryLoginRole() {
  //   // 查询访客角色
  //   ajax({
  //     url: '/sale/visitrecord/queryLoginRole.json',
  //     success: (result) => {
  //       if (result.status === 'succeed') {
  //         const items = result.data;
  //         for (let i = 0; i < items.length; i++) {
  //           if (items[i] === 'bd') {
  //             this.setState({
  //               isBd: true,
  //             });
  //           } else if (items[i] === 'kaBd') {
  //             this.setState({
  //               isKaBd: true,
  //             });
  //           }
  //         }
  //       }
  //     },
  //     error: () => {},
  //   });
  // },

  clickRelease(leadsId, e) {
    e.preventDefault();
    this.setState({
      leadsId,
      showReleaseModal: true,
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
    this.setState({loading: true});
    ajax({
      url: window.APP.kbsalesUrl + '/leads/posleads/queryPrivate.json',
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
    const {data, pagination, loading, showReleaseModal} = this.state;
    return (<div>
      {showReleaseModal ? <ReleaseModal onOk={this.onReleaseOk} onCancel={this.onCancel}/> : null}
      <Table columns={this.state.columns}
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

export default PrivatePosLeadsTable;
