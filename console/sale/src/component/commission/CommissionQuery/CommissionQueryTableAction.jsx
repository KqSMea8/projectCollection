import React, {PropTypes} from 'react';
import {message} from 'antd';
import ajax from 'Utility/ajax';

const CommissionQueryTableAction = React.createClass({
  propTypes: {
    data: PropTypes.object,
    onRefresh: PropTypes.func,
  },

  onClickDownload(e) {
    e.preventDefault();
    const {data} = this.props;

    ajax({
      url: '/sale/rebate/merchantRebateDownload.json',
      method: 'post',
      data: {
        id: data.id,
        batchNo: data.batchNo,
        activityName: data.activityName,
        activityType: data.activityType,
        activityNo: this.props.data.activityNo,
        settleTime: data.settleTime,
        merchantId: data.merchantId,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          window.open(res.redirectUrl);
        }
      },
    });
  },

  onClickConfirm(e) {
    e.preventDefault();

    ajax({
      url: '/sale/rebate/merchantRebateConfirm.json',
      method: 'post',
      data: {
        id: this.props.data.id,
        batchNo: this.props.data.batchNo,
        merchantId: this.props.data.merchantId,
        settleTime: this.props.data.settleTime,
        activityName: this.props.data.activityName,
        activityType: this.props.data.activityType,
        activityNo: this.props.data.activityNo,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('确认成功');
          this.props.onRefresh();
        }
      },
    });
  },

  onClickReject(e) {
    e.preventDefault();

    ajax({
      url: '/sale/rebate/merchantRebateReject.json',
      method: 'post',
      data: {
        id: this.props.data.id,
        batchNo: this.props.data.batchNo,
        merchantId: this.props.data.merchantId,
        settleTime: this.props.data.settleTime,
        activityName: this.props.data.activityName,
        activityType: this.props.data.activityType,
        activityNo: this.props.data.activityNo,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('驳回成功');
          this.props.onRefresh();
        }
      },
    });
  },

  render() {
    const isShowOthers = this.props.data.displayStatus === 'true';

    return (<div>
      <a onClick={this.onClickDownload}>下载</a>
      {isShowOthers ? <span>
        <span className="ft-bar">|</span>
        <a onClick={this.onClickConfirm}>确认</a>
        <span className="ft-bar">|</span>
        <a onClick={this.onClickReject}>驳回</a>
      </span> : null}
    </div>);
  },
});

export default CommissionQueryTableAction;
