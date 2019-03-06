import React, { PropTypes } from 'react';
import { Form, message } from 'antd';
import { getQueryFromURL } from 'Common/utils';
import { addQueryParams } from './urlUtils';
import { MerchantSelect } from '@alipay/kb-biz-components';

class CRMTpl extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    params: PropTypes.object,
  }
  static contextTypes = {
    location: PropTypes.any,
  }
  static defaultProps = {
    params: {},
  };

  state = {
    hideCrmhomePage: true,
    iframeRendered: false,
    iframeHeight: this.props.params.autoHeight || 998,
  }

  componentWillMount() {
    this.messageHandler = e => {
      const postData = JSON.parse(e.data);
      const action = postData.action;
      switch (action) {
      case 'iframeHeight':
        this.setState({
          iframeHeight: postData.height,
        });
        break;
      case 'warning':
      case 'warn': {
        message.warn(postData.message);
        break;
      }
      case 'error': {
        message.error(postData.message);
        break;
      }
      case 'success': {
        message.success(postData.message);
        break;
      }
      default:
        break;
      }
    };
    window.addEventListener('message', this.messageHandler);

    // 2018-1-19 TKA 需求，支持 url 带参数直接跳转到商户页
    const pid = getQueryFromURL(this.context.location.search).pid;
    if (pid) {
      this.handlePidSelectChange({
        partnerId: pid,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageHandler);
    this.messageHandler = null;
  }

  messageHandler = null;

  handlePidSelectChange = (valueObj) => {
    if (valueObj.partnerId && valueObj.partnerId !== this.op_merchant_id) {
      this.op_merchant_id = valueObj.partnerId;

      const { url, hash } = this.props.params;
      let iframeUrl = addQueryParams(url, { op_merchant_id: this.op_merchant_id });
      iframeUrl += hash ? hash : '';

      this.setState({
        hideCrmhomePage: false,
        iframeRendered: false,
        url: iframeUrl,
      });
    }
  }

  handleLoaded = () => {
    this.setState({
      iframeRendered: true,
    });
  }

  render() {
    const { params } = this.props;
    const { hideCrmhomePage, iframeRendered } = this.state;
    const showloading = !hideCrmhomePage && !iframeRendered ? true : false;

    return (
      <div>
        <div className="app-detail-header">
          {params.title}
        </div>
        <div className="kb-detail-main" style={{ paddingBottom: 0 }}>
          <Form.Item
            labelCol={{span: 2}}
            wrapperCol={{span: 7}}
            required
            label="选择商户："
          >
            <MerchantSelect
              kbservcenterUrl={window.APP.kbservcenterUrl}
              includeTeam={params.includeTeam}
              onChange={this.handlePidSelectChange}
              {...params.pidSelectOptions}
            />
          </Form.Item>
        </div>
        <div className="iframe-wrapper ant-spin-nested-loading" style={{ textAlign: 'center', minHeight: this.state.iframeHeight, position: 'relative' }}>
          <div className="ant-spin ant-spin-spinning ant-table-without-pagination ant-table-spin-holder"
            style={{ top: 16, display: showloading ? 'block' : 'none' }}>
            <span className="ant-spin-dot ant-spin-dot-first"></span>
            <span className="ant-spin-dot ant-spin-dot-second"></span>
            <span className="ant-spin-dot ant-spin-dot-third"></span>
            <div className="ant-spin-text" >加载中...</div>
          </div>
          <iframe
            src={this.state.url}
            onLoad={this.handleLoaded}
            onChange={this.handleLoaded}
            style={{ display: this.state.hideCrmhomePage ? 'none' : 'block' }}
            id="crmhomePage"
            width="100%"
            height={this.state.iframeHeight}
            scrolling="no"
            frameBorder="0"
            frameBorder="0"
          ></iframe>
        </div>

      </div>
    );
  }
}

export default CRMTpl;
