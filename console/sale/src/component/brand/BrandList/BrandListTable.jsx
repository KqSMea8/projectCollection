import { Table, message} from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
import {activityType, retailersActStatusNEW} from '../common/AllStatus';
import MoreAction from './MoreAction';

function rowKey(record) {
  return record.activityId;
}

const BrandListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '活动名称',
      dataIndex: 'activityName',
      width: 150,
      render: (text, record) => {
        return record.planOutBizType === 'BIZTYPE_MEMBER_PLAN' ?
            (<p>{text}<span style={{color: 'red'}}>[精准营销]</span></p>) : text;
      },
    }, {
      title: '招商截止时间',
      dataIndex: 'confirmTime',
      width: 150,
    }, {
      title: '活动开始时间',
      dataIndex: 'activityStartTime',
      width: 150,
    }, {
      title: '活动结束时间',
      dataIndex: 'activityEndTime',
      width: 150,
    }, {
      title: '活动类型',
      dataIndex: 'activityType',
      width: 100,
      render: (text, record) => {
        const iconCss = {
          backgroundColor: '#f60',
          fontSize: '12px',
          fontWeight: 400,
          padding: '2px 6px',
          borderRadius: '4px',
          color: '#fff',
        };
        return (
          <div>
            <p>{activityType[text]}</p>
            {
              record.needKBSettle ? (<p style={{
                marginTop: 5,
              }}><span style={iconCss}>自动结算</span></p>) : null
            }
            {
              record.bigBrandBuy ? (<p style={{
                marginTop: 5,
              }}><span style={iconCss}>大牌快抢</span></p>) : null
            }
          </div>
        );
      },
    }, {
      title: '状态',
      dataIndex: 'activityStatus',
      width: 100,
      render: (text) => {
        return retailersActStatusNEW[text].text;
      },
    }, {
      title: '活动数据',
      width: 100,
      dataIndex: 'cnt',
      render: (cnt) => {
        const { totalTakenCnt = '--', totalUsedCnt = '--' } = cnt || {};
        return (
            <div>
              <p>发券: {totalTakenCnt}</p>
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
            <span> {sourceChannelName}-{creator} </span>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      render: (text, record, index) => {
        return (<MoreAction
            item={record}
            pid={this.props.params.pid}
            index={index}
            refresh={this.refresh} />);
      },
    }];
    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: this.showTotal,
        currentPage: 1,
      },
      loading: false,
    };
  },

  componentDidMount() {
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
      currentPage: pagination.current,
    };
    this.fetch(params);
  },
  refresh(update) {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: update ? current : 1,
    });
  },
  showTotal(total) {
    return `共 ${total} 条`;
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});
    ajax({
      url: window.APP.crmhomeUrl + '/promo/koubei/salesList.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'success') {
          const pagination = {...this.state.pagination};
          pagination.total = result.page.totalSize;
          pagination.current = result.page.currentPage;
          this.setState({
            loading: false,
            data: result.activityList,
            pagination,
          });
          result.activityList.forEach(({ activityId }, index) =>{
            ajax({
              url: window.APP.crmhomeUrl + '/promo/koubei/salesMarketCount.json',
              method: 'get',
              data: {activityId, pid: this.props.params.pid},
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
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },
  render() {
    const { data, pagination, loading } = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
                 dataSource={data}
                 pagination={pagination}
                 loading={loading}
                 onChange={this.onTableChange}
                 firstShow={!this.props.params}
                 rowKey={rowKey}/>
        </div>
      </div>
    );
  },
});

export default BrandListTable;
