import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';

import ajax from 'Utility/ajax';

class BillsDownload extends Component {
  static propTypes = {
    params: PropTypes.object,
  };
  state = {
    loading: false,
  };
  batchId = '';

  handleClick = () => {
    this.setState({loading: true});
    this.submitExportRequest()
      .then(batchId => {
        this.batchId = batchId;
        this.runPolling();
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };

  runPolling = () => {
    this.queryBatchResult()
      .then(() => {
        this.downloadFile();
        this.setState({loading: false});
      })
      .catch(() => {
        setTimeout(this.runPolling, 3000);
      });
  }

  submitExportRequest() {
    return ajax({
      url: `${window.APP.kbservcenterUrl}/sale/rebate/exportRebateBill.json`,
      data: this.props.params,
    })
      .then(resp => Promise.resolve(resp.batchId))
      .catch((err) => Promise.reject(err));
  }

  queryBatchResult() {
    return ajax({
      url: `${window.APP.kbservcenterUrl}/sale/rebate/queryBatchOrder.json`,
      data: {batchId: this.batchId},
    })
      .then((resp) => {
        if (resp.status === 'SUCCESS') {
          return Promise.resolve();
        }
        return Promise.reject(resp);
      })
      .catch(err => Promise.reject(err));
  }

  downloadFile() {
    window.open(`${window.APP.kbservcenterUrl}/sale/rebate/exportRebateBillFile.json?batchId=${this.batchId}`);
  }

  render() {
    const props = {...this.props};
    return (
      <Button {...props} type="primary"
              onClick={this.handleClick}
              loading={this.state.loading}
      >
        下载报表
      </Button>
    );
  }
}

export default BillsDownload;
