import React from 'react';
import {Table, Icon, Popover, message, Modal, Popconfirm} from 'antd';
import ajax from 'Utility/ajax';
import {accMul} from '../utils';

const OrderPromotion = React.createClass({
  getInitialState() {
    this.policyColumns = [{
      title: '佣金政策',
      dataIndex: 'scale',
      key: 'scale',
      render: (text, record) => {
        const current = new Date().getTime();
        const startTimeStamp = new Date(record.startTime).getTime();
        const endTimeStamp = new Date(record.endTime).getTime();
        if (current < startTimeStamp) {
          return <span>{accMul(parseFloat(text), 100)}%<a className="policyTag">未来</a></span>;
        } else if (current >= startTimeStamp && current <= endTimeStamp) {
          return <span>{accMul(parseFloat(text), 100)}%<a className="policyTag">当前</a></span>;
        }
        return <span>{accMul(parseFloat(text), 100)}%</span>;
      },
    }, {
      title: '生效日期',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '创建/修改日期',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
    }];
    this.columns = [{
      title: (<span>服务信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称 | ID</span></span>),
      render: (_, r) => {
        return (<span>{r.commodityName}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.commodityId}</span></span>);
      },
    }, {
      title: (<span>任务信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称 | ID</span></span>),
      render: (_, r) => {
        return (<span>{r.taskName}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.taskId}</span></span>);
      },
    }, {
      title: '推广时间',
      render: (_, r) => {
        return (<span>{r.startTime} ~<br/>{r.endTime}</span>);
      },
    }, {
      title: (<span>佣金政策<Popover title="佣金政策：本月执行的佣金政策" placement="top">
        <Icon type="info-circle" style={{color: '#2db7f5'}}/>
      </Popover></span>),
      dataIndex: 'scale',
      render: (_, r) => {
        return (<span>{accMul(parseFloat(_), 100)}%<Icon style={{color: '#2db7f5', marginLeft: '4px', cursor: 'pointer'}} type="clock-circle" onClick={this.onClickScale.bind(this, r.taskId)}/></span>);
      },
    }, {
      title: (<span>ISV信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称 | ID | 联系方式</span></span>),
      render: (_, r) => {
        return (<span>{r.isvName}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.isvId}</span><br/><span style={{color: 'rgb(153,153,153)'}}>{r.contact}</span></span>);
      },
    }, {
      title: '状态',
      render: (_, r) => {
        if (r.rejectReason) {
          return (<p>{r.statusName}
            <Popover placement="top" width={200} content={r.rejectReason} title="下架原因">
              <Icon type="info-circle" style={{color: '#2db7f5'}}/>
            </Popover>
            </p>);
        }
        return (<span>{r.statusName}</span>);
      },
    }, {
      title: '操作',
      render: (_, r, index) => {
        let ret;
        switch (r.status) {
        case 'INITIAL':
          // 未开始
          ret = (<p>
          <a href={`#/promotion/myOrder/detail/${r.taskId}`}>查看</a><br/>
          <Popconfirm title="确定删除此推广任务吗?" onConfirm={this.onDeleteTask.bind(this, index, r.taskId)} okText="确定" cancelText="取消">
            <a href="#">删除</a>
          </Popconfirm>
        </p>);
          break;
        case 'EFFECTIVE':
          // 进行中
          ret = (<p>
            <a href={`#/promotion/myOrder/detail/${r.taskId}`}>查看</a><br/>
            <a href="#/promotion/bill">账单</a>
          </p>);
          break;
        case 'CLOSED':
          // 已结束
        case 'SUSPEND':
          // 已下架
          ret = (<p>
              <a href={`#/promotion/myOrder/detail/${r.taskId}`}>查看</a><br/>
              <a href="#/promotion/bill">账单</a>
              </p>);
          break;
        default:
          ret = (<span>-</span>);
        }

        return ret;
      },
    }];
    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        current: 1,
      },
      loading: false,
      firstShow: true,
    };
  },

  componentDidMount() {
    this.refresh();
  },

  onClickScale(id) {
    ajax({
      url: window.APP.kbopenprodUrl + '/commodity/taskQuery/queryTaskInfo.json',
      method: 'get',
      data: {taskId: id},
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            scaleHistories: res.data && res.data.policies || [],
            policyModalVisible: true,
          });
        } else {
          message.error(res.resultMsg);
        }
      }, error: (_, error) => {
        message.error(error);
      },
    });
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
      pageNum: pagination.current,
    };
    this.fetch(params);
  },

  policyModalClose() {
    this.setState({
      policyModalVisible: false,
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});

    ajax({
      url: window.APP.kbopenprodUrl + '/commodity/taskQuery/queryClaimedTaskList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = res.page && res.page.totalSize || res.data.length;

          res.data = res.data.map((d, i) => {
            d.key = i;
            return d;
          });

          this.setState({
            loading: false,
            data: res.data,
            pagination,
          });
        }
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        });
      },
    });
  },

  render() {
    const {data, pagination, loading, policyModalVisible, scaleHistories} = this.state;
    const locale = {
      emptyText: '暂无数据',
    };
    return (<div>
      <div className="app-detail-header" style={{position: 'relative'}}>
        我的任务
        <p style={{fontSize: '12px', position: 'absolute', right: '20px', top: '30px'}}>
          <Icon type="info-circle" style={{color: '#2db7f5', fontSize: '16px', marginRight: '6px'}}/>
          只包含按线下交易额分佣模式
        </p>
      </div>
      <div className="app-detail-content-padding promotion">
        <Table columns={this.columns}
               locale={locale}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onChange={this.onTableChange}/>
      </div>
      <Modal title="佣金政策记录" visible={policyModalVisible} footer={null} onOk={this.policyModalClose}
        onCancel={this.policyModalClose}>
          <Table columns={this.policyColumns} dataSource={scaleHistories} />
        </Modal>
    </div>);
  },
});

export default OrderPromotion;
