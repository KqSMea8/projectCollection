import React, { PropTypes } from 'react';
import { Form, message } from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import { MerchantSelect } from '@alipay/kb-biz-components';
import { addQueryParams } from '../../../common/urlUtils';
import DownloadModal from './DownloadModal';

/**
 * 活动报名页面需要自定义加上下载链接，主要页面结构从 '../../../common/CRMTpl.jsx'拷贝
 */

const SignUp = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getInitialState() {
    this.params = {
      title: '活动报名',
      // url: window.APP.crmhomeUrl + '/goods/itempromo/recruitItemQueryInit.htm.kb',
      // url: window.APP.crmhomeUrl + '/main.htm.kb',
      url: window.APP.crmhomeUrl + '/goods/itempromo/promotion.htm.kb',
      hash: '#/',
      // hash: '#item-promo',
    };

    return {
      hideCrmhomePage: true,
    };
  },

  componentDidMount() {
    // 为了更友善的提示，给iframe里面暴露 message 方法
    // 莫名的bug，直接输出message会报错
    window.antd = {
      message: {
        error: message.error,
        success: message.success,
      },
    };
  },

  handlePidSelectChange(valueObj) {
    if (valueObj.partnerId && valueObj.partnerId !== this.op_merchant_id) {
      this.op_merchant_id = valueObj.partnerId;

      const { url, hash } = this.params;
      let iframeUrl = addQueryParams(url, { op_merchant_id: this.op_merchant_id });
      iframeUrl += hash ? hash : '';

      this.setState({
        hideCrmhomePage: false,
        iframeRendered: false,
        url: iframeUrl,
      });
    }
  },

  render() {
    const params = this.params;
    return (
      <div>
        <div className="app-detail-header" style={{ position: 'relative' }}>
          {params.title}
          {
            permission('PERMISSION_APPLY_STATISTICS_QUERY') ? (<div style={{
              position: 'absolute',
              top: 22,
              left: 750,
              fontSize: '12px',
            }}>
              <DownloadModal />
            </div>) : null
          }
        </div>
        <div className="kb-detail-main" style = {{paddingBottom: 0}}>
          <Form.Item
            labelCol={{span: 2}}
            wrapperCol={{span: 7}}
            required
            label="选择商户："
          >
            <MerchantSelect
              kbservcenterUrl={window.APP.kbservcenterUrl}
              onChange={this.handlePidSelectChange}
            />
          </Form.Item>
        </div>
        <iframe src={this.state.url} style={{display: this.state.hideCrmhomePage ? 'none' : 'block'}} id="crmhomePage" width="100%" height="998" scrolling="no" border="0" frameBorder="0"></iframe>
      </div>
    );
  },
});

export default Form.create()(SignUp);
