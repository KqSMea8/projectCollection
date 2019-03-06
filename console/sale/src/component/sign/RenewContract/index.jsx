import React from 'react';
import ajax from 'Utility/ajax';
import { message, Button, Spin } from 'antd';
import { debounce } from 'lodash';
import ErrorPage from '../../../common/ErrorPage';
import './protocol.less';

export default class RenewContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,  // 是否正在提交
      isSigned: false,      // 已签
      contract: null,         // 合同内容 (html 片段)
      isLoading: true,
    };
  }

  componentDidMount() {
    ajax({
      // url: `${window.APP.crmhomeUrl}/merchant/merchantSignProtocol.json.kb?alias=kpSign`,
      url: `${window.APP.crmhomeUrl}/merchant/koubei/panIndustrySignProtocol.json.kb`,
      method: 'get',
      success: res => {
        const state = {
          isLoading: false,
        };
        if (res.status === 'succeed') {
          state.contract = res.data[0].protocolContent;
        } else {
          message.error(res.resultMsg || '协议内容获取失败，请稍后重试');
        }
        this.setState(state);
      },
      error: res => {
        message.error(res && res.resultMsg || '协议内容获取失败，请稍后重试');
        this.setState({ isLoading: false });
      },
    });
  }

  confirmHandle = debounce(() => {
    this.setState({
      isSubmitting: true,
    });
    ajax({
      url: `${window.APP.crmhomeUrl}/merchant/koubei/panIndustryReSign.json.kb`,
      method: 'post',
      success: res => {
        const state = { isSubmitting: false };
        if (res.status === 'succeed') {
          message.info('续签成功');
          state.isSigned = true;
        } else {
          message.error(res.resultMsg || '续签失败，请稍后再试。');
        }
        this.setState(state);
      },
      error: res => {
        this.setState({
          isSubmitting: false,
        });
        message.error(res && res.resultMsg || '无法连接网络');
      },
    });
  }, 150);

  render() {
    if (this.state.isLoading) {
      return <div style={{ textAlign: 'center' }}><Spin /></div>;
    }
    if (!this.state.contract) {
      return <ErrorPage type="initialAjaxFail" />;
    }
    return (
      <div style={{ paddingTop: 50, lineHeight: 5 }} className="renew-protocol">
        <div dangerouslySetInnerHTML={{__html: this.state.contract}} />
        <div style={{ textAlign: 'center' }}>
          <Button
            type={this.state.isSigned ? 'ghost' : 'primary'}
            disabled={this.state.isSigned || !this.state.contract}
            onClick={this.confirmHandle}
            loading={this.state.isSubmitting}
          >
            {this.state.isSigned ? '已确认' : '确认续签'}
          </Button>
        </div>
      </div>
    );
  }
}
