import React, { PropTypes } from 'react';
import { Table, message } from 'antd';
import ajax from '../../../../common/ajax';

import BrandActivityAction from './BrandActivityAction';
import {activityType, retailersInviteStatus, retailersActStatusNEW} from '../../config/AllStatus';
import TableActions from '../../../../common/TableActions';


function rowKey(record) {
  return record.orderId;
}

const BrandActivityTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  mixins: [TableActions],

  getDefaultProps() {
    return ({
      templateType: 'ALL',
      templateStatus: 'ALL',
    });
  },

  getInitialState() {
    this.columns = [{
      title: '活动名称',
      // dataIndex: 'activityName',
      width: 220,
      render: (text, record) => {
        return (<div>
          {record.activityName}
          {
            record.enterpriseBenifit && <span style={{color: 'red'}}>[口福]</span>
          }
        </div>);
      },
    }, {
      title: '活动时间',
      width: 240,
      render: (text, record) => {
        return (
          <div>
            <p>活动时间：<br/>{record.activityStartTime} - {record.activityEndTime}</p>
            <p>确认时间：{record.confirmTime}</p>
          </div>
        );
      },
    }, {
      title: '创建人',
      width: 130,
      dataIndex: 'inviterName',
      render: (text, record) => {
        // 如果是口福活动，只展示创建人
        if (record.enterpriseBenifit) {
          return (<p>{text}</p>);
        }

        return record.planOutBizType ?
          (<p>{text}
            <span style={{color: 'red'}}>{record.planOutBizType === 'BIZTYPE_MALL_CAMPAIGN' ? '[商圈]' : '[品牌商]'}</span>
          </p>) : <p>{text} <span style={{color: 'red'}}>[品牌商]</span></p>;
      },
    }, {
      title: '活动类型',
      width: 80,
      dataIndex: 'activityType',
      render: (text, record) => {
        return (
          <div>
            <p>{activityType[text]}</p>
            {
              record.needKBSettle && record.settleType === 'T1' ? (<p style={{
                marginTop: 5,
              }}><span className="status orangeLight">自动结算</span></p>) : null
            }
            {
              record.needKBSettle && record.settleType === 'T0' ? (<p style={{
                marginTop: 5,
              }}><span className="status orangeLight">实时结算</span></p>) : null
            }
            {
              record.bigBrandBuy ? (<p style={{
                marginTop: 5,
              }}><span className="status orangeLight">大牌快抢</span></p>) : null
            }
          </div>
        );
      },
    }, {
      title: '邀约状态',
      width: 80,
      dataIndex: 'inviteStatus',
      render: (text) => {
        return (
          <span style={{color: retailersInviteStatus[text].color}}>{retailersInviteStatus[text].text}</span>
        );
      },
    }, {
      title: '活动状态',
      width: 100,
      dataIndex: 'activityStatus',
      render: (text) => {
        return (
          <span style={{color: retailersActStatusNEW[text].color}}>{retailersActStatusNEW[text].text}</span>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      render: (text, record, index) => {
        return (<BrandActivityAction
            isAllowModifyShop={this.state.isAllowModifyShop}
            item={record}
            index={index}
            isKbserv={this.state.isKbserv}
            refresh={this.refresh} />);
      },
    }];

    return {
      data: [],
      isAllowModifyShop: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      loading: true,
    };
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});

    if (!params.activityName) {
      delete params.activityName;
    }

    if (params.activityStatus === 'all') {
      delete params.activityStatus;
    }

    if (params.inviteStatus === 'PLAN_GOING') {
      delete params.inviteStatus;
    }
    let url = '';
    if (params.activityStatus || params.activityName || params.inviteStatus || params.activityTime === '2') {
      url = '/promo/recruit/queryListNew.json';
    } else {
      url = '/promo/recruit/queryList.json';
    }
    ajax({
      url: url,
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          const pagination = {...this.state.pagination};
          pagination.total = res.page.totalSize;
          this.setState({
            loading: false,
            data: res.data,
            isAllowModifyShop: res.isAllowModifyShop,
            isKbserv: res.isKbservLogin,
            pagination,
          });
        } else {
          message.error(res.errorMsg);
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        }, () => {
          message.error(res.errorMsg);
        });
      },
    });
  },


  render() {
    const {data, pagination, loading} = this.state;
    const locale = {};

    if (this.props.params) {
      locale.emptyText = '搜不到结果，换下其他搜索条件吧~';
    } else {
      locale.emptyText = '暂无数据，请输入查询条件搜索';
    }
    return (
      <div>
        <Table bordered
          columns={this.columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          locale={locale}
          onChange={this.onTableChange}
          rowKey={rowKey}
          />
      </div>

    );
  },
});

export default BrandActivityTable;
