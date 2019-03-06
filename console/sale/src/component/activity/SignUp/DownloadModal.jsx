import React from 'react';
import ajax from 'Utility/ajax';
import { Popover, Button, Icon } from 'antd';

/**
 * 下载商家活动报名浮层
 */

const DownloadModal = React.createClass({
  getInitialState() {
    return {
      visible: false, // 是否展示气泡
      status: 'LOADING', // 气泡显示的场景
      fileUrl: '',
    };
  },

  show() {
    this.setState({
      visible: true,
      status: 'LOADING',
    });

    this.fetch();
  },

  hide() {
    this.clear();
    this.setState({
      visible: false,
    });
  },

  clear() {
    clearInterval(this.timeFlag);
    this.timeFlag = null;
  },

  fetch() {
    ajax({
      url: window.APP.kbopenprodUrl + '/recruit/merchant/statisticsQuery.json',
    }).then(res => {
      if (res.status === 'succeed' && res.data) {
        const { status, fileKey, flowId } = res.data;

        if (status === 'SUCCESS' && !fileKey) {
          // 没有数据
          this.clear();
          this.setState({ status: 'NODATA' });
        } else if (status === 'SUCCESS') {
          // 完成，可以下载
          this.clear();
          this.setState({
            status: 'SUCCESS',
            fileUrl: window.APP.kbopenprodUrl
              + '/recruit/merchant/statisticsDownload.htm?flowId=' + flowId,
          });
        } else if (status === 'FAIL') {
          // 失败
          this.clear();
          this.setState({
            status: 'ERROR',
          });
        } else if (status === 'PROCESSING') {
          // 进行中
          if (!this.timeFlag) {
            this.timeFlag = setInterval(this.fetch, 10000);
          }
        }
      }
    }).catch(res => {
      if (res.status === 'failed'
        || res.buserviceErrorCode === 'USER_HAS_NOT_PERMISSION') {
        this.setState({
          visible: false,
        });
      }
    });
  },

  render() {
    const { visible, status, fileUrl } = this.state;

    let content = null;
    if (status === 'LOADING') {
      content = (<div>
        <Icon type="loading" style={{ color: '#fa0' }} />
        <span style={{ paddingLeft: 8 }}>{'正在生成数据，请稍候5~30分钟...'}</span>
      </div>);
    } else if (status === 'SUCCESS') {
      content = (<div>
        <p>
          <Icon type="check-circle" style={{ color: '#87d068' }} />
          <span style={{ paddingLeft: 8 }}>数据处理完毕，请<a href={fileUrl} target="_blank">下载报表</a></span>
        </p>
        <p style={{ marginTop: 8, textAlign: 'right' }}>
          <Button type="primary" size="small" onClick={ this.hide }>取消</Button>
        </p>
      </div>);
    } else if (status === 'ERROR') {
      content = (<div>
        <Icon type="cross-circle" style={{ color: '#f50' }} />
        <span style={{ paddingLeft: 8 }}>数据生成失败，请<a onClick={ this.show }>重试</a></span>
      </div>);
    } else if (status === 'NODATA') {
      content = (<div>
        <p>
          <Icon type="check-circle" style={{ color: '#87d068' }} />
          <span style={{ paddingLeft: 8 }}>没有相关数据</span>
        </p>
        <p style={{ marginTop: 8, textAlign: 'right' }}>
          <Button type="primary" size="small" onClick={ this.hide }>关闭</Button>
        </p>
      </div>);
    }

    const popProps = {
      visible,
      trigger: 'click',
      placement: 'bottom',
      content,
    };

    return (<div>
      <span style={{ display: 'inline-block', marginRight: 10, color: '#999' }}>{'仅支持T+1数据'}</span>
      <Popover {...popProps} >
        <Button type="primary" onClick={ this.show }>下载商家报名数据</Button>
      </Popover>
    </div>);
  },

});

export default DownloadModal;
