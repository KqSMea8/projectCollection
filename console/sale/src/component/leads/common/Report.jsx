import React, {PropTypes} from 'react';
import {Button, message} from 'antd';
import ajax from 'Utility/ajax';
import ReportModal from './ReportModal';
import {remoteLog} from '../../../common/utils';
const Report = React.createClass({
  propTypes: {
    style: PropTypes.object,
    LeadsType: PropTypes.string,
    downloadeType: PropTypes.string,
  },

  getInitialState() {
    return {
      showModal: false,
      loading: false,
    };
  },

  onClick(name, e) {
    e.preventDefault();
    remoteLog('SHOP_MY_REPORT_DOWN');
    this.setState({
      showModal: true,
      name: (name === 'all') ? 'all' : 'public',
    });
  },

  createDownload(values) {
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/publicLeadsReportCreate.json',
      method: 'post',
      data: {
        ...values,
      },
      success: (result) => {
        if (!result.batchNo) {
          message.error('无法下载，请重试');
          return;
        }
        this.download(result);
      },
    });
  },

  download(data) {
    setTimeout(() => {
      ajax({
        url: window.APP.crmhomeUrl + '/shop/koubei/publicLeadsReportQueryDownload.json',
        method: 'get',
        data: {
          batchNo: data.batchNo,
          isInnerUser: data.isInnerUser,
        },
        success: (result) => {
          if (result.status !== 'succeed') {
            this.setState({
              loading: false,
            });
            message.error(result.resultMsg || '无法下载，请重试');
            return;
          }
          if (result.exportStatus === 'SUCCESS') {
            this.setState({
              loading: false,
            });
            message.success('下载成功');
            this.closeModal();
            location.href = result.exportUrl;
          } else {
            this.download(data);
          }
        },
        error: (result) => {
          this.setState({
            loading: false,
          });
          message.error(result.resultMsg || '无法下载，请重试');
        },
      });
    }, 1000);
  },

  closeModal() {
    this.setState({
      showModal: false,
    });
  },

  render() {
    return (<div style={{display: 'inline-block'}}>
    {
      this.props.downloadeType === 'all' ? <Button onClick={this.onClick.bind(this, 'all')} type="primary" size="large" style={this.props.style}>下载全量leads</Button> : <Button onClick={this.onClick.bind(this, 'public')} style={this.props.style}>下载报表</Button>
    }
      {this.state.showModal ? <ReportModal name={this.state.name} loading={this.state.loading} onOk={this.createDownload} onCancel={this.closeModal}/> : null}
    </div>);
  },
});

export default Report;
