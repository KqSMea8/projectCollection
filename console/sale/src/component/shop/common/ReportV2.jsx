import React from 'react';
import fetch from '@alipay/kb-fetch';
import { Button, Modal, message } from 'antd';

const exportUrls = {
  [1]: `${window.APP.kbsalesUrl}/shop/koubei/exportMyShops.json`,
  [2]: `${window.APP.kbsalesUrl}/shop/koubei/exportTeamShops.json`,
};

export default class extends React.Component {

  static propTypes = {
    bdType: React.PropTypes.string, // 1: 我的门店；2: 团队门店
    style: React.PropTypes.any,
    getParam: React.PropTypes.func,
  };

  state = {
    loading: false,
  };

  onClick() {
    this.props.getParam(param => {
      this.setState({ loading: true });
      fetch.ajax({
        url: exportUrls[this.props.bdType],
        type: 'json',
        data: {
          ...param,
          pageSize: 10, // 后端模型会有限制必须入参，导出接口会忽略这个入参
          pageNum: 1,
        }
      }).then(res => {
        // 创建导出任务成功
        message.info('正在处理数据，请勿关闭页面...');
        this.loopQueryBatchReady(res.data);
      }).catch(() => {
        this.setState({ loading: false });
      });
    });
  }

  loopQueryBatchReady(batchNo) {
    setTimeout(() => {
      fetch.ajax({
        url: `${window.APP.kbsalesUrl}/batch/queryBatchOrderStatus.json`,
        data: {
          batchNo,
        }
      }).then(res => {
        if (res.resultCode === 'BATCH_STATUS_NOT_SUPPORT') {
          // 未生成，继续轮询
          this.loopQueryBatchReady(batchNo);
        } else {
          // 导出完成
          this.setState({ loading: false });
          this.downloadBatchResult(batchNo);
        }
      }).catch(e => {
        this.setState({ loading: false });
        Modal.error({
          title: '错误',
          content: e.message,
        });
      });
    }, 1000);
  }

  downloadBatchResult(batchNo) {
    Modal.success({
      title: '处理成功',
      content: '处理处理完毕，请下载报表',
      okText: '下载报表',
      onOk: () => {
        window.open(`${window.APP.kbsalesUrl}/batch/downloadBatchResult.htm?batchNo=${batchNo}`);
      },
    });
  }

  render() {
    const { style } = this.props;
    const { loading } = this.state;

    return (<Button onClick={this.onClick.bind(this)} style={style} loading={loading}>下载报表</Button>);
  }
}
