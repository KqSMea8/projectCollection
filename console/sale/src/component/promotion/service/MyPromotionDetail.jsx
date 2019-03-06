import React from 'react';
import {Breadcrumb, Alert, Button, Modal, Table} from 'antd';
import ajax from 'Utility/ajax';
import {accMul} from '../utils';

const MyPromotionDetail = React.createClass({
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
    return {
      data: {},
    };
  },

  componentDidMount() {
    this.fetch();
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };

    ajax({
      url: window.APP.kbopenprodUrl + '/commodity/taskQuery/queryTaskInfo.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            data: res.data,
          });
        }
      },
      error: () => {
        this.setState({
          data: [],
        });
      },
    });
  },

  showReasonModal(e) {
    e.preventDefault();
    const reason = this.state.data && this.state.data.rejectReason || '--';
    Modal.confirm({
      title: '下架原因',
      content: reason,
      okText: '知道了',
      cancelText: '取消',
    });
  },

  viewPolicyHistory(e) {
    e.preventDefault();
    this.setState({
      policyModalVisible: true,
    });
  },

  policyModalClose() {
    this.setState({
      policyModalVisible: false,
    });
  },

  renderBanner() {
    const {status} = this.state.data;
    const billUrl = `#/promotion/bill`;
    if (status === 'EFFECTIVE') {
      return (<Alert
        message="推广中"
        description={<div><a href={billUrl}><Button>账单</Button></a></div>}
        type="success"
        showIcon
      />);
    } else if (status === 'SUSPEND') {
      return (<Alert
        message={
          <span style={{'display': 'block', 'marginTop': '-2px', 'lineHeight': '18px'}}>
            已下架<br/>
            <a href="" onClick={this.showReasonModal.bind(this)}>查看下架原因</a>
          </span>
        }
        description={<a href={billUrl}><Button>账单</Button></a>}
        type="warning"
        showIcon
      />);
    } else if (status === 'CLOSED') {
      return (<Alert
        message="已结束"
        type="warning"
        description={<a href={billUrl}><Button>账单</Button></a>}
        showIcon
      />);
    }
  },

  render() {
    const { data, policyModalVisible } = this.state;
    const hasPolicyHistory = data.policies && data.policies.length || false;
    return (<div>
      <div className="app-detail-header" style={{position: 'relative'}}>
          <Breadcrumb>
            <Breadcrumb.Item><a href="#/promotion/myOrder">我的任务</a></Breadcrumb.Item>
            <Breadcrumb.Item>任务详情</Breadcrumb.Item>
          </Breadcrumb>
      </div>
      <div className="app-detail-content-padding offlineCreate">
        {this.renderBanner()}
         <table className="kb-detail-table-4" style={{marginTop: 20}}>
          <tbody>
            <tr>
              <td className="kb-detail-table-label">推广任务模式</td>
              <td colSpan="3">按线下交易额分佣
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">推广任务类型</td>
              <td colSpan="3">{data.taskTypeName || '--'}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">推广服务名称</td>
              <td colSpan="3">{data.commodityName || '--'}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">推广任务名称</td>
              <td colSpan="3">{data.taskName || '--'}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">推广时间</td>
              <td colSpan="3">{data.startTime} ~ {data.endTime}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">佣金计算方式</td>
              <td colSpan="3">线下交易金额百分比佣金
              {/* {data.feeTypeName}{data.scaleType} */}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">当前佣金政策</td>
              <td colSpan="3">
              {data.scale ? accMul(data.scale, 100) + '%' : '--'}
              {
                hasPolicyHistory ? <a href="" style={{marginLeft: '8px'}}
                  onClick={this.viewPolicyHistory.bind(this)}>佣金政策记录</a> : null
              }
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">ISV名称</td>
              <td colSpan="3">{data.isvName || '--'}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">ISV  ID</td>
              <td colSpan="3">{data.isvId || '--'}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">ISV 联系方式</td>
              <td colSpan="3">{data.contact || '--'}
              </td>
            </tr>
          </tbody>
        </table>
        <Modal title="佣金政策记录" visible={policyModalVisible} footer={null} onOk={this.policyModalClose}
        onCancel={this.policyModalClose}>
          <Table columns={this.policyColumns} dataSource={data.policies} />
      </Modal>
      </div>
    </div>);
  },
});

export default MyPromotionDetail;
