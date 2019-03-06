import React, {PropTypes} from 'react';
import {message} from 'antd';
import ajax from 'Utility/ajax';


const HistoryShopReport = React.createClass({
  propTypes: {
    top: PropTypes.number,
    right: PropTypes.number,
  },
  getInitialState() {
    return {
      reportEnable: false,
    };
  },
  componentDidMount() {
    this.fetchEnableShopTag();
  },
  fetchEnableShopTag() {
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/shopReportEnable.json?reportType=history',
      method: 'get',
      type: 'json',
      success: (result) => {
        this.setState({
          loading: false,
          reportEnable: result.reportEnable,
        });
      },
    });
  },
  generateReport() {
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/shopReportGenerate.json?reportType=history',
      method: 'get',
      type: 'json',
      success: (result) => {
        this.setState({
          loading: false,
        });
        if (!result) {
          return;
        }
        if (result.batchNo) {
          this.downloadReport(result.batchNo);
          message.success('报表生成中，请稍等');
        } else {
          message.error(result.message, 3);
        }
      },
    });
  },
  downloadReport(batchNo) {
    const params = {
      batchNo: batchNo,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/shopReportDownload.json',
      data: params,
      method: 'get',
      type: 'json',
      success: (result) => {
        this.setState({
          loading: false,
        });
        if (!result) {
          return;
        }
        if (result.exportStatus === 'SUCCESS') {
          location.href = result.exportUrl;
        } else if (result.exportStatus === 'FAIL') {
          message.error(result.message, 3);
        } else if (result.exportStatus === 'PROCESSING') {
          this.downloadReport(batchNo);
        }
      },
    });
  },

  render() {
    return (
      <p style={{color: '#F60', position: 'absolute', top: this.props.top || 25, right: this.props.right || 16, zIndex: 1}}>
        {this.state.reportEnable && <span>备注：您在商家中心创建的门店历史，如有需要请点击<a onClick={this.generateReport} style={{marginLeft: 5, textDecoration: 'underline'}}>下载门店列表</a></span>}
      </p>
    );
  },
});

export default HistoryShopReport;
