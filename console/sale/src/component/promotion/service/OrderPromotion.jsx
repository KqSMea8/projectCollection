import React from 'react';
import {Table, Icon, message, Modal, Popover} from 'antd';
import ajax from 'Utility/ajax';
import './index.less';
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
      title: '推广任务类型',
      dataIndex: 'taskTypeName',
      render: (_, r) => {
        return r.taskTypeName.slice(0, 10);
      },
    }, {
      title: (<span>服务信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称 | ID</span></span>),
      render: (_, r) => {
        return (<span>{r.commodityName && r.commodityName.slice(0, 10) || '--'}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.commodityId}</span></span>);
      },
    }, {
      title: (<span>任务信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称 | ID</span></span>),
      render: (_, r) => {
        return (<span>{r.taskName && r.taskName.slice(0, 10) || '--'}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.taskId}</span></span>);
      },
    }, {
      title: '推广时间',
      render: (_, r) => {
        return (<span>{r.startTime} ~<br/>{r.endTime}</span>);
      },
    }, {
      title: (<div>当前佣金政策<Popover title="本月执行的佣金政策" placement="top">
        <Icon type="info-circle" style={{color: '#2db7f5'}}/>
      </Popover></div>),
      dataIndex: 'scale',
      render: (_) => {
        // return (<span>{accMul(parseFloat(_), 100)}%<Icon style={{color: '#2db7f5', marginLeft: '4px', cursor: 'pointer'}} type="clock-circle" onClick={this.onClickScale.bind(this, r.taskId)}/></span>);
        return (<span>{accMul(parseFloat(_), 100)}%</span>);
      },
    }, {
      title: (<span>ISV信息<br/><span style={{color: 'rgb(153,153,153)'}}>名称 | ID | 联系方式</span></span>),
      render: (_, r) => {
        return (<span>{r.isvName || '--'}<br/><span style={{color: 'rgb(153,153,153)'}}>{r.isvId || '--'}</span><br/><span style={{color: 'rgb(153,153,153)'}}>{r.contact}</span></span>);
      },
    }, {
      title: '操作',
      render: (_, r) => {
        if (r.status === 'EFFECTIVE') {
          return (<a href={`#/promotion/claim/${r.taskId}`} >认领</a>);
        }
        return null;
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
      url: window.APP.kbopenprodUrl + '/commodity/taskQuery/queryUnClaimTaskList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed' && res.data) {
          const pagination = {...this.state.pagination};
          pagination.total = res.page && res.page.totalSize;

          res.data = res.data.map((d, i) => {
            d.key = i;
            return d;
          });

          this.setState({
            loading: false,
            data: res.data,
            pagination,
          });
        } else {
          message.error(res.errorMsg);
          this.setState({ data: [] });
        }
      },
      error: (error) => {
        this.setState({
          loading: false,
          data: [],
        });
        message.error(error);
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
        推广任务
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
