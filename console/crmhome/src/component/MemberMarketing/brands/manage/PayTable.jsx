import React, { PropTypes } from 'react';
import { Table, message } from 'antd';
import ajax from '../../../../common/ajax';
import PayAction from './PayAction';
import {activityType, retailersActStatusNEW} from '../../config/AllStatus';
import TableActions from '../../../../common/TableActions';

function rowKey(record) {
  return record.activityId;
}

const PayTable = React.createClass({
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
    let activityStatus = retailersActStatusNEW;
    // 如果是口碑福利活动，对应活动状态的map不同
    if (this.props.params && this.props.params.ebProvider) {
      activityStatus = {
        ...activityStatus,
        PLAN_ONGOING: {
          text: '招商中',
          color: 'orange',
        },
        STARTED_UNAVAILABLE: {
          text: '已发布未开始',
          color: 'color',
        },
        STARTED_AVAILABLE: {
          text: '已发布已开始',
          color: 'blue',
        },
        CLOSED: {
          text: '已结束',
          color: 'gray',
        },
        DISABLED: {
          text: '已废弃',
          color: 'gray',
        },
      };
    }

    this.columns = [{
      title: '活动名称',
      dataIndex: 'activityName',
      width: 150,
      render: (text, record) => {
        return (<div style={{overflow: 'hidden'}}>{ record.planOutBizType ?
          (<p>{text}<span style={{color: 'red'}}>[会员]</span></p>) : text}</div>);
      },
    }, {
      title: '活动时间',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <p>活动时间：<br/>{record.activityStartTime} - {record.activityEndTime}</p>
            <p>确认时间：{record.confirmTime}</p>
          </div>
        );
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
              record.needKBSettle ? (<p style={{marginTop: 5}}><span className="status orangeLight">自动结算</span></p>) : null
            }
            {
              record.bigBrandBuy ? (<p style={{marginTop: 5}}><span className="status orangeLight">大牌快抢</span></p>) : null
            }
          </div>
        );
      },
    }, {
      title: '活动状态',
      width: 80,
      dataIndex: 'activityStatus',
      render: (text) => {
        return (
          <span style={{color: activityStatus[text].color}}>{activityStatus[text].text}</span>
        );
      },
    }, {
      title: '活动数据',
      width: 100,
      dataIndex: 'cnt',
      render: (cnt) => {
        const { totalTakenCnt = '--', totalUsedCnt = '--' } = cnt || {};
        return (
          <div>
            {(this.props.params && this.props.params.ebProvider) ? null : <p>发券: {totalTakenCnt}</p>}
            <p>核券: {totalUsedCnt}</p>
          </div>
        );
      },
    }, {
      title: '创建人',
      width: 100,
      render: (record) => {
        const { sourceChannelName = '-', creator = '-' } = record || {};
        return (
          <span> {sourceChannelName === '-' ? '' : (sourceChannelName + '-')}{creator} </span>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      render: (text, record, index) => {
        return (<PayAction
          item={record}
          index={index}
          refresh={this.refresh}
          onlineModify={this.state.onlineModify}/>);
      },
    }];

    if (this.props.params && this.props.params.ebProvider) {
      this.columns.splice(3, 0, {
        title: '邀约状态',
        dataIndex: 'inviteStatus',
        width: 100,
      });
    }

    return {
      data: [],
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

    ajax({
      url: '/promo/brand/list.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          const pagination = {...this.state.pagination};
          pagination.total = res.page.totalSize;
          this.setState({
            loading: false,
            data: res.activityList,
            pagination,
            onlineModify: res.onlineModify,
          });
          res.activityList.forEach(({ activityId }, index) =>{
            ajax({
              url: 'promo/brand/marketCount.json',
              method: 'get',
              data: {activityId},
              type: 'json',
              success: (res2) => {
                if (res2.status === 'success') {
                  const { totalTakenCnt, totalUsedCnt } = res2;
                  if (totalTakenCnt && totalUsedCnt) {
                    const cnt = { totalTakenCnt, totalUsedCnt };
                    const { data } = this.state;
                    data[index].cnt = cnt;
                    this.setState({ data });
                  }
                }
              },
            });
          });
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        });
        message.error(res.errorMsg);
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

export default PayTable;
